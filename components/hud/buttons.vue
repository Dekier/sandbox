<script setup lang="ts">
const hudStore = useHudStore();

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
  <div class="Buttons__left-top-Container">
    <span class="Buttons__fps">{{ hudStore.fps }} FPS</span>
  </div>

  <div class="Buttons__right-bottom-container">
    <div class="Buttons__row">
      <img
        src="/image/backgrounds/background-rect-2.png"
        class="Buttons__background"
      />
      <span class="Buttons__keyboard-button">I</span>
      <img
        src="/image/icons/backpack.png"
        class="Buttons__icon"
        @click="changeSizeMap"
      />
    </div>
    <div class="Buttons__row">
      <img
        src="/image/backgrounds/background-rect-2.png"
        class="Buttons__background"
      />
      <span class="Buttons__keyboard-button">M</span>
      <div class="Buttons__rect-background">
        <div
          class="Buttons__rect"
          v-for="data in 9"
          :key="data"
          :class="{ 'Buttons__rect--active': data === 5 }"
        ></div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
@import "buttons";
</style>
