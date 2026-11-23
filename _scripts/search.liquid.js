---
permalink: /assets/js/search-data.js
---
(() => {
  const ninja = document.querySelector('ninja-keys');
  if (!ninja) return;
  const zh = document.documentElement.lang.startsWith('zh');
  const lang = zh ? 'zh' : 'en';
  const entries = [
    {% for item in site.pages %}
      {% if item.translation_key and item.layout != 'redirect' %}
        {% include search-item.liquid item=item group='pages' %}
      {% endif %}
    {% endfor %}
    {% for item in site.projects %}
      {% unless item.archived %}
        {% include search-item.liquid item=item group='projects' %}
      {% endunless %}
    {% endfor %}
  ];
  const sections = zh
    ? { pages: '网站页面', projects: '研究方向' }
    : { pages: 'Pages', projects: 'Research areas' };
  {% if site.socials_in_search %}
  const socials = {{ site.data.socials | jsonify }};
  const contact = (title, url) => entries.push({ title, url, lang, group: 'contact', description: '' });
  sections.contact = zh ? '联系与学术主页' : 'Contact and profiles';
  if (socials.email) contact(zh ? '邮箱' : 'Email', 'mailto:' + socials.email);
  if (socials.scholar_userid) contact('Google Scholar', 'https://scholar.google.com/citations?user=' + encodeURIComponent(socials.scholar_userid));
  if (socials.orcid_id) contact('ORCID', 'https://orcid.org/' + encodeURIComponent(socials.orcid_id));
  if (socials.github_username) contact('GitHub', 'https://github.com/' + encodeURIComponent(socials.github_username));
  {% endif %}
  ninja.data = entries.filter(item => item.lang === lang).map(item => ({
    id: item.url,
    title: item.title,
    description: item.description,
    section: sections[item.group],
    handler: () => { window.location.href = item.url; },
  }));
})();
