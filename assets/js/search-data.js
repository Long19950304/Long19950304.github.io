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
        },{id: "projects-agentic-engineering-ae-x",
          title: 'Agentic Engineering (AE+X)',
          description: "A unifying research agenda for configuring, testing, and deploying multi-agent systems for reliable outcomes.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_project/";
            },},{id: "projects-reliable-llm-assisted-qualitative-analysis",
          title: 'Reliable LLM-Assisted Qualitative Analysis',
          description: "Benchmarks, calibration, and QA for human/LLM hybrid coding in communication research.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_project/";
            },},{id: "projects-computational-social-science-amp-digital-methods",
          title: 'Computational Social Science &amp;amp; Digital Methods',
          description: "Computational communication research using large-scale digital trace data, measurement, and causal designs.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_project/";
            },},{id: "projects-ai-native-media-pipelines",
          title: 'AI-Native Media Pipelines',
          description: "Code-first multi-model pipelines for scripting → visuals → subtitles → packaging → publishing (with evaluation and QA).",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_project/";
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
