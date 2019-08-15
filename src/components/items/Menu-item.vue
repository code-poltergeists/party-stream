<template>
  <div :class="{'item': true, 'active': active}" @click="toggleMenuItem()">
    <div class="icon-container">
      <i :class="[icon, 'icon']"></i>
    </div>
    <span class="text">{{ text }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import AuthService from "../../services/auth-service";

@Component
export default class MenuItem extends Vue {
  @Prop({ default: 0 }) private index!: number;
  @Prop({ default: "" }) private icon!: string;
  @Prop({ default: "" }) private text!: string;
  @Prop({ default: false }) private active!: boolean;
  @Prop({ default: "" }) private route!: string;

  authService = new AuthService();

  private toggleMenuItem() {
    if (this.route === "logout") {
      this.authService.logOut();
    } else {
      this.$router.push({ name: this.route });
      this.$store.commit("toggleMenu", false);
    }
  }
}
</script>

<style scoped lang="scss">
.icon-container {
  width: 50px;
}

.item {
  color: #45b885;
  height: 65px;
  display: flex;
  align-items: center;
  padding-left: 30px;
  border-left: 5px solid transparent;
  cursor: pointer;
}

.active {
  background: linear-gradient(
    to right,
    rgba(36, 213, 122, 0.5) 0%,
    rgba(55, 231, 143, 0.1) 35%,
    rgba(71, 247, 159, 0) 100%
  );
  border-left: 5px solid #45b885;
}

.icon {
  font-size: 30px;
}

.text {
  font-size: 20px;
  font-family: "Montserrat", sans-serif;
  font-weight: 600;
  margin-left: 10px;
}
</style>
