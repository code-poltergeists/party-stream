import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentMenuItem: 0,
    dialog: {
      isVisible: false,
      info: {},
    },
  },
  mutations: {
    changeMenuItem(state, n) {
      state.currentMenuItem = n;
    },
    toggleDialogVisibility(state, flag) {
      state.dialog.isVisible = flag;
    },
    setupDialog(state, map) {
      state.dialog.info = map;
    },
  },
  actions: {

  },
});
