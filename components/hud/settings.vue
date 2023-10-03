<script setup lang="ts">
import { useHudStore } from "~/stores/hud";
const { isMobile } = useDevice();
const hudStore = useHudStore();
const shadowSize = ref(isMobile ? 1024 : 4096);
const lightX = ref(-25);
const lightY = ref(15);
const lightZ = ref(30);

hudStore.setShadowSize(isMobile ? 1024 : 4096);

const switchShadows = (data: boolean) => {
  hudStore.setActiveShadows(data);
};

const changeShadowSize = () => {
  hudStore.setShadowSize(shadowSize.value);
};

const changeLightX = () => {
  hudStore.setLightX(lightX.value);
};

const changeLightY = () => {
  hudStore.setLightY(lightY.value);
};

const changeLightZ = () => {
  hudStore.setLightZ(lightZ.value);
};

const switchCamera = (data) => {
  if (!hudStore.isSwitchCameraAnimation) {
    hudStore.setCharacterCameraIsActive(data);
    hudStore.setIsSwitchCameraAnimation(true);
    setTimeout(() => {
      hudStore.setIsSwitchCameraAnimation(false);
    }, 2200);
  }
};
switchCamera(true);
</script>

<template>
  <div
    class="Settings__main-container"
    :class="{ 'Settings__main-container--active': hudStore.isSettingsHud }"
  >
    <p class="Settings__title">Settings</p>

    <p class="Settings__subtitle">Shadows</p>
    <div class="Settings__row">
      <button
        type="button"
        class="Settings__button-turn-on-off"
        :class="{
          'Settings__button-turn-on-off--active': hudStore.isActiveShadows,
        }"
        @click="switchShadows(true)"
      >
        On
      </button>
      <button
        type="button"
        class="Settings__button-turn-on-off"
        :class="{
          'Settings__button-turn-on-off--active': !hudStore.isActiveShadows,
        }"
        @click="switchShadows(false)"
      >
        Off
      </button>
    </div>
    <p class="Settings__label">Quality</p>
    <div class="Settings__row">
      <img src="/svg/arrow-down.svg" class="Settings__arrow-select" />
      <select
        v-if="isMobile"
        v-model="shadowSize"
        class="Settings__select"
        @change="changeShadowSize"
      >
        <option :value="256">XD</option>
        <option :value="512">Very Low</option>
        <option :value="1024">Low</option>
        <option :value="2048">Medium</option>
        <option :value="4096">High</option>
      </select>
      <select
        v-else
        v-model="shadowSize"
        class="Settings__select"
        @change="changeShadowSize"
      >
        <option :value="256">XD</option>
        <option :value="512">Very Low</option>
        <option :value="1024">Low</option>
        <option :value="2048">Medium</option>
        <option :value="4096">High</option>
        <option :value="8192">Very High</option>
        <option :value="16384">Ultra</option>
      </select>
    </div>
    <div class="Settings__line" />
    <p class="Settings__subtitle">Light</p>
    <p class="Settings__label">Left / Right</p>
    <input
      v-model="lightX"
      type="range"
      min="-25"
      max="32"
      class="Settings__slider"
      @input="changeLightX"
    />
    <p class="Settings__label">Down / Up</p>
    <input
      v-model="lightY"
      type="range"
      min="15"
      max="65"
      class="Settings__slider"
      @input="changeLightY"
    />
    <p class="Settings__label">Backwards / Forward</p>
    <input
      v-model="lightZ"
      type="range"
      min="-25"
      max="30"
      class="Settings__slider"
      @input="changeLightZ"
    />
    <div class="Settings__line" />
    <p class="Settings__subtitle" v-if="!isMobile">Camera</p>
    <div v-if="!isMobile" class="Settings__row">
      <button
        type="button"
        class="Settings__button-turn-on-off"
        :class="{
          'Settings__button-turn-on-off--active':
            !hudStore.isActiveCharacterCamera,
        }"
        @click="switchCamera(false)"
      >
        House
      </button>
      <button
        type="button"
        class="Settings__button-turn-on-off"
        :class="{
          'Settings__button-turn-on-off--active':
            hudStore.isActiveCharacterCamera,
        }"
        @click="switchCamera(true)"
      >
        Character
      </button>
    </div>
  </div>
</template>
<style lang="scss">
@import "settings";
</style>
