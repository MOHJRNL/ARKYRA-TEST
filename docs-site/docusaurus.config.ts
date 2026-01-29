import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Arkyra',
  tagline: 'Open-source platform for social media management and content scheduling',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://docs.arkyra.pro',
  baseUrl: '/',

  organizationName: 'arkyra',
  projectName: 'arkyra',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/arkyra-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Arkyra',
      logo: {
        alt: 'Arkyra Logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo-dark.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/arkyra/arkyra',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Introduction',
              to: '/introduction',
            },
            {
              label: 'Quick Start',
              to: '/quickstart',
            },
            {
              label: 'Architecture',
              to: '/architecture',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Installation',
              to: '/installation',
            },
            {
              label: 'Configuration',
              to: '/configuration',
            },
            {
              label: 'Deployment',
              to: '/DEPLOYMENT',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/arkyra/arkyra',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Arkyra. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'typescript', 'javascript', 'json', 'yaml', 'docker'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
