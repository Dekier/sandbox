<script setup lang="ts">
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

const switchCamera = (data: boolean) => {
  hudStore.setIsActiveOutline(data);
};
const switchColorOutline = (data: string) => {
  hudStore.setColorOutline(data);
};
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
    <p class="Settings__subtitle">Outline</p>
    <div class="Settings__row">
      <button
        type="button"
        class="Settings__button-turn-on-off"
        :class="{
          'Settings__button-turn-on-off--active': hudStore.isActiveOutline,
        }"
        @click="switchCamera(true)"
      >
        On
      </button>
      <button
        type="button"
        class="Settings__button-turn-on-off"
        :class="{
          'Settings__button-turn-on-off--active': !hudStore.isActiveOutline,
        }"
        @click="switchCamera(false)"
      >
        Off
      </button>
    </div>
    <p class="Settings__label">Color</p>
    <div class="Settings__row">
      <button
        type="button"
        class="Settings__button-turn-on-off"
        :class="{
          'Settings__button-turn-on-off--active':
            hudStore.colorOutline === '#000000',
        }"
        @click="switchColorOutline('#000000')"
      >
        Black
      </button>
      <button
        type="button"
        class="Settings__button-turn-on-off"
        :class="{
          'Settings__button-turn-on-off--active':
            hudStore.colorOutline === '#1e1e1e',
        }"
        @click="switchColorOutline('#1e1e1e')"
      >
        Gray
      </button>
      <button
        type="button"
        class="Settings__button-turn-on-off"
        :class="{
          'Settings__button-turn-on-off--active':
            hudStore.colorOutline === '#3d312f',
        }"
        @click="switchColorOutline('#3d312f')"
      >
        Brown
      </button>
    </div>
  </div>
</template>
<style lang="scss">
@import "settings";
</style>
