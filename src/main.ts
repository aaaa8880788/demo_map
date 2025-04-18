import 'normalize.css';
import 'element-plus/dist/index.css';
import '@/assets/styles/main.css';

import { createApp } from 'vue';
import App from './App.vue';

import router from './router';
import '@/directives';

const app = createApp(App);
app.use(router);
app.mount('#app');
