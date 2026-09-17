import { createApp } from 'vue';
import App from './App.vue';

import 'vuetify/styles';
import vuetify from './plugins/vuetify';
import VueGtag from 'vue-gtag';

import toastPlugin from './plugins/toast';

import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import CommonMixin from './Mixins/CommonMixin';
import { initTheme } from './utils/theme';

const app = createApp(App, {
  components,
  directives,
});

app.mixin(CommonMixin);
app.use(vuetify);
app.use(toastPlugin);

// Applies the stored theme (or the dark default) before the app renders,
// so components never mount into a "flash" of the wrong theme.
initTheme();

app.config.globalProperties.$helloWorld = 'Hello World';

app.use(VueGtag, {
  appName: 'Jawad Haider',
  pageTrackerScreenviewEnabled: true,
  config: { id: 'G-SR7CBSGJGM' },
});

// G-SR7CBSGJGM

app.mount('#app');
