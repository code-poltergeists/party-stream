import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from './components/pages/Dashboard.vue';
import Inbox from './components/pages/Inbox.vue';
import Rooms from './components/pages/Rooms.vue';
import Friends from './components/pages/Friends.vue';
import Settings from './components/pages/Settings.vue';
import YtPlayer from './components/YtPlayer.vue';

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
    {
      path: '/ytplayer',
      name: 'ytplayer',
      component: YtPlayer,
    },
  ],
});
