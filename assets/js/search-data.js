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
          description: "已发表期刊论文、预印本与工作论文。",
          section: "Navigation",
          handler: () => {
            window.location.href = "/zh/publications/";
          },
        },{id: "nav-publications",
          title: "Publications",
          description: "Peer-reviewed articles, preprints, and working papers.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-研究",
          title: "研究",
          description: "传播研究、AI for Social Science与影像创作。",
          section: "Navigation",
          handler: () => {
            window.location.href = "/zh/research/";
          },
        },{id: "nav-research",
          title: "Research",
          description: "Communication research, AI for Social Science, and media production.",
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
          description: "影像制作、现代教育技术与学生项目。",
          section: "Navigation",
          handler: () => {
            window.location.href = "/zh/teaching/";
          },
        },{id: "nav-teaching",
          title: "Teaching",
          description: "Media production, educational technology, and student projects.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/teaching/";
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
          description: "Education, affiliations, and research interests of Zhilong George Zhao.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "nav-简报",
          title: "简报",
          description: "AI、社会、健康与教育方向的研究和新闻简报档案。",
          section: "Navigation",
          handler: () => {
            window.location.href = "/zh/digest/";
          },
        },{id: "nav-digest",
          title: "Digest",
          description: "An archive of research and news briefs on AI, society, health, and education.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/digest/";
          },
        },{id: "digests-daily-digest-2026-01-20",
          title: 'Daily Digest — 2026-01-20',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-01-20/";
            },},{id: "digests-daily-digest-2026-01-21",
          title: 'Daily Digest — 2026-01-21',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-01-21/";
            },},{id: "digests-daily-digest-2026-01-22",
          title: 'Daily Digest - 2026-01-22',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-01-22/";
            },},{id: "digests-daily-digest-2026-01-23",
          title: 'Daily Digest - 2026-01-23',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-01-23/";
            },},{id: "digests-daily-digest-2026-01-24",
          title: 'Daily Digest - 2026-01-24',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-01-24/";
            },},{id: "digests-daily-digest-2026-01-25",
          title: 'Daily Digest - 2026-01-25',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-01-25/";
            },},{id: "digests-daily-digest-2026-01-26",
          title: 'Daily Digest - 2026-01-26',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-01-26/";
            },},{id: "digests-daily-digest-2026-01-27",
          title: 'Daily Digest - 2026-01-27',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-01-27/";
            },},{id: "digests-daily-digest-2026-04-22",
          title: 'Daily Digest - 2026-04-22',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-04-22/";
            },},{id: "digests-daily-digest-2026-04-23",
          title: 'Daily Digest - 2026-04-23',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-04-23/";
            },},{id: "digests-daily-digest-2026-04-24",
          title: 'Daily Digest - 2026-04-24',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-04-24/";
            },},{id: "digests-daily-digest-2026-04-25",
          title: 'Daily Digest - 2026-04-25',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-04-25/";
            },},{id: "digests-daily-digest-2026-04-26",
          title: 'Daily Digest - 2026-04-26',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-04-26/";
            },},{id: "digests-daily-digest-2026-04-27",
          title: 'Daily Digest - 2026-04-27',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-04-27/";
            },},{id: "digests-daily-digest-2026-04-28",
          title: 'Daily Digest - 2026-04-28',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-04-28/";
            },},{id: "digests-daily-digest-2026-04-29",
          title: 'Daily Digest - 2026-04-29',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-04-29/";
            },},{id: "digests-daily-digest-2026-04-30",
          title: 'Daily Digest - 2026-04-30',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-04-30/";
            },},{id: "digests-daily-digest-2026-05-06",
          title: 'Daily Digest - 2026-05-06',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-05-06/";
            },},{id: "digests-daily-digest-2026-05-07",
          title: 'Daily Digest - 2026-05-07',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-05-07/";
            },},{id: "digests-daily-digest-2026-05-08",
          title: 'Daily Digest - 2026-05-08',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-05-08/";
            },},{id: "digests-daily-digest-2026-05-09",
          title: 'Daily Digest - 2026-05-09',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-05-09/";
            },},{id: "digests-daily-digest-2026-05-12",
          title: 'Daily Digest - 2026-05-12',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-05-12/";
            },},{id: "digests-daily-digest-2026-05-13",
          title: 'Daily Digest - 2026-05-13',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-05-13/";
            },},{id: "digests-daily-digest-2026-05-16",
          title: 'Daily Digest - 2026-05-16',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-05-16/";
            },},{id: "digests-daily-digest-2026-05-24",
          title: 'Daily Digest - 2026-05-24',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-05-24/";
            },},{id: "digests-daily-digest-2026-05-30",
          title: 'Daily Digest - 2026-05-30',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-05-30/";
            },},{id: "digests-daily-digest-2026-05-31",
          title: 'Daily Digest - 2026-05-31',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-05-31/";
            },},{id: "digests-daily-digest-2026-06-01",
          title: 'Daily Digest - 2026-06-01',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-06-01/";
            },},{id: "digests-daily-digest-2026-06-08",
          title: 'Daily Digest - 2026-06-08',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-06-08/";
            },},{id: "digests-daily-digest-2026-06-15",
          title: 'Daily Digest - 2026-06-15',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-06-15/";
            },},{id: "digests-daily-digest-2026-06-16",
          title: 'Daily Digest - 2026-06-16',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-06-16/";
            },},{id: "digests-daily-digest-2026-06-17",
          title: 'Daily Digest - 2026-06-17',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-06-17/";
            },},{id: "digests-daily-digest-2026-06-18",
          title: 'Daily Digest - 2026-06-18',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-06-18/";
            },},{id: "digests-daily-digest-2026-06-21",
          title: 'Daily Digest - 2026-06-21',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-06-21/";
            },},{id: "digests-daily-digest-2026-06-22",
          title: 'Daily Digest - 2026-06-22',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-06-22/";
            },},{id: "digests-daily-digest-2026-06-26",
          title: 'Daily Digest - 2026-06-26',
          description: "",
          section: "Digests",handler: () => {
              window.location.href = "/digest/2026-06-26/";
            },},{id: "digests_zh-每日简报-2026-01-20",
          title: '每日简报 — 2026-01-20',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-01-20/";
            },},{id: "digests_zh-每日简报-2026-01-21",
          title: '每日简报 — 2026-01-21',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-01-21/";
            },},{id: "digests_zh-每日简报-2026-01-22",
          title: '每日简报 - 2026-01-22',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-01-22/";
            },},{id: "digests_zh-每日简报-2026-01-23",
          title: '每日简报 - 2026-01-23',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-01-23/";
            },},{id: "digests_zh-每日简报-2026-01-24",
          title: '每日简报 - 2026-01-24',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-01-24/";
            },},{id: "digests_zh-每日简报-2026-01-25",
          title: '每日简报 - 2026-01-25',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-01-25/";
            },},{id: "digests_zh-每日简报-2026-01-26",
          title: '每日简报 - 2026-01-26',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-01-26/";
            },},{id: "digests_zh-每日简报-2026-01-27",
          title: '每日简报 - 2026-01-27',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-01-27/";
            },},{id: "digests_zh-每日简报-2026-04-22",
          title: '每日简报 - 2026-04-22',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-04-22/";
            },},{id: "digests_zh-每日简报-2026-04-23",
          title: '每日简报 - 2026-04-23',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-04-23/";
            },},{id: "digests_zh-每日简报-2026-04-24",
          title: '每日简报 - 2026-04-24',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-04-24/";
            },},{id: "digests_zh-每日简报-2026-04-25",
          title: '每日简报 - 2026-04-25',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-04-25/";
            },},{id: "digests_zh-每日简报-2026-04-26",
          title: '每日简报 - 2026-04-26',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-04-26/";
            },},{id: "digests_zh-每日简报-2026-04-27",
          title: '每日简报 - 2026-04-27',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-04-27/";
            },},{id: "digests_zh-每日简报-2026-04-28",
          title: '每日简报 - 2026-04-28',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-04-28/";
            },},{id: "digests_zh-每日简报-2026-04-29",
          title: '每日简报 - 2026-04-29',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-04-29/";
            },},{id: "digests_zh-每日简报-2026-04-30",
          title: '每日简报 - 2026-04-30',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-04-30/";
            },},{id: "digests_zh-每日简报-2026-05-06",
          title: '每日简报 - 2026-05-06',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-05-06/";
            },},{id: "digests_zh-每日简报-2026-05-07",
          title: '每日简报 - 2026-05-07',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-05-07/";
            },},{id: "digests_zh-每日简报-2026-05-08",
          title: '每日简报 - 2026-05-08',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-05-08/";
            },},{id: "digests_zh-每日简报-2026-05-09",
          title: '每日简报 - 2026-05-09',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-05-09/";
            },},{id: "digests_zh-每日简报-2026-05-12",
          title: '每日简报 - 2026-05-12',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-05-12/";
            },},{id: "digests_zh-每日简报-2026-05-13",
          title: '每日简报 - 2026-05-13',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-05-13/";
            },},{id: "digests_zh-每日简报-2026-05-16",
          title: '每日简报 - 2026-05-16',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-05-16/";
            },},{id: "digests_zh-每日简报-2026-05-24",
          title: '每日简报 - 2026-05-24',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-05-24/";
            },},{id: "digests_zh-每日简报-2026-05-30",
          title: '每日简报 - 2026-05-30',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-05-30/";
            },},{id: "digests_zh-每日简报-2026-05-31",
          title: '每日简报 - 2026-05-31',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-05-31/";
            },},{id: "digests_zh-每日简报-2026-06-01",
          title: '每日简报 - 2026-06-01',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-06-01/";
            },},{id: "digests_zh-每日简报-2026-06-08",
          title: '每日简报 - 2026-06-08',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-06-08/";
            },},{id: "digests_zh-每日简报-2026-06-15",
          title: '每日简报 - 2026-06-15',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-06-15/";
            },},{id: "digests_zh-每日简报-2026-06-16",
          title: '每日简报 - 2026-06-16',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-06-16/";
            },},{id: "digests_zh-每日简报-2026-06-17",
          title: '每日简报 - 2026-06-17',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-06-17/";
            },},{id: "digests_zh-每日简报-2026-06-18",
          title: '每日简报 - 2026-06-18',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-06-18/";
            },},{id: "digests_zh-每日简报-2026-06-21",
          title: '每日简报 - 2026-06-21',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-06-21/";
            },},{id: "digests_zh-每日简报-2026-06-22",
          title: '每日简报 - 2026-06-22',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-06-22/";
            },},{id: "digests_zh-每日简报-2026-06-26",
          title: '每日简报 - 2026-06-26',
          description: "",
          section: "Digests_zh",handler: () => {
              window.location.href = "/zh/digest/2026-06-26/";
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
