(() => {
  const ninja = document.querySelector('ninja-keys');
  if (!ninja) return;
  const zh = document.documentElement.lang.startsWith('zh');
  const lang = zh ? 'zh' : 'en';
  const entries = [
    
      
    
      
        {
  url: "/zh/",
  lang: "zh",
  title: "关于",
  description: "赵志龙，现于五邑大学人文与政法学院工作，研究健康与公共传播、媒体使用与信任，以及AI for Social Science。",
  group: "pages",
},

      
    
      
        {
  url: "/",
  lang: "en",
  title: "About",
  description: "Zhilong Zhao works at Wuyi University. Research on health and public communication, media use and trust, and AI for Social Science.",
  group: "pages",
},

      
    
      
    
      
        {
  url: "/zh/content-usage/",
  lang: "zh",
  title: "版权与使用说明",
  description: "本站内容的使用范围、署名要求与权利联系。",
  group: "pages",
},

      
    
      
        {
  url: "/content-usage/",
  lang: "en",
  title: "Copyright and content use",
  description: "Permitted uses, attribution, and rights enquiries.",
  group: "pages",
},

      
    
      
    
      
    
      
    
      
    
      
        {
  url: "/zh/media/chinese-passenger/",
  lang: "zh",
  title: "普快列车",
  description: "实验短片 · 预告片与剧照。",
  group: "pages",
},

      
    
      
        {
  url: "/media/chinese-passenger/",
  lang: "en",
  title: "Chinese Passenger",
  description: "Experimental short film · Trailer and stills.",
  group: "pages",
},

      
    
      
    
      
    
      
        {
  url: "/zh/media/tongjian-shian/",
  lang: "zh",
  title: "通鉴史案",
  description: "中英双语历史节目 · 海报与剧照。",
  group: "pages",
},

      
    
      
        {
  url: "/media/tongjian-shian/",
  lang: "en",
  title: "LongXiGE Reads Zizhi Tongjian",
  description: "Bilingual history series · Posters and stills.",
  group: "pages",
},

      
    
      
        {
  url: "/zh/media/xianxian-dialogues/",
  lang: "zh",
  title: "先贤对谈",
  description: "AI 虚构访谈与对话 · 节目海报、截图与样片咨询。",
  group: "pages",
},

      
    
      
        {
  url: "/media/xianxian-dialogues/",
  lang: "en",
  title: "Xianxian Dialogues",
  description: "AI-generated fictional interviews and dialogues · Posters, stills, and sample enquiries.",
  group: "pages",
},

      
    
      
        {
  url: "/zh/media/",
  lang: "zh",
  title: "个人创作",
  description: "作品总览：影像系列与实验短片。",
  group: "pages",
},

      
    
      
        {
  url: "/media/",
  lang: "en",
  title: "Creative Work",
  description: "Selected video series and experimental film.",
  group: "pages",
},

      
    
      
    
      
    
      
        {
  url: "/zh/publications/",
  lang: "zh",
  title: "论文",
  description: "已发表与已接收期刊论文、预印本、工作论文与会议论文。",
  group: "pages",
},

      
    
      
        {
  url: "/publications/",
  lang: "en",
  title: "Publications",
  description: "Published and accepted journal articles, preprints, working papers, and conference papers.",
  group: "pages",
},

      
    
      
        {
  url: "/zh/research/",
  lang: "zh",
  title: "项目",
  description: "主持科研项目、省级人才项目，以及参与的科研、地方志与口述史项目。",
  group: "pages",
},

      
    
      
        {
  url: "/research/",
  lang: "en",
  title: "Projects",
  description: "Research grants, talent support, collaborative research, and local and oral history projects.",
  group: "pages",
},

      
    
      
    
      
    
      
        {
  url: "/zh/service/",
  lang: "zh",
  title: "学术服务",
  description: "学术服务与期刊同行评审。",
  group: "pages",
},

      
    
      
        {
  url: "/service/",
  lang: "en",
  title: "Academic Service",
  description: "Academic service and journal peer review.",
  group: "pages",
},

      
    
      
        {
  url: "/zh/teaching/digital-humans/",
  lang: "zh",
  title: "数字人视频作品",
  description: "现代教育技术 · 学生作品展示",
  group: "pages",
},

      
    
      
        {
  url: "/teaching/digital-humans/",
  lang: "en",
  title: "Digital-human videos",
  description: "Modern Educational Technology · Student work",
  group: "pages",
},

      
    
      
        {
  url: "/zh/teaching/games/",
  lang: "zh",
  title: "学习小游戏作品",
  description: "现代教育技术课程学生小游戏作品展示。",
  group: "pages",
},

      
    
      
        {
  url: "/teaching/games/",
  lang: "en",
  title: "Learning Games",
  description: "Student-created learning games from the Modern Educational Technology course.",
  group: "pages",
},

      
    
      
        {
  url: "/zh/teaching/modern-educational-technology/",
  lang: "zh",
  title: "现代教育技术",
  description: "课程介绍、学习活动与学生作品展示。",
  group: "pages",
},

      
    
      
        {
  url: "/teaching/modern-educational-technology/",
  lang: "en",
  title: "Modern Educational Technology",
  description: "Course overview, learning activities, and student work showcase.",
  group: "pages",
},

      
    
      
        {
  url: "/zh/teaching/",
  lang: "zh",
  title: "教学",
  description: "现代教育技术、大学语文与微电影制作：教学理念、课程介绍与学生作品。",
  group: "pages",
},

      
    
      
        {
  url: "/teaching/",
  lang: "en",
  title: "Teaching",
  description: "Modern Educational Technology, College Chinese, and Microfilm Production — teaching, courses, and student work.",
  group: "pages",
},

      
    
      
    
      
    
      
    
    
      
        {
  url: "/projects/1_project/",
  lang: "en",
  title: "AI for Social Science",
  description: "Reliable AI-assisted coding, confidence calibration, and human review in social science research.",
  group: "projects",
},

      
    
      
        {
  url: "/zh/projects/1_project/",
  lang: "zh",
  title: "AI for Social Science",
  description: "社会科学研究中的AI辅助编码、置信度校准与人工复核。",
  group: "projects",
},

      
    
      
        {
  url: "/projects/2_project/",
  lang: "en",
  title: "Reliable LLM-Assisted Qualitative Analysis",
  description: "Benchmarks, calibration, and QA for human/LLM hybrid coding in communication research.",
  group: "projects",
},

      
    
      
        {
  url: "/zh/projects/2_project/",
  lang: "zh",
  title: "LLM 辅助质性分析的可靠性",
  description: "面向传播研究的人机协同编码：基准评测、校准与质量保障（QA），让复杂质性分析更可辩护。",
  group: "projects",
},

      
    
      
        {
  url: "/projects/3_project/",
  lang: "en",
  title: "Health and Public Communication",
  description: "Media use, health literacy, trust, and news framing.",
  group: "projects",
},

      
    
      
        {
  url: "/zh/projects/3_project/",
  lang: "zh",
  title: "健康与公共传播",
  description: "媒体使用、健康素养、信任与新闻框架。",
  group: "projects",
},

      
    
      
        {
  url: "/projects/4_project/",
  lang: "en",
  title: "Generative AI in Media Production",
  description: "Using generative AI in scripting, imagery, voices, subtitles, and editing.",
  group: "projects",
},

      
    
      
        {
  url: "/zh/projects/4_project/",
  lang: "zh",
  title: "生成式 AI 与影像创作",
  description: "探索生成式 AI 在脚本、画面、声音、字幕与剪辑中的应用。",
  group: "projects",
},

      
    
  ];
  const sections = zh
    ? { pages: '网站页面', projects: '研究方向' }
    : { pages: 'Pages', projects: 'Research areas' };
  
  const socials = {"email":"zhilongzhao@wyu.edu.cn","github_username":"Long19950304","orcid_id":"0000-0002-3771-4969","scholar_userid":"U-FdkpMAAAAJ"};
  const contact = (title, url) => entries.push({ title, url, lang, group: 'contact', description: '' });
  sections.contact = zh ? '联系与学术主页' : 'Contact and profiles';
  if (socials.email) contact(zh ? '邮箱' : 'Email', 'mailto:' + socials.email);
  if (socials.scholar_userid) contact('Google Scholar', 'https://scholar.google.com/citations?user=' + encodeURIComponent(socials.scholar_userid));
  if (socials.orcid_id) contact('ORCID', 'https://orcid.org/' + encodeURIComponent(socials.orcid_id));
  if (socials.github_username) contact('GitHub', 'https://github.com/' + encodeURIComponent(socials.github_username));
  
  ninja.data = entries.filter(item => item.lang === lang).map(item => ({
    id: item.url,
    title: item.title,
    description: item.description,
    section: sections[item.group],
    handler: () => { window.location.href = item.url; },
  }));
})();
