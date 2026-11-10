require 'bibtex'
require 'date'

module Jekyll
  class RecentPublicationsGenerator < Generator
    safe true

    def generate(site)
      records = []
      %w[accepted papers].each do |file|
        path = site.in_source_dir("_bibliography/#{file}.bib")
        next unless File.exist?(path)

        BibTeX.open(path).query('@article').each do |entry|
          next if entry[:homepage].to_s == 'false'

          accepted = entry[:pubstate].to_s == 'accepted'
          date = if accepted
                   entry[:accepted_date].to_s
                 else
                   final_date = entry[:final_publication_date].to_s
                   final_date.empty? ? entry[:publication_date].to_s : final_date
                 end
          # Legacy records with only a year sort by year; never display a
          # fabricated month/day. Accepted articles require a verified date.
          date = entry[:year].to_s if date.empty? && !accepted
          next unless date.match?(/\A\d{4}(?:-\d{2}(?:-\d{2})?)?\z/)

          parts = date.split('-').map(&:to_i)
          sort_date = Date.new(parts[0], parts[1] || 1, parts[2] || 1)
          next if sort_date > site.time.to_date

          records << { 'key' => entry.key, 'file' => file, 'date' => date,
                       'accepted' => accepted, 'english' => entry[:language].to_s == 'en',
                       'sort_date' => sort_date.iso8601 }
        end
      end
      site.data['recent_publications'] = records.sort_by { |row| [row['english'] ? 1 : 0, row['sort_date'], row['key']] }.reverse.first(3)
    end
  end
end
