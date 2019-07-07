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
    auth: {
      restrict: false
    }
  },
  mutations: {
    changeMenuItem(state, n) {
      state.currentMenuItem = n;
    },
    toggleDialogVisibility(state, flag) {
      state.dialog.isVisible = flag;
    },
    setupDialog(state, map) {
      Object.keys(map).forEach(key => {
        (state.dialog.info as { [_: string]: any })[key] = map[key];
      });
    },
    restrictRouterForwarding(state, flag) {
      state.auth.restrict = flag;
    }
  },
  actions: {
    
  },
});
