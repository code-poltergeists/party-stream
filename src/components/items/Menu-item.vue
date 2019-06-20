<template>
  <div :class="{'item': true, 'active': active, 'container-fluid': true}" @click="toggleMenuItem()">
      <div class="row no-gutters">
        <div class="col-item">
          <i :class="[icon, 'icon']"></i>
        </div>
        <div class="col">
          <span class="text">{{ text }}</span>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class MenuItem extends Vue {
  @Prop({ default: 0 }) private index!: number;
  @Prop({ default: '' }) private icon!: string;
  @Prop({ default: '' }) private text!: string;
  @Prop({ default: false }) private active!: boolean;
  @Prop({ default: '' }) private route!: string;

  private toggleMenuItem() {
    this.$store.commit('changeMenuItem', this.index);
    this.$router.push({ name: this.route });
  }
}
</script>

<style scoped lang="scss">
.col-item {
  width: 50px;
}

.item {
  color: #247bd5;
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
    rgba(36, 122, 213, 0.5) 0%,
    rgba(55, 143, 231, 0.1) 35%,
    rgba(71, 159, 247, 0) 100%
  );
  border-left: 5px solid #247bd5;
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
