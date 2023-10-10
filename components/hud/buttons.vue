<script setup lang="ts">
const hudStore = useHudStore();
const openSettingsHud = () => {
  hudStore.setIsSettingsHud();
};

const { onLoop } = useRenderLoop();
let frames = 0,
  prevTime = performance.now();
onLoop(({ _delta, elapsed }) => {
  frames++;
  const time = performance.now();
  if (time >= prevTime + 1000) {
    hudStore.setFps(Math.round((frames * 1000) / (time - prevTime)));

    frames = 0;
    prevTime = time;
  }
});
</script>

<template>
  <div class="Buttons__main-container-right-top" @click="openSettingsHud">
    <button type="button" class="Buttons__button">
      <img src="/svg/settings.svg" class="Buttons__icon" />
    </button>
  </div>
  <div class="Buttons__main-container-left-bottom">
    <span class="Buttons__fps">{{ hudStore.fps }} FPS</span>
  </div>
</template>
<style lang="scss">
@import "buttons";
</style>
