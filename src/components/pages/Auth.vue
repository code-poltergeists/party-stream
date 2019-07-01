<template>
  <div id="layout">
    <div id="left">
      <svg height="500" width="600">
        <defs>
          <linearGradient
            id="gradient" 
            x1="0%" 
            y1="0%"
            x2="0%"
            y2="100%"
          >
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
    <div id="right">
      <p id="landing-text" v-html="$t('landing-text')"></p>
      <div id="buttons">
        <div 
          id="login" 
          :class="{'active': currentTab === 'login'}"
          @click="currentTab = 'login'"
        >
          {{ $t('login').toUpperCase() }}
        </div>
        <i class="fas fa-circle" id="circle"></i>
        <div id="signup" :class="{'active': currentTab === 'signup'}" @click="currentTab = 'signup'">{{ $t('signup').toUpperCase() }}</div>
      </div>
      <div class="textfield-container" id="user-container">
        <input class="textfield" id="user-input" placeholder="@username, email, phone #">
      </div>
      <div id="checkbox-container">
        <label id="toggleButton">
          <input type="checkbox" @change="isPasswordEnabled = !isPasswordEnabled">
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
                   transform="translate(-2.000000, -2.000000)"></path>
              </svg>
          </div>
        </label>
        <div id="checkbox-description" :class="{'active': !isPasswordEnabled}">
          {{ $t('passwordless') }}
        </div>
      </div>  
      <div class="textfield-container" id="password-container" v-if="isPasswordEnabled">
        <input class="textfield" id="password-input" placeholder="Password">
      </div>
      <div id="log-in-button">
        {{ $t('login').toUpperCase() }}
      </div>
      <div id="alternative-log-in">
        {{ $t('alternative-log-in') }}
      </div>
      <div id="alternative-log-in-buttons">
        <div id="facebook" class="alternative-log-in-button">
          <i class="fab fa-facebook-square"></i>
        </div>
        <div id="google" class="alternative-log-in-button">
          <i class="fab fa-google"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AuthService from '../../services/auth-service';

@Component
export default class Auth extends Vue {
  private authService = new AuthService();
  private currentTab = 'login';
  private isPasswordEnabled = true;
  
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
$color: #E3E3E3;
$color-dark: #656565;

#layout {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

#left {
  width: 50%;
  height: 100vh;
  color: $color;
  display: flex;
  justify-content: center;
  align-items: center;
}

#right {
  width: 50%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

#landing-text {
  font-family: 'Montserrat';
  font-weight: 700;
  font-size: 50px;
  color: $color;
  text-align: right;
  margin-bottom: 50px;
  width: 60%;
}

#buttons {
  display: flex;
  align-items: center;
}

#buttons div {
  font-family: 'Montserrat';
  font-weight: 700;
  font-size: 25px;
  color: #656565;
  cursor: pointer;
}

#buttons div:hover {
  color: $color;
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
  font-family: 'Montserrat';
  font-weight: 600;
}

.textfield:focus {
  border: 2px solid $color;
}

.textfield-container {
  width: 60%;
}

#user-container {
  margin-top: 20px;
}

#checkbox {
  margin: 20px;
}

#checkbox-description {
  font-family: 'Montserrat';
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
  align-items: center;
}

#toggleButton {
  margin: 15px;
  cursor: pointer;
  display: block;
  transform-origin: 50% 50%;
  transform-style: preserve-3d;
  transition: transform .14s ease;
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
        transition: all .4s ease 0s;
      }
      &:before,
      &:after {
        content: '';
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
        transform: scale(.3) translate(-50%, -50%) rotate(45deg);
        animation: bounceInBefore .3s linear forwards .3s;
      }
      &:after {
        opacity: 0;
        transform: scale(.3) translate(-50%, -50%) rotate(-45deg);
        animation: bounceInAfter .3s linear forwards .3s;
      }
    }
    &:checked + div {
      svg {
        stroke: $color;
        stroke-dashoffset: 162.6;
        stroke-dasharray: 0 162.6 28 (162.6 - 28);
        transition: all .4s ease .2s;
      }
      &:before {
        opacity: 0;
        transform: scale(.3) translate(-50%, -50%) rotate(45deg);
        animation: bounceInBeforeDont .3s linear forwards 0s;
      }
      &:after {
        opacity: 0;
        transform: scale(.3) translate(-50%, -50%) rotate(-45deg);
        animation: bounceInAfterDont .3s linear forwards 0s;
      }
    }
  }
}

@keyframes bounceInBefore {
  0% {
    opacity: 0;
    transform: scale(.3) translate(-50%, -50%) rotate(45deg);
  }
  50%{
    opacity: 0.9;
    transform: scale(1.1) translate(-50%, -50%) rotate(45deg);
  }
  80%{
    opacity: 1;
    transform: scale(.89) translate(-50%, -50%) rotate(45deg);
  }
  100%{
    opacity: 1;
    transform: scale(1) translate(-50%, -50%) rotate(45deg);
  }
}

@keyframes bounceInAfter {
  0% {
    opacity: 0;
    transform: scale(.3) translate(-50%, -50%) rotate(-45deg);
  }
  50%{
    opacity: 0.9;
    transform: scale(1.1) translate(-50%, -50%) rotate(-45deg);
  }
  80%{
    opacity: 1;
    transform: scale(.89) translate(-50%, -50%) rotate(-45deg);
  }
  100%{
    opacity: 1;
    transform: scale(1) translate(-50%, -50%) rotate(-45deg);
  }
}

@keyframes bounceInBeforeDont {
  0% {
    opacity: 1;
    transform: scale(1) translate(-50%, -50%) rotate(45deg);
  }
  100%{
    opacity: 0;
    transform: scale(.3) translate(-50%, -50%) rotate(45deg);
  }
}

@keyframes bounceInAfterDont {
  0% {
    opacity: 1;
    transform: scale(1) translate(-50%, -50%) rotate(-45deg);
  }
  100%{
    opacity: 0;
    transform: scale(.3) translate(-50%, -50%) rotate(-45deg);
  }
}

#log-in-button {
  color: #1A2328;
  cursor: pointer;
  font-family: 'Montserrat';
  font-size: 25px;
  font-weight: 600;
  background-color: $color-dark;
  width: 60%;
  padding: 10px;
  border-radius: 1000px;
  text-align: center;
}

#password-container {
  margin-bottom: 20px;
}

#log-in-button:hover {
  background-color: $color;
}

#alternative-log-in {
  font-family: 'Montserrat';
  font-weight: 600;
  color: $color;
  font-size: 20px;
  margin: 20px 0;
}

#alternative-log-in-buttons {
  display: flex;
  width: 60%;
  justify-content: space-between;
}

.alternative-log-in-button {
  width: 50%;
  border-radius: 1000px;
  cursor: pointer;
  text-align: center;
  padding: 10px;
  font-size: 30px;
}

#facebook {
  background-color: #334F8D;
  color: white;
  margin-right: 10px;
}

#google {
  background-color: white;
  color: black;
  margin-left: 10px;
}
</style>
