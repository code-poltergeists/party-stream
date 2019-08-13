import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentMenuItem: 0,
    isMenuOpen: false,
    dialog: {
      isVisible: false,
      info: {}
    },
    roomName: "",
    room: {
      name: "",
      privacy: 0,
      code: ""
    },
    auth: {
      restrict: false
    },
    chooseFriends: {
      users: []
    },
    video: {
      link: ""
    },
    userInfo: {},
    reauthenticate: {}
  },
  mutations: {
    changeMenuItem(state, n) {
      state.currentMenuItem = n;
    },
    toggleDialogVisibility(state, flag) {
      state.dialog.isVisible = flag;
    },
    setupDialog(state, map) {
      if (map.isStepChangeAllowed === undefined) {
        state.dialog.info["isStepChangeAllowed"] = true;
      }
      Object.keys(map).forEach(key => {
        (state.dialog.info as { [_: string]: any })[key] = map[key];
      });
    },
    roomNameUpdate(state, name) {
      state.room.name = name;
    },
    roomPrivacyUpDate(state, value) {
      state.room.privacy = value;
    },
    roomCodeUpdate(state, value) {
      state.room.code = value;
    },
    restrictRouterForwarding(state, flag) {
      state.auth.restrict = flag;
    },
    updateChosenFriends(state, array) {
      state.chooseFriends.users = array;
    },
    updateLink(state, link) {
      state.video.link = link;
    },
    updateUserInfo(state, map) {
      if (map === {}) {
        state.reauthenticate = {};
      } else {
        Object.keys(map).forEach(key => {
          (state.userInfo as { [_: string]: any })[key] = map[key];
        });
      }
    },
    reauthenticate(state, map) {
      if (map === {}) {
        state.reauthenticate = {};
      } else {
        Object.keys(map).forEach(key => {
          (state.reauthenticate as { [_: string]: any })[key] = map[key];
        });
      }
    },
    toggleMenu(state, flag) {
      this.state.isMenuOpen = flag;
    },
    updateRoomName(state, name) {
      state.roomName = name;
    }
  },
  actions: {}
});
