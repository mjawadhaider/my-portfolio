import { createVuetify } from 'vuetify';
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader';

import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import '@mdi/font/css/materialdesignicons.css';

// Mirrors src/styles/_variables.scss's color tokens (and, in turn,
// App.vue's :root / :root[data-theme="light"] blocks) — keep all three in
// sync. src/utils/theme.js switches `theme.global.name` between these two
// at runtime; Vuetify's own components (v-dialog, v-carousel, v-text-field
// etc.) read colors from whichever is active.
export default createVuetify({
  components: {
    ...components,
    VSkeletonLoader,
  },
  directives,
  icons: {
    defaultSet: 'mdi',
  },
  theme: {
    defaultTheme: 'portfolioDark',
    themes: {
      portfolioDark: {
        dark: true,
        colors: {
          background: '#1c1d20',
          surface: '#26272b',
          primary: '#cda879',
          secondary: '#b8895a',
          'on-background': '#f2f0ec',
          'on-surface': '#f2f0ec',
        },
      },
      portfolioLight: {
        dark: false,
        colors: {
          background: '#f9f6f0',
          surface: '#fdfcf9',
          primary: '#7a5c32',
          secondary: '#5c4020',
          'on-background': '#1c1a17',
          'on-surface': '#1c1a17',
        },
      },
    },
  },
});
