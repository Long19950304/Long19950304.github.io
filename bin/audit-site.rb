#!/usr/bin/env ruby
# Check generated pages before deployment: bundle exec ruby bin/audit-site.rb
require 'nokogiri'
require 'uri'
require 'json'

root = File.expand_path(ARGV[0] || '_site')
abort "Build directory missing: #{root}" unless File.directory?(root)
documents = Dir.glob("#{root}/**/*.html").to_h { |file| [file, Nokogiri::HTML(File.read(file))] }
abort 'No generated HTML pages found' if documents.empty?
issues = []
references = 0
managed = documents.select { |_, doc| doc.at_css('#main-content') }

documents.each do |file, doc|
  path = file.delete_prefix(root)
  # Preserve URI separators when encoding spaces and non-ASCII file names.
  base = URI("https://www.zhaozhilong.com#{URI::DEFAULT_PARSER.escape(path, /[^\x21-\x7e]/)}")
  ids = doc.css('[id]').map { |node| node['id'] }
  ids.tally.each { |id, count| issues << [path, 'duplicate-id', id] if count > 1 }
  if managed.key?(file)
    issues << [path, 'heading-count', doc.css('h1').size] unless doc.css('h1').size == 1
    issues << [path, 'missing-description'] if doc.at_css('meta[name="description"]')&.[]('content').to_s.strip.empty?
    issues << [path, 'invalid-language'] unless %w[en zh].include?(doc.at_css('html')&.[]('lang'))
    doc.css('img:not([alt])').each { |image| issues << [path, 'missing-alt', image['src']] }
  end

  doc.css('a[href],img[src],script[src],link[href],audio[src],video[src],video[poster],source[src],iframe[src]').each do |node|
    %w[href src poster].each do |attribute|
      raw = node[attribute]
      next if raw.to_s.empty? || raw.start_with?('data:', 'mailto:', 'tel:', 'javascript:', 'blob:')
      begin
        target_uri = URI.join(base, URI::DEFAULT_PARSER.escape(raw, /[^\x21-\x7e]/))
        next unless %w[www.zhaozhilong.com zhaozhilong.com].include?(target_uri.host)
        url_path = URI::DEFAULT_PARSER.unescape(target_uri.path)
        next if url_path.start_with?('/api/')
        target = File.expand_path(url_path.delete_prefix('/'), root)
        next unless target.start_with?(root + '/')
        target = File.join(target, 'index.html') if File.directory?(target)
        references += 1
        unless File.file?(target)
          issues << [path, 'missing-file', raw]
          next
        end
        fragment = URI::DEFAULT_PARSER.unescape(target_uri.fragment.to_s)
        if !fragment.empty? && documents.key?(target)
          found = documents[target].css('[id],a[name]').any? { |el| el['id'] == fragment || el['name'] == fragment }
          issues << [path, 'missing-anchor', raw] unless found
        end
      rescue URI::InvalidURIError
        issues << [path, 'invalid-url', raw]
      end
    end
  end
end

%w[_audit infra server bin .env .git AGENTS.md].each do |private_path|
  issues << ['/', 'private-file-published', private_path] if File.exist?(File.join(root, private_path))
end
puts JSON.pretty_generate(html_pages: documents.size, site_pages: managed.size, internal_references: references, issues: issues.uniq)
exit(issues.empty? ? 0 : 1)
