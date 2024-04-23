<script setup lang="ts">
const storeGeneral = useGeneralStore();
const { settingsPixelRatio } = storeToRefs(storeGeneral);

const shadowClickLeft = () => {
  if (settingsPixelRatio.value > 0.6) {
    storeGeneral.setSettingsPixelRatio(settingsPixelRatio.value - 0.1);
  }
};

const shadowClickRight = () => {
  if (settingsPixelRatio.value < 2) {
    storeGeneral.setSettingsPixelRatio(settingsPixelRatio.value + 0.1);
  }
};
</script>

<template>
  <div class="Settings__row-2">
    <p class="Settings__title">Visual Quality</p>

    <div class="Settings__button-container">
      <button
        class="Settings__button-left"
        :class="{
          'Settings__button-left--disable': settingsPixelRatio < 0.6,
        }"
        @click="shadowClickLeft"
      >
        <img src="/svg/arrow.svg" class="Settings__arrow-left" />
      </button>
      <div class="Settings__selected">
        {{ settingsPixelRatio.toFixed(1) }}
      </div>
      <button
        class="Settings__button-right"
        :class="{
          'Settings__button-right--disable': settingsPixelRatio > 2,
        }"
        @click="shadowClickRight"
      >
        <img src="/svg/arrow.svg" class="Settings__arrow-right" />
      </button>
    </div>
  </div>
</template>
