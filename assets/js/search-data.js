// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-论文",
          title: "论文",
          description: "已发表期刊论文、预印本、工作论文与会议论文。",
          section: "Navigation",
          handler: () => {
            window.location.href = "/zh/publications/";
          },
        },{id: "nav-publications",
          title: "Publications",
          description: "Peer-reviewed articles, preprints, working papers, and conference papers.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-项目",
          title: "项目",
          description: "主持科研项目、教改项目、省级人才项目与参与研究。",
          section: "Navigation",
          handler: () => {
            window.location.href = "/zh/research/";
          },
        },{id: "nav-projects",
          title: "Projects",
          description: "Research grants, teaching development, talent support, and collaborative projects.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/research/";
          },
        },{id: "nav-作品",
          title: "作品",
          description: "影像与创作作品（节选）。",
          section: "Navigation",
          handler: () => {
            window.location.href = "/zh/media/";
          },
        },{id: "nav-media",
          title: "Media",
          description: "Selected media and creative works.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/media/";
          },
        },{id: "nav-教学",
          title: "教学",
          description: "教学理念、课堂设计、影像制作与学生项目。",
          section: "Navigation",
          handler: () => {
            window.location.href = "/zh/teaching/";
          },
        },{id: "nav-teaching",
          title: "Teaching",
          description: "Teaching philosophy, classroom design, media production, and student projects.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/teaching/";
          },
        },{id: "nav-服务",
          title: "服务",
          description: "学术服务与期刊同行评审。",
          section: "Navigation",
          handler: () => {
            window.location.href = "/zh/service/";
          },
        },{id: "nav-service",
          title: "Service",
          description: "Academic service and journal peer review.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/service/";
          },
        },{id: "nav-简历",
          title: "简历",
          description: "赵志龙的教育经历、工作单位与研究兴趣。",
          section: "Navigation",
          handler: () => {
            window.location.href = "/zh/cv/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "Education, affiliations, and research interests of Zhilong Zhao.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "nav-简报",
          title: "简报",
          description: "国内外财经、科技与研究简报，提供中英文音频、权威报道和原始公告。",
          section: "Navigation",
          handler: () => {
            window.location.href = "/zh/digest/";
          },
        },{id: "nav-digest",
          title: "Digest",
          description: "A daily China and world economy, technology and research briefing, with Chinese and English audio, authoritative reporting and original releases.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/digest/";
          },
        },{id: "digests-daily-economy-technology-amp-research-brief-2026-11-06",
          title: 'Daily Economy, Technology &amp;amp; Research Brief · 2026-11-06',
          description: "Shandong’s Yellow River Cities Combine Smart Manufacturing with Green Energy · ECB Publishes Consolidated EU Banking Data for End-June 2026 · NVIDIA Adds Four Open-Weight Cosmos 3 Simulation Checkpoints",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-11-06/";
            },},{id: "digests-daily-economy-technology-amp-research-brief-2026-11-07",
          title: 'Daily Economy, Technology &amp;amp; Research Brief · 2026-11-07',
          description: "Heritage brands expand China channels at CIIE · ORIX Aviation to acquire AerFin in £475m deal · ToyBlocks Offers Controlled Robot-Learning Tests",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-11-07/";
            },},{id: "digests_zh-每日财经-科技与研究简报-2026-11-06",
          title: '每日财经、科技与研究简报 · 2026-11-06',
          description: "山东沿黄城市推进智能制造与绿色能源；欧洲央行发布截至2026年6月底的欧盟银行合并数据；英伟达为Cosmos 3新增四个开放权重模拟检查点",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-11-06/";
            },},{id: "digests_zh-每日财经-科技与研究简报-2026-11-07",
          title: '每日财经、科技与研究简报 · 2026-11-07',
          description: "进博会环球国民品牌展示区加速海外品牌拓展中国市场；ORIX Aviation以约4.75亿英镑收购AerFin；ToyBlocks提供可控的机器人学习评测环境",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-11-07/";
            },},{id: "projects-ai-for-social-science",
          title: 'AI for Social Science',
          description: "Reliable AI-assisted coding, confidence calibration, and human review in social science research.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_project/";
            },},{id: "projects-ai-for-social-science",
          title: 'AI for Social Science',
          description: "社会科学研究中的AI辅助编码、置信度校准与人工复核。",
          section: "Projects",handler: () => {
              window.location.href = "/zh/projects/1_project/";
            },},{id: "projects-reliable-llm-assisted-qualitative-analysis",
          title: 'Reliable LLM-Assisted Qualitative Analysis',
          description: "Benchmarks, calibration, and QA for human/LLM hybrid coding in communication research.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_project/";
            },},{id: "projects-llm-辅助质性分析的可靠性",
          title: 'LLM 辅助质性分析的可靠性',
          description: "面向传播研究的人机协同编码：基准评测、校准与质量保障（QA），让复杂质性分析更可辩护。",
          section: "Projects",handler: () => {
              window.location.href = "/zh/projects/2_project/";
            },},{id: "projects-health-and-public-communication",
          title: 'Health and Public Communication',
          description: "Media use, health literacy, trust, and news framing.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_project/";
            },},{id: "projects-健康与公共传播",
          title: '健康与公共传播',
          description: "媒体使用、健康素养、信任与新闻框架。",
          section: "Projects",handler: () => {
              window.location.href = "/zh/projects/3_project/";
            },},{id: "projects-generative-ai-in-media-production",
          title: 'Generative AI in Media Production',
          description: "Using generative AI in scripting, imagery, voices, subtitles, and editing.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_project/";
            },},{id: "projects-生成式-ai-与影像创作",
          title: '生成式 AI 与影像创作',
          description: "探索生成式 AI 在脚本、画面、声音、字幕与剪辑中的应用。",
          section: "Projects",handler: () => {
              window.location.href = "/zh/projects/4_project/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%7A%68%69%6C%6F%6E%67%7A%68%61%6F@%77%79%75.%65%64%75.%63%6E", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/Long19950304", "_blank");
        },
      },{
        id: 'social-orcid',
        title: 'ORCID',
        section: 'Socials',
        handler: () => {
          window.open("https://orcid.org/0000-0002-3771-4969", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=U-FdkpMAAAAJ", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
