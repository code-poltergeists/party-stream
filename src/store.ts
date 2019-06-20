import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentMenuItem: 0,
  },
  mutations: {
    changeMenuItem(state, n) {
      state.currentMenuItem = n;
    },
  },
  actions: {

  },
});
