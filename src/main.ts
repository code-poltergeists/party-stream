import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import i18n from './i18n';
import Rx from 'rxjs/Rx';
import VueRx from 'vue-rx';
import firebase from 'firebase';
import { firestorePlugin } from 'vuefire';

Vue.use(VueRx, Rx);
Vue.use(firestorePlugin);
Vue.config.productionTip = false;

firebase.initializeApp({
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
});

new Vue({
  store,
  router,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
