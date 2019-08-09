<template>
  <div id="settings">
    <div id="info">{{$t('edit-fields')}}</div>
    <div id="photo-container" ref="photoContainer"></div>
    <div
      id="username-container"
      class="field"
      @click="edit('username')"
      v-if="currentUser !== null"
    >@{{currentUser.username}}</div>
    <div
      id="email-container"
      class="field"
      @click="edit('email')"
      v-if="currentUser !== null && userService.authMethod !== 'facebook' && userService.authMethod !== 'google'"
    >{{$t('email')}}: {{currentUser.email}}</div>
    <div
      id="password-container"
      class="field"
      @click="edit('password')"
      v-if="currentUser !== null && userService.authMethod !== 'facebook' && userService.authMethod !== 'google'"
    >{{$t('password')}}: ({{$t('hidden')}})</div>
    <div
      id="phone-container"
      class="field"
      @click="edit('phone')"
      v-if="currentUser !== null"
    >{{$t('phone')}}: {{currentUser.phone ? currentUser.phone : $t('not-yet-set')}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AuthService from "../../services/auth-service";
import User from "../../models/User";
import UserService from "../../services/user-service";

@Component
export default class Settings extends Vue {
  authService = new AuthService();
  userService = new UserService();

  currentUser: User | null = null;

  mounted() {
    this.authService.currentUser().then(currentUser => {
      this.currentUser = currentUser;
      (this.$refs
        .photoContainer as any).style.backgroundImage = `url('${currentUser.photoUrl}')`;
    });
  }

  edit(type: string) {
    const stepsArray = [
      {
        name: null,
        action: () => {
          this.$store.commit(
            "setupDialog",
            type === "email" || type === "password"
              ? {
                  title: `edit-${type}`,
                  button: { icon: "fa fa-arrow-right", text: "next" },
                  component: "Reauthenticate",
                  steps: stepsArray,
                  additionalProps: {
                    type: type,
                    provider: this.userService.authMethod
                  },
                  isStepChangeAllowed: false
                }
              : {
                  title: `edit-${type}`,
                  button: { icon: "fa fa-check", text: "done" },
                  component: "EditField",
                  steps: stepsArray,
                  additionalProps: {
                    type: type
                  },
                  isStepChangeAllowed: false
                }
          );
        }
      },
      {
        name: `edit-${type}`,
        action: async () => {
          const newValue = this.$store.state.userInfo[type];
          if (type === "email") {
            await this.userService.updateEmail(newValue);
          }
          if (type === "password") {
            await this.userService.updatePassword(newValue);
          }
          if (type !== "password") {
            await this.userService.updateUserInfo(type, newValue);
            this.currentUser[type] = newValue;
          }
          this.$store.commit("updateUserInfo", {});
          this.$store.commit("toggleDialogVisibility", false);
        }
      }
    ];
    if (type === "email" || type === "password") {
      stepsArray.splice(1, 0, {
        name: "reauthenticate",
        action: async () => {
          try {
            await this.userService.reauthenticate(
              this.$store.state.reauthenticate.email,
              this.$store.state.reauthenticate.password
            );
            this.$store.commit("reauthenticate", {});
          } catch {
            throw "fwfadsfs";
          }

          this.$store.commit("setupDialog", {
            title: `edit-${type}`,
            button: { icon: "fa fa-check", text: "done" },
            component: "EditField",
            steps: stepsArray,
            additionalProps: {
              type: type
            },
            isStepChangeAllowed: false
          });
        }
      });
    }
    stepsArray[0].action();
    this.$store.commit("toggleDialogVisibility", true);
  }
}
</script>

<style scoped lang="scss">
$color: #e3e3e3;
$color-dark: #656565;

@mixin desktop {
  @media only screen and (min-width: 601px) {
    @content;
  }
}

@mixin mobile {
  @media only screen and (max-width: 600px) {
    @content;
  }
}

#settings {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

#info {
  font-family: "Montserrat", sans-serif;
  color: $color-dark;
  font-weight: 600;
  font-size: 20px;
}

#photo-container {
  margin-top: 15px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
  border: 2px solid $color-dark;
  cursor: pointer;

  &:hover {
    border-color: $color;
  }
}

.field {
  font-family: "Montserrat", sans-serif;
  color: $color;
  font-weight: 700;
  @include mobile {
    font-size: 5vw;
  }
  @include desktop {
    font-size: 3vw;
  }
  margin: 15px 0;
  cursor: pointer;
  text-align: center;
}
</style>
