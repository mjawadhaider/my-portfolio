import { createApp } from 'vue';
import App from './App.vue';

import 'vuetify/styles';
import vuetify from './plugins/vuetify';
import VueGtag from 'vue-gtag';

import toastPlugin from './plugins/toast';

import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import CommonMixin from './Mixins/CommonMixin';

const app = createApp(App, {
  components,
  directives,
});

app.mixin(CommonMixin);
app.use(vuetify);
app.use(toastPlugin);

app.config.globalProperties.$helloWorld = 'Hello World';

app.use(VueGtag, {
  appName: 'Jawad Haider',
  pageTrackerScreenviewEnabled: true,
  config: { id: 'G-SR7CBSGJGM' },
});

// G-SR7CBSGJGM

app.mount('#app');
