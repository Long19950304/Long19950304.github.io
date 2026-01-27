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
          description: "已发表论文与部分工作论文（精选）。",
          section: "Navigation",
          handler: () => {
            window.location.href = "/zh/publications/";
          },
        },{id: "nav-publications",
          title: "Publications",
          description: "Peer-reviewed publications and selected working papers.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-研究",
          title: "研究",
          description: "研究方向与项目（AE+X）。",
          section: "Navigation",
          handler: () => {
            window.location.href = "/zh/research/";
          },
        },{id: "nav-research",
          title: "Research",
          description: "Research directions and selected projects (AE+X).",
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
          description: "面向 AI 时代、以产品与成果为导向的教学设计。",
          section: "Navigation",
          handler: () => {
            window.location.href = "/zh/teaching/";
          },
        },{id: "nav-teaching",
          title: "Teaching",
          description: "AI-forward, product- and outcome-oriented teaching.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/teaching/";
          },
        },{id: "nav-简报",
          title: "简报",
          description: "每日（高信号）简报：AI、CSS/AI 与社会、健康传播与教育方向。",
          section: "Navigation",
          handler: () => {
            window.location.href = "/zh/digest/";
          },
        },{id: "nav-digest",
          title: "Digest",
          description: "Daily (high-signal) research briefs curated across AI, CSS/AI &amp; society, digital health, and education.",
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
            },},{id: "projects-agentic-engineering-ae-x",
          title: 'Agentic Engineering (AE+X)',
          description: "A unifying research agenda for configuring, testing, and deploying multi-agent systems for reliable outcomes.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_project/";
            },},{id: "projects-多智能体工程-ae-x",
          title: '多智能体工程（AE+X）',
          description: "以评估为先的研究计划：配置、测试与部署多智能体系统，使其在真实工作流中稳定产出可靠结果。",
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
            },},{id: "projects-computational-social-science-amp-digital-methods",
          title: 'Computational Social Science &amp;amp; Digital Methods',
          description: "Computational communication research using large-scale digital trace data, measurement, and causal designs.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_project/";
            },},{id: "projects-计算传播与数字方法",
          title: '计算传播与数字方法',
          description: "用大规模数字痕迹数据、测量与因果识别设计，开展可复现、可检验的计算传播/计算社会科学研究。",
          section: "Projects",handler: () => {
              window.location.href = "/zh/projects/3_project/";
            },},{id: "projects-ai-native-media-pipelines",
          title: 'AI-Native Media Pipelines',
          description: "Code-first multi-model pipelines for scripting → visuals → subtitles → packaging → publishing (with evaluation and QA).",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_project/";
            },},{id: "projects-ai-native-媒体生产流水线",
          title: 'AI-native 媒体生产流水线',
          description: "代码优先的多模型/多智能体流水线：脚本→视觉→字幕→打包→发布，并内置评估与质量门控。",
          section: "Projects",handler: () => {
              window.location.href = "/zh/projects/4_project/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%79%62%38%37%33%31%35@%75%6D%61%63.%6D%6F", "_blank");
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
