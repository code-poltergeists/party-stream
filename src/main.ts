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
  apiKey: process.env.VUE_APP_apiKey,
  authDomain: process.env.VUE_APP_authDomain,
  databaseURL: process.env.VUE_APP_databaseURL,
  projectId: process.env.VUE_APP_projectId,
  storageBucket: process.env.VUE_APP_storageBucket,
  messagingSenderId: process.env.VUE_APP_messagingSenderId,
  appId: process.env.VUE_APP_appId
});

new Vue({
  store,
  router,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
