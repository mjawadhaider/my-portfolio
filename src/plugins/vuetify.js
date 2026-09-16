import { createVuetify } from 'vuetify';
import { VSkeletonLoader } from 'vuetify/labs/VSkeletonLoader';

import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import '@mdi/font/css/materialdesignicons.css';

// Mirrors src/styles/_variables.scss's color tokens — keep both in sync.
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
    },
  },
});
