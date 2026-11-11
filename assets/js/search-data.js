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
  url: "/zh/cv/",
  lang: "zh",
  title: "简历",
  description: "赵志龙的教育经历、工作单位与研究兴趣。",
  group: "pages",
},

      
    
      
        {
  url: "/cv/",
  lang: "en",
  title: "CV",
  description: "Education, affiliations, and research interests of Zhilong Zhao.",
  group: "pages",
},

      
    
      
    
      
    
      
        {
  url: "/zh/digest/sources/",
  lang: "zh",
  title: "简报来源与筛选说明",
  description: "国内外财经与科技简报的信息来源、选题边界和核验方法。",
  group: "pages",
},

      
    
      
        {
  url: "/digest/sources/",
  lang: "en",
  title: "Digest sources and editorial checks",
  description: "Sources, topic boundaries and verification for the China and world economy, technology and research briefing.",
  group: "pages",
},

      
    
      
        {
  url: "/zh/digest/weekly/",
  lang: "zh",
  title: "每周简报",
  description: "每周汇总：将每日简报中的重点条目按周聚合，便于回顾与收藏。",
  group: "pages",
},

      
    
      
        {
  url: "/digest/weekly/",
  lang: "en",
  title: "Weekly Digest",
  description: "A weekly roll-up of the most important items across my daily digests.",
  group: "pages",
},

      
    
      
        {
  url: "/zh/digest/",
  lang: "zh",
  title: "简报",
  description: "国内外财经、科技与研究简报，提供中英文音频、权威报道和原始公告。",
  group: "pages",
},

      
    
      
        {
  url: "/digest/",
  lang: "en",
  title: "Digest",
  description: "A daily China and world economy, technology and research briefing, with Chinese and English audio, authoritative reporting and original releases.",
  group: "pages",
},

      
    
      
    
      
    
      
    
      
        {
  url: "/zh/media/chinese-passenger/",
  lang: "zh",
  title: "普快列车",
  description: "实验短片 · 海报与剧照。",
  group: "pages",
},

      
    
      
        {
  url: "/media/chinese-passenger/",
  lang: "en",
  title: "Chinese Passenger",
  description: "Experimental short film · Poster and stills.",
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
  description: "现代教育技术、微电影制作：教学理念、课程介绍与学生作品。",
  group: "pages",
},

      
    
      
        {
  url: "/teaching/",
  lang: "en",
  title: "Teaching",
  description: "Modern Educational Technology and Microfilm Production — teaching, courses, and student work.",
  group: "pages",
},

      
    
      
    
      
    
      
    
    
      
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
            {
  url: "/digest/2026-11-06/",
  lang: "en",
  title: "Daily Economy, Technology \u0026 Research Brief · 2026-11-06",
  description: "Shandong’s Yellow River Cities Combine Smart Manufacturing with Green Energy · ECB Publishes Consolidated EU Banking Data for End-June 2026 · NVIDIA Adds Four Open-Weight Cosmos 3 Simulation Checkpoints",
  group: "digests",
},

          
        
          
            {
  url: "/digest/2026-11-07/",
  lang: "en",
  title: "Daily Economy, Technology \u0026 Research Brief · 2026-11-07",
  description: "Heritage brands expand China channels at CIIE · ORIX Aviation to acquire AerFin in £475m deal · ToyBlocks Offers Controlled Robot-Learning Tests",
  group: "digests",
},

          
        
          
            {
  url: "/digest/2026-11-08/",
  lang: "en",
  title: "Daily Economy, Technology \u0026 Research Brief · 2026-11-08",
  description: "Exhibitors localize products for finer consumer needs · Beef Prices Stabilize, but Relief Looks Limited · Prefect 3.9.2 improves workflow reliability",
  group: "digests",
},

          
        
          
            {
  url: "/digest/2026-11-09/",
  lang: "en",
  title: "Daily Economy, Technology \u0026 Research Brief · 2026-11-09",
  description: "China’s CPI Rose 0.7% in October · Cosm expands immersive cinema venues while keeping ticket prices premium · abcFISH enables single-molecule imaging of circular RNA",
  group: "digests",
},

          
        
          
            {
  url: "/digest/2026-11-10/",
  lang: "en",
  title: "Daily Economy, Technology \u0026 Research Brief · 2026-11-10",
  description: "China producer prices rise in October · Skydance Details Planned Operating Cost Savings · NASA ESCAPADE Spacecraft Begin Trip to Mars",
  group: "digests",
},

          
        
          
            {
  url: "/digest/2026-11-11/",
  lang: "en",
  title: "Daily Economy, Technology \u0026 Research Brief · 2026-11-11",
  description: "China Insurance Association Updates Commercial Health Insurance Guides · Fossil Reports a Return to Quarterly Profitability · Mitra-v2 expands synthetic pretraining for tables",
  group: "digests",
},

          
        
      
    
      
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
        
          
            {
  url: "/zh/digest/2026-11-06/",
  lang: "zh",
  title: "每日财经、科技与研究简报 · 2026-11-06",
  description: "山东沿黄城市推进智能制造与绿色能源；欧洲央行发布截至2026年6月底的欧盟银行合并数据；英伟达为Cosmos 3新增四个开放权重模拟检查点",
  group: "digests_zh",
},

          
        
          
            {
  url: "/zh/digest/2026-11-07/",
  lang: "zh",
  title: "每日财经、科技与研究简报 · 2026-11-07",
  description: "进博会环球国民品牌展示区加速海外品牌拓展中国市场；ORIX Aviation以约4.75亿英镑收购AerFin；ToyBlocks提供可控的机器人学习评测环境",
  group: "digests_zh",
},

          
        
          
            {
  url: "/zh/digest/2026-11-08/",
  lang: "zh",
  title: "每日财经、科技与研究简报 · 2026-11-08",
  description: "进博会展商围绕中国消费需求调整产品；加拿大牛肉价格趋稳，但降价空间有限；Prefect 3.9.2更新聚焦工作流可靠性",
  group: "digests_zh",
},

          
        
          
            {
  url: "/zh/digest/2026-11-09/",
  lang: "zh",
  title: "每日财经、科技与研究简报 · 2026-11-09",
  description: "国家统计局：2026年10月居民消费价格同比上涨0.7%；Cosm扩张沉浸式影院，维持高端票价；中国科学院团队开发环形RNA单分子原位成像技术",
  group: "digests_zh",
},

          
        
          
            {
  url: "/zh/digest/2026-11-10/",
  lang: "zh",
  title: "每日财经、科技与研究简报 · 2026-11-10",
  description: "国家统计局：2026年10月工业生产者价格同比上涨5.7%；Skydance公布未来三年经营成本节约计划；NASA的ESCAPADE双探测器启程前往火星",
  group: "digests_zh",
},

          
        
          
            {
  url: "/zh/digest/2026-11-11/",
  lang: "zh",
  title: "每日财经、科技与研究简报 · 2026-11-11",
  description: "中国保险行业协会发布商业医疗险示范条款与药品推荐清单；Fossil第三财季恢复盈利并上调全年销售预期；Mitra-v2扩大表格基础模型的合成预训练规模",
  group: "digests_zh",
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
    ? { pages: '网站页面', projects: '研究方向', digests: '每日简报', digests_zh: '每日简报' }
    : { pages: 'Pages', projects: 'Research areas', digests: 'Daily digest', digests_zh: 'Daily digest' };
  
  const socials = {"email":"zhilongzhao@wyu.edu.cn","github_username":"Long19950304","orcid_id":"0000-0002-3771-4969","rss_icon":true,"scholar_userid":"U-FdkpMAAAAJ"};
  const contact = (title, url) => entries.push({ title, url, lang, group: 'contact', description: '' });
  sections.contact = zh ? '联系与学术主页' : 'Contact and profiles';
  if (socials.email) contact(zh ? '邮箱' : 'Email', 'mailto:' + socials.email);
  if (socials.scholar_userid) contact('Google Scholar', 'https://scholar.google.com/citations?user=' + encodeURIComponent(socials.scholar_userid));
  if (socials.orcid_id) contact('ORCID', 'https://orcid.org/' + encodeURIComponent(socials.orcid_id));
  if (socials.github_username) contact('GitHub', 'https://github.com/' + encodeURIComponent(socials.github_username));
  if (socials.rss_icon) contact(zh ? '订阅每日简报 RSS' : 'Daily digest RSS', (zh ? '/zh' : '') + '/digest/feed.xml');
  
  ninja.data = entries.filter(item => item.lang === lang).map(item => ({
    id: item.url,
    title: item.title,
    description: item.description,
    section: sections[item.group],
    handler: () => { window.location.href = item.url; },
  }));
})();
