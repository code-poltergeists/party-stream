<template>
  <div>
    <button @click="signin">Signin</button>
    <button @click="signup">Signup</button>
    <button @click="check">Check</button>
    <button @click="logout">Logout</button>
    <button @click="signinfancy">Signin fancy</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AuthService from '../../services/auth-service';

@Component
export default class Auth extends Vue {
  private authService = new AuthService();

  private signup() {
    const email = prompt("email")!;
    const pass = prompt("pass")!;
    this.authService.signUp(email, pass, '', '', '').then(_ => console.log("done")).catch(e => console.log(e));
  }

  private check() {
    console.log(this.authService.isAuthenticated);
  }

  private logout() {
    this.authService.logOut().then(_ => console.log("done?????")).catch(e => console.log(e));
  }

  private signin() {
    const email = prompt("email")!;
    const pass = prompt("pass")!;
    this.authService.signIn(email, pass).then(_ => console.log("done")).catch(e => console.log(e));
  }

  private signinfancy() {
    const email = prompt("email")!;
    this.authService.sendLogInLink(email).then(_ => {
      console.log("done");
      window.localStorage.setItem('emailForSignIn', email);
      const link = prompt("link")!;
      this.authService.finishLinkLogIn(window.localStorage.getItem("emailForSignIn")!, link).then(_ => console.log("doneeee")).catch(e => console.log(e));
    }).catch(e => console.log(e));
  }
}
</script>

<style scoped lang="scss">

</style>
