<template>
  <div id="choose-friends">
    <TextField id="name-textfield" placeholder="at-username" toEmit="add-user" @add-user="addUser" />
    <div id="users">
      <div class="user" v-for="user in users" :key="user.index">
        <div class="icon">
          <i class="fas fa-user-circle"></i>
        </div>
        <div class="text">{{ user.username }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import TextField from "./TextField.vue";
import UserService from "../../services/user-service";

@Component({
  components: {
    TextField
  }
})
export default class ChooseFriends extends Vue {
  private users: { username: string; id: string; index: number }[] = [];
  private index: number = 0;

  private userService = new UserService();

  private addUser(value: string) {
    if (value === "") {
      return;
    }
    this.userService
      .getUserIdByUsername(value)
      .then((id: string) => {
        this.users.push({ username: value, id: id, index: this.index });
        this.index += 1;
        this.$store.commit("updateChosenFriends", this.users.map(user => user.id));
      })
      .catch(() => {
        console.log(`user with username ${value} does not exist!`);
      });
  }
}
</script>

<style scoped lang="scss">
#choose-friends {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#name-textfield {
  margin-top: 5vh;
}

#users {
  height: 20vh;
  overflow: scroll;
}

.user {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: #e3e3e3;
  width: 400px;
}

.icon {
  font-size: 50px;
}

.text {
  font-family: "Montserrat", sans-serif;
  font-size: 25px;
  margin-left: 20px;
}
</style>
