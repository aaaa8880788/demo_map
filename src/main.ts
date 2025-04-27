import 'normalize.css';
import 'element-plus/dist/index.css';
import '@/assets/styles/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'; // Pinia插件持久化状态
import App from './App.vue';

import router from './router';
import '@/directives';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
const app = createApp(App);

app.use(pinia);
app.use(router);
app.mount('#app');
