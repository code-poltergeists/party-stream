<template>
  <div id="layout">
    <div id="left">
      <div id="svg-container">
        <svg viewBox="0 0 600 500">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#7F18B6" />
              <stop offset="12.5%" stop-color="#533E87" stop-opacity="0.8" />
              <stop offset="32.5%" stop-color="#315B5B" stop-opacity="0.64" />
              <stop offset="40%" stop-color="#1A4921" stop-opacity="0.75" />
              <stop offset="50%" stop-color="#1A2328" stop-opacity="0.8" />
              <stop offset="60%" stop-color="#1A4921" stop-opacity="0.75" />
              <stop offset="67.5%" stop-color="#315B5B" stop-opacity="0.64" />
              <stop offset="87.5%" stop-color="#533E87" stop-opacity="0.8" />
              <stop offset="100%" stop-color="#7F18B6" />
            </linearGradient>
          </defs>
          <path
            d="
             M 0 250
             Q 20 125 40 250 
             Q 60 400 80 250
             Q 100 -175 120 250
             Q 140 650 160 250
             Q 180 -100 200 250
             Q 220 525 240 250
             Q 260 -250 280 250
             Q 300 400 320 250
             Q 340 150 360 250
             Q 380 750 400 250
             Q 420 0 440 250
             Q 460 450 480 250
             Q 500 -175 520 250
             Q 540 550 560 250
             Q 580 50 600 250
          "
            fill="url(#gradient)"
          />
        </svg>
      </div>
    </div>
    <div id="right">
      <p id="landing-text" v-html="$t('landing-text')"></p>
      <div id="buttons" v-if="currentTab !== 'complete-signup'">
        <div
          id="login"
          :class="{'active': currentTab === 'login'}"
          @click="currentTab = 'login'"
        >{{ $t('login').toUpperCase() }}</div>
        <i class="fas fa-circle" id="circle"></i>
        <div
          id="signup"
          :class="{'active': currentTab === 'signup'}"
          @click="currentTab = 'signup'"
        >{{ $t('signup').toUpperCase() }}</div>
      </div>
      <div class="textfield-container" v-if="currentTab === 'login'">
        <input v-model="user" class="textfield" :placeholder="placeholder" />
      </div>
      <div id="checkbox-container" v-if="currentTab === 'login'">
        <label id="toggleButton">
          <input type="checkbox" @change="isPasswordEnabled = !isPasswordEnabled" />
          <div>
            <svg viewBox="0 0 44 44">
              <path
                d="
                     M 14 24 
                     L 21 31 
                     L 39.7428882 11.5937758 
                     C 35.2809627 6.53125861 30.0333333 4 24 4 
                     C 12.95 4 4 12.95 4 24 
                     C 4 35.05 12.95, 44 24 44 
                     C 35.05 44 44 35.05 44 24 
                     C 44 19.3 42.5809627 15.1645919 39.7428882 11.5937758
                   "
                transform="translate(-2.000000, -2.000000)"
              />
            </svg>
          </div>
        </label>
        <div
          id="checkbox-description"
          :class="{'active': !isPasswordEnabled}"
        >{{ $t('passwordless') }}</div>
      </div>
      <div id="photo-container-container">
        <div
          id="photo-container"
          v-if="currentTab === 'signup'"
          @click="startUpload"
          ref="photoContainer"
        >
          <i class="fas fa-camera" v-if="photoString === null"></i>
        </div>
      </div>
      <input type="file" style="display: none" ref="photoInput" @change="uploadPhoto" />
      <div
        class="textfield-container"
        v-if="currentTab === 'signup' || currentTab === 'complete-signup'"
      >
        <input v-model="username" class="textfield" :placeholder="$t('username')" />
      </div>
      <div class="textfield-container" v-if="currentTab === 'signup'">
        <input v-model="email" class="textfield" :placeholder="$t('email')" />
      </div>
      <div
        class="textfield-container"
        v-if="currentTab === 'signup' || currentTab === 'complete-signup'"
      >
        <input v-model="phone" class="textfield" :placeholder="$t('phone-number-optional')" />
      </div>
      <div class="textfield-container" v-if="isPasswordEnabled && currentTab !== 'complete-signup'">
        <input type="password" v-model="password" class="textfield" :placeholder="$t('password')" />
      </div>
      <div id="auth-button" @click="auth" :class="{'disabled': isLoading}">
        <LoadingSpinner v-if="isLoading" id="spinner" />
        <div v-else id="button-text">{{ $t(currentTab).toUpperCase() }}</div>
      </div>
      <div id="recaptcha-center" :class="{'hidden': confirmationResult !== null}">
        <div id="recaptcha-container"></div>
      </div>
      <div
        id="alternative-auth"
        v-if="currentTab !== 'complete-signup'"
      >{{ $t('alternative-' + currentTab) }}</div>
      <div id="alternative-auth-buttons" v-if="currentTab !== 'complete-signup'">
        <div id="facebook" class="alternative-auth-button" @click="facebookAuth">
          <i class="fab fa-facebook-square"></i>
        </div>
        <div id="google" class="alternative-auth-button" @click="googleAuth">
          <i class="fab fa-google"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AuthService from "../../services/auth-service";
import LoadingSpinner from "../items/LoadingSpinner.vue";
import * as firebase from "firebase/app";
import "firebase/auth";

@Component({
  components: {
    LoadingSpinner
  }
})
export default class Auth extends Vue {
  private authService = new AuthService();
  private currentTab = "login";
  private isPasswordEnabled = true;

  private user = "";
  private password = "";
  private username = "";
  private email = "";
  private phone = "";
  private userId = "";

  private isLoading = false;

  private placeholder = "";

  private confirmationResult: any | null = null;

  private photoString: string | null = null;

  facebookAuth() {
    this.authService
      .facebookAuth()
      .then(result => {
        this.currentTab = "complete-signup";
        const user = result.user!;
        this.email = user.email!;
        this.photoString = user.photoURL;
        this.userId = user.uid;
      })
      .catch(e => console.log(e));
  }

  googleAuth() {
    this.authService
      .googleAuth()
      .then(result => {
        console.log(result);
        this.currentTab = "complete-signup";
        const user = result.user!;
        this.email = user.email!;
        this.photoString = user.photoURL;
        this.userId = user.uid;
      })
      .catch(e => console.log(e));
  }

  startUpload() {
    (this.$refs.photoInput as any).click();
  }

  uploadPhoto() {
    const reader = new FileReader();
    reader.onloadend = () => {
      (this.$refs.photoContainer as any).style.backgroundImage =
        "url('" + reader.result + "')";
      this.photoString = reader.result as string;
    };
    const file = (this.$refs.photoInput as any).files[0];
    if (file) {
      reader.readAsDataURL(file);
    } else {
      console.log("oh no no photo");
    }
  }

  created() {
    if (this.authService.isLoginLink(window.location.href)) {
      const email = window.localStorage.getItem("emailForSignIn");
      if (email) {
        this.authService
          .finishLinkLogIn(email, window.location.href)
          .then(_ => {
            window.location.reload();
          })
          .catch(e => console.log(e));
      }
    }
  }

  mounted() {
    (window as any).recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container"
    );
    this.placeholder = this.$t("auth-methods") as string;
  }

  private auth() {
    this.isLoading = true;
    if (this.currentTab === "login") {
      if (this.isPasswordEnabled) {
        if (this.isEmail(this.user)) {
          this.authService
            .signIn(this.user, this.password)
            .then(() => {
              this.isLoading = false;
              window.location.reload();
            })
            .catch(e => console.log(e));
        }
      } else {
        if (this.confirmationResult) {
          if (this.isCode(this.user)) {
            this.isLoading = true;
            this.confirmationResult
              .confirm(this.user)
              .then((_: any) => {
                this.isLoading = false;
                window.location.reload();
              })
              .catch((e: any) => console.log(e));
          }
        } else {
          if (this.isEmail(this.user)) {
            this.authService
              .sendLogInLink(this.user)
              .then(_ => {
                console.log("done");
                window.localStorage.setItem("emailForSignIn", this.user);
                this.isLoading = false;
              })
              .catch(e => console.log(e));
          } else if (this.isPhoneNumber(this.user)) {
            this.authService
              .signInWithPhoneNumber(this.user, (window as any)
                .recaptchaVerifier as any)
              .then(result => {
                this.isLoading = false;
                this.placeholder = this.$t("verification-code") as string;
                this.user = "";
                this.confirmationResult = result;
              })
              .catch(e => console.log(e));
          }
        }
      }
    } else if (this.currentTab === "signup") {
      this.authService
        .signUp(
          this.email,
          this.password,
          this.username,
          this.phone,
          this.photoString!
        )
        .then(_ => console.log("done"))
        .catch(e => console.log(e));
    } else if (this.currentTab === "complete-signup") {
      this.authService
        .finishSignUp(
          this.email,
          this.username,
          this.phone,
          this.photoString!,
          this.userId
        )
        .then(_ => {
          this.$store.commit("restrictRouterForwarding", false);
          this.authService.isAuthenticated$.next(true);
        });
    }
  }

  private isEmail(email: string) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  private isPhoneNumber(phoneNumber: string) {
    const re = /^[+]?(\d{1,2})?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    return re.test(String(phoneNumber).toLowerCase());
  }

  private isCode(code: string) {
    const re = /^\d+$/;
    return re.test(String(code).toLowerCase()) && code.length === 6;
  }

  private signup() {
    const email = prompt("email")!;
    const pass = prompt("pass")!;
    this.authService
      .signUp(email, pass, "", "", "")
      .then(_ => console.log("done"))
      .catch(e => console.log(e));
  }

  private check() {
    console.log(this.authService.isAuthenticated);
  }

  private logout() {
    this.authService
      .logOut()
      .then(_ => console.log("done?????"))
      .catch(e => console.log(e));
  }

  private signin() {
    const email = prompt("email")!;
    const pass = prompt("pass")!;
    this.authService
      .signIn(email, pass)
      .then(_ => console.log("done"))
      .catch(e => console.log(e));
  }
}
</script>

<style scoped lang="scss">
$color: #e3e3e3;
$color-dark: #656565;

*,
::after,
::before {
	box-sizing: border-box
}

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

#recaptcha-center {
  text-align: center;
  width: 60%;
  margin-top: 20px;
}

#recaptcha-container {
  display: inline-block;
}

.hidden {
  display: none;
}

#layout {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-direction: row;
  @include mobile {
    flex-direction: column;
  }
}

#left {
  color: $color;
  display: flex;
  justify-content: center;
  align-items: center;
  @include desktop {
    margin: 50px 0;
    width: 50%;
    align-items: flex-start;
    margin-left: 3vw;
  }
  @include mobile {
    width: 100%;
  }
}

#svg-container {
  width: 100%;
}

#right {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  @include desktop {
    margin: 50px 0;
    width: 50%;
    align-items: flex-end;
    margin-right: 3vw;
  }
  @include mobile {
    width: 100%;
    margin-top: 25px;
  }
}

.disabled {
  pointer-events: none;
  user-select: none;
}

#landing-text {
  font-family: "Montserrat";
  font-weight: 700;
  color: $color;
  margin-bottom: 50px;
  width: 80%;
  @include desktop {
    text-align: right;
    font-size: 3vw;
  }
  @include mobile {
    text-align: center;
    font-size: 10vw;
  }
}

#buttons {
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  & div {
    font-family: "Montserrat";
    font-weight: 700;
    font-size: 25px;
    color: #656565;
    cursor: pointer;
  }
  & div:hover {
    color: $color;
  }
}

#circle {
  margin: 0 30px;
  color: #656565;
}

.active {
  color: $color !important;
}

.textfield {
  width: 100%;
  background-color: transparent;
  border: 2px solid #656565;
  padding: 15px;
  border-radius: 1000px;
  caret-color: $color;
  font-family: "Montserrat";
  font-weight: 600;
  color: $color;
}

.textfield:focus {
  border: 2px solid $color;
}

.textfield-container {
  margin: 10px 0;
  width: 80%;
}

#checkbox {
  margin: 20px;
}

#checkbox-description {
  font-family: "Montserrat";
  font-weight: 600;
  color: $color-dark;
}

input:focus,
select:focus,
textarea:focus,
button:focus {
  outline: none;
}

#checkbox-container {
  display: flex;
  width: 80%;
  justify-content: center;
  align-items: center;
}

#toggleButton {
  margin: 10px 15px;
  cursor: pointer;
  display: block;
  transform-origin: 50% 50%;
  transform-style: preserve-3d;
  transition: transform 0.14s ease;
  &:active {
    transform: rotateX(30deg);
  }
  input {
    display: none;
    & + div {
      border: 3px solid rgba($color-dark, 1);
      border-radius: 50%;
      position: relative;
      width: 44px;
      height: 44px;
      svg {
        fill: none;
        stroke-width: 3.6;
        stroke: $color-dark;
        stroke-linecap: round;
        stroke-linejoin: round;
        width: 44px;
        height: 44px;
        display: block;
        position: absolute;
        left: -3px;
        top: -3px;
        right: -3px;
        bottom: -3px;
        z-index: 1;
        stroke-dashoffset: 162.6 - 38;
        stroke-dasharray: 0 162.6 133 (162.6 - 133);
        transition: all 0.4s ease 0s;
      }
      &:before,
      &:after {
        content: "";
        width: 3px;
        height: 16px;
        background: $color-dark;
        position: absolute;
        left: 50%;
        top: 50%;
        border-radius: 5px;
      }
      &:before {
        opacity: 0;
        transform: scale(0.3) translate(-50%, -50%) rotate(45deg);
        animation: bounceInBefore 0.3s linear forwards 0.3s;
      }
      &:after {
        opacity: 0;
        transform: scale(0.3) translate(-50%, -50%) rotate(-45deg);
        animation: bounceInAfter 0.3s linear forwards 0.3s;
      }
    }
    &:checked + div {
      svg {
        stroke: $color;
        stroke-dashoffset: 162.6;
        stroke-dasharray: 0 162.6 28 (162.6 - 28);
        transition: all 0.4s ease 0.2s;
      }
      &:before {
        opacity: 0;
        transform: scale(0.3) translate(-50%, -50%) rotate(45deg);
        animation: bounceInBeforeDont 0.3s linear forwards 0s;
      }
      &:after {
        opacity: 0;
        transform: scale(0.3) translate(-50%, -50%) rotate(-45deg);
        animation: bounceInAfterDont 0.3s linear forwards 0s;
      }
    }
  }
}

@keyframes bounceInBefore {
  0% {
    opacity: 0;
    transform: scale(0.3) translate(-50%, -50%) rotate(45deg);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.1) translate(-50%, -50%) rotate(45deg);
  }
  80% {
    opacity: 1;
    transform: scale(0.89) translate(-50%, -50%) rotate(45deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) translate(-50%, -50%) rotate(45deg);
  }
}

@keyframes bounceInAfter {
  0% {
    opacity: 0;
    transform: scale(0.3) translate(-50%, -50%) rotate(-45deg);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.1) translate(-50%, -50%) rotate(-45deg);
  }
  80% {
    opacity: 1;
    transform: scale(0.89) translate(-50%, -50%) rotate(-45deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) translate(-50%, -50%) rotate(-45deg);
  }
}

@keyframes bounceInBeforeDont {
  0% {
    opacity: 1;
    transform: scale(1) translate(-50%, -50%) rotate(45deg);
  }
  100% {
    opacity: 0;
    transform: scale(0.3) translate(-50%, -50%) rotate(45deg);
  }
}

@keyframes bounceInAfterDont {
  0% {
    opacity: 1;
    transform: scale(1) translate(-50%, -50%) rotate(-45deg);
  }
  100% {
    opacity: 0;
    transform: scale(0.3) translate(-50%, -50%) rotate(-45deg);
  }
}

#spinner {
  height: 100%;
}

#photo-container-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80%;
}

#photo-container {
  color: $color-dark;
  font-size: 30px;
  border: 2px solid $color-dark;
  width: 75px;
  height: 75px;
  border-radius: 37.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 10px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
}

#photo-container:hover {
  color: $color;
  border-color: $color;
}

#auth-button {
  color: #1a2328;
  cursor: pointer;
  font-family: "Montserrat";
  font-size: 25px;
  font-weight: 600;
  background-color: $color-dark;
  padding: 10px;
  border-radius: 1000px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  width: 80%;
}

#auth-button:hover {
  background-color: $color;
}

#alternative-auth {
  width: 80%;
  text-align: center;
  font-family: "Montserrat";
  font-weight: 600;
  color: $color;
  margin-bottom: 20px;
  @include mobile {
    font-size: 5vw;
  }
  @include desktop {
    font-size: 2vw;
  }
}

#alternative-auth-buttons {
  display: flex;
  justify-content: space-between;
  width: 80%;
}

.alternative-auth-button {
  width: 50%;
  border-radius: 1000px;
  cursor: pointer;
  text-align: center;
  padding: 10px;
  font-size: 30px;
}

#facebook {
  background-color: #334f8d;
  color: white;
  margin-right: 10px;
}

#google {
  background-color: white;
  color: black;
  margin-left: 10px;
}
</style>
