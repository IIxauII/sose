import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Tabs from '../views/Tabs.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/tab2'
  },
  {
    path: '/tabs/',
    component: Tabs,
    children: [
      {
        path: '',
        redirect: '/tabs/tab2'
      },
      {
        path: 'tab1',
        component: () => import('@/views/MapAllPartners.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Store.vue')
      },
      {
        path: 'tab2/:cityName',
        component: () => import('@/views/Tab2CityDetailsStore.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Debug.vue')
      },
    ]
  },
  {
    path: '/menu/',
    component: () => import('@/views/Menu/Settings.vue'),
    children: [
      { 
        path: '',
        redirect: '/menu/settings',
      },
      {
        path: 'settings',
        component: () => import('@/views/Menu/Settings.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router;
