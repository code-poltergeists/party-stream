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
import YtPlayer from './components/items/YtPlayer.vue';

Vue.use(Router);

function handleAuth(next: Function, routeIfTrue: string | null, routeIfFalse: string | null) {
  const authService = new AuthService();
  authService.isAuthenticated$.subscribe(value => {
    if (value === true) {
      routeIfTrue !== null ? next(routeIfTrue) : next();
    } else if (value === false) {
      routeIfFalse !== null ? next(routeIfFalse) : next();
    } else {
      // should it do something when null?
    }
  });
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      beforeEnter: (to, from, next) => {
        handleAuth(next, '/dashboard', '/auth');
      }
    },
    {
      path: '/dashboard',
      component: Layout,
      beforeEnter: (to, from, next) => {
        handleAuth(next, null, '/auth');
      },
      children: [
        {
          path: '',
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
      component: Auth,
      beforeEnter: (to, from, next) => {
        handleAuth(next, '/dashboard', null);
      },
    },
    {
      path: '*',
      beforeEnter: (to, from, next) => {
        handleAuth(next, '/dashboard', '/auth');
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
    },
  ],
});
