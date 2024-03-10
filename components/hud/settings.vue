<script setup lang="ts">
const storeGeneral = useGeneralStore();
const { settingsShadow, settingsGraphics } = storeToRefs(storeGeneral);
</script>

<template>
  <div class="Settings__main-container">
    <p class="Settings__title">Graphics</p>
    <div class="Settings__row">
      <div
        class="Settings__button"
        :class="{ 'Settings__button--active': settingsGraphics === 'Very Low' }"
        @click="storeGeneral.setSettingsGraphics('Very Low')"
      >
        Very Low
      </div>
      <div
        class="Settings__button"
        :class="{ 'Settings__button--active': settingsGraphics === 'Low' }"
        @click="storeGeneral.setSettingsGraphics('Low')"
      >
        Low
      </div>
      <div
        class="Settings__button"
        :class="{ 'Settings__button--active': settingsGraphics === 'Medium' }"
        @click="storeGeneral.setSettingsGraphics('Medium')"
      >
        Medium
      </div>
      <div
        class="Settings__button"
        :class="{ 'Settings__button--active': settingsGraphics === 'High' }"
        @click="storeGeneral.setSettingsGraphics('High')"
      >
        High
      </div>
      <div
        class="Settings__button"
        :class="{ 'Settings__button--active': settingsGraphics === 'Ultra' }"
        @click="storeGeneral.setSettingsGraphics('Ultra')"
      >
        Ultra
      </div>
    </div>
    <p class="Settings__title">Shadows</p>
    <div class="Settings__row">
      <div
        class="Settings__button"
        :class="{ 'Settings__button--active': settingsShadow === 256 }"
        @click="storeGeneral.setSettingsShadow(256)"
      >
        Very Low
      </div>
      <div
        class="Settings__button"
        :class="{ 'Settings__button--active': settingsShadow === 512 }"
        @click="storeGeneral.setSettingsShadow(512)"
      >
        Low
      </div>
      <div
        class="Settings__button"
        :class="{ 'Settings__button--active': settingsShadow === 1024 }"
        @click="storeGeneral.setSettingsShadow(1024)"
      >
        Medium
      </div>
      <div
        class="Settings__button"
        :class="{ 'Settings__button--active': settingsShadow === 2048 }"
        @click="storeGeneral.setSettingsShadow(2048)"
      >
        High
      </div>
    </div>
    <!-- <p class="Settings__title">Audio</p>
    <div class="Settings__row">
      <div class="Settings__circle" v-for="data in 5" :key="data"></div>
    </div> -->
  </div>
</template>
<style lang="scss">
@import "settings";
</style>
