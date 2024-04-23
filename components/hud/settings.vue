<script setup lang="ts"></script>

<template>
  <div class="Settings__main-container">
    <p class="Settings__title-big">Graphics</p>
    <HudSettingsFlora />
    <HudSettingsShadows />
    <p class="Settings__title-big">Advanced</p>
    <HudSettingsPixelRatio />

    <!-- <p class="Settings__title">
      Antialiasing<button
        type="button"
        class="Settings__radio"
        :class="{ 'Settings__radio--active': settingsAntialias }"
        @click="storeGeneral.setSettingsAntialias(!settingsAntialias)"
      >
        <div
          class="Settings__radio-background"
          :class="{ 'Settings__radio-background--active': settingsAntialias }"
        ></div>
      </button>
    </p> -->
  </div>
</template>
<style lang="scss">
@import "settings";
</style>
