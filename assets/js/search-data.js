// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-nicolás-acevedo-villena",
    title: "Nicolás Acevedo Villena",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-research",
          title: "Research",
          description: "Current and previous research in optimization, machine learning, and data-driven decision-making.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/research/";
          },
        },{id: "nav-publications-amp-research-outputs",
          title: "Publications &amp; research outputs",
          description: "Formal research outputs by Nicolás Acevedo Villena.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-teaching",
          title: "Teaching",
          description: "Teaching experience at MIT and the Universidad de Chile.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/teaching/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "Academic CV of Nicolás Acevedo Villena.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "news-began-my-phd-in-operations-research-at-mit",
          title: 'Began my PhD in Operations Research at MIT.',
          description: "",
          section: "News",},{id: "news-my-master-s-thesis-received-a-thesis-distinction-from-the-universidad-de-chile-s-school-of-graduate-studies",
          title: 'My master’s thesis received a thesis distinction from the Universidad de Chile’s School...',
          description: "",
          section: "News",},{id: "news-made-a-public-pipeline-for-evaluating-soft-vertical-equity-constraints-in-mass-appraisal-available-on-github-with-time-split-validation-and-assessor-facing-equity-measures",
          title: 'Made a public pipeline for evaluating soft vertical-equity constraints in mass appraisal available...',
          description: "",
          section: "News",},{id: "news-made-a-public-data-modeling-repository-for-data-center-infrastructure-and-resource-systems-available-on-github-beginning-with-a-transparent-prineville-case-study",
          title: 'Made a public-data modeling repository for data-center infrastructure and resource systems available on...',
          description: "",
          section: "News",},{id: "projects-data-center-infrastructure-and-externalities",
          title: 'Data-center infrastructure and externalities',
          description: "Public-data modeling of data-center resource systems, beginning with a transparent case-study reconstruction.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/data-center-externalities/";
            },},{id: "projects-fair-and-equitable-predictive-modeling-for-property-assessment",
          title: 'Fair and equitable predictive modeling for property assessment',
          description: "Optimization-based predictive modeling for mass appraisal that balances predictive quality and vertical equity.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/equitable-property-assessment/";
            },},{id: "projects-fairness-in-machine-learning-with-robust-constraints",
          title: 'Fairness in machine learning with robust constraints',
          description: "Redirect to the property-assessment research program that incorporates this methodological work.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/fairness-robust-constraints/";
            },},{id: "projects-large-scale-feature-selection-via-column-generation-decomposition",
          title: 'Large-scale feature selection via column-generation decomposition',
          description: "Master&#39;s research on a scalable decomposition approach for feature selection.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/feature-selection/";
            },},{id: "projects-reliable-and-scalable-first-order-optimization-on-gpus",
          title: 'Reliable and scalable first-order optimization on GPUs',
          description: "Ongoing research on numerical reliability in GPU-based first-order methods for large-scale optimization.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/gpu-first-order-solvers/";
            },},{id: "projects-outlier-detection-for-standardized-tests",
          title: 'Outlier detection for standardized tests',
          description: "An interpretable anomaly-screening protocol for Chile&#39;s university selection exam.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/standardized-test-outliers/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%6E%61%63%65%76%65%64%6F@%6D%69%74.%65%64%75", "_blank");
        },
      },{
        id: 'social-cv',
        title: 'CV',
        section: 'Socials',
        handler: () => {
          window.open("/assets/pdf/Nicolas_Acevedo_Villena_CV.pdf", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/nicacevedo", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/nacevedo-villena", "_blank");
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
