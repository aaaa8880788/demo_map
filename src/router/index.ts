import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

const routes = [
  {
    path: '/',
    redirect: '/map',
    component: HomeView,
    children: [
      {
        path: '/map',
        name: 'map',
        component: () => import('@/views/Map/index.vue')
      },
      {
        path: '/baseView',
        name: 'baseView',
        component: () => import('@/views/BaseView/index.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;