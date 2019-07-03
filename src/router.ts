import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from './components/pages/Dashboard.vue';
import Inbox from './components/pages/Inbox.vue';
import Rooms from './components/pages/Rooms.vue';
import Friends from './components/pages/Friends.vue';
import Settings from './components/pages/Settings.vue';
import Auth from './components/pages/Auth.vue';
import Layout from './components/structure/Layout.vue';
import AuthService from './services/auth-service';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/dashboard',
      component: Layout,
      children: [
        {
          path: '/',
          name: 'dashboard',
          component: Dashboard,
        },
        {
          path: 'inbox',
          name: 'inbox',
          component: Inbox,
        },
        {
          path: 'rooms',
          name: 'rooms',
          component: Rooms,
        },
        {
          path: 'friends',
          name: 'friends',
          component: Friends,
        },
        {
          path: 'settings',
          name: 'settings',
          component: Settings,
        },
      ]
    },
    {
      path: '/auth',
      name: 'auth',
      component: Auth
    }
  ],
});

router.beforeEach((to, from, next) => {
  const authService = new AuthService();
  authService.isAuthenticated$.subscribe(value => {
    if (value === true) {
      if (from.fullPath !== '/dashboard') {
        next('/dashboard');
      }
    } else if (value === false) {
      if (from.fullPath !== '/auth') {
        next('/auth');
      }
    } else {
      // should it do something when null?
    }
  });
});

export default router;
