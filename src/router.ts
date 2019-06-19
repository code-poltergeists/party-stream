import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from './components/Dashboard.vue';
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
      path: '/ytplayer',
      name: 'ytplayer',
      component: YtPlayer,
    },
  ],
});
