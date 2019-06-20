import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from './components/Dashboard.vue';
import Inbox from './components/Inbox.vue';
import Rooms from './components/Rooms.vue';
import Friends from './components/Friends.vue';
import Settings from './components/Settings.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/inbox',
      name: 'inbox',
      component: Inbox,
    },
    {
      path: '/rooms',
      name: 'rooms',
      component: Rooms,
    },
    {
      path: '/friends',
      name: 'friends',
      component: Friends,
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
    },
  ],
});
