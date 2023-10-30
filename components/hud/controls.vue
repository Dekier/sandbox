<script setup lang="ts">
const storeControls = useControlsStore();
const {
  keys,
  upPressed,
  downPressed,
  leftPressed,
  rightPressed,
  userUseGamepad,
  buttonRTValue,
  gamepadButtonYPressed,
  gamepadButtonAPressed,
} = storeToRefs(storeControls);
const { isMobile } = useDevice();
</script>

<template>
  <div v-if="!isMobile && !userUseGamepad" class="Controls__main-container">
    <div class="Controls__row-center">
      <div
        class="Controls__label"
        :class="{ 'Controls__label--active': upPressed }"
      >
        W
      </div>
    </div>
    <div class="Controls__row-center">
      <div
        class="Controls__label"
        :class="{ 'Controls__label--active': leftPressed }"
      >
        A
      </div>
      <div
        class="Controls__label"
        :class="{ 'Controls__label--active': downPressed }"
      >
        S
      </div>
      <div
        class="Controls__label"
        :class="{ 'Controls__label--active': rightPressed }"
      >
        D
      </div>
    </div>
    <div class="Controls__row">
      <div
        class="Controls__label-big"
        :class="{
          'Controls__label-big--active': keys.shiftleft,
        }"
      >
        SHIFT
      </div>
      <p class="Controls__text">SPRINT</p>
    </div>
    <div class="Controls__row">
      <div
        class="Controls__label-big"
        :class="{ 'Controls__label-big--active': keys.space }"
      >
        SPACE
      </div>
      <p class="Controls__text">JUMP</p>
    </div>
  </div>

  <div v-if="!isMobile && userUseGamepad" class="Controls__main-container">
    <div class="Controls__row">
      <div
        class="Controls__label-long"
        :class="{
          'Controls__label-long--active': buttonRTValue,
        }"
      >
        RT
      </div>
      <p class="Controls__text">SPRINT</p>
    </div>
    <div class="Controls__row">
      <div
        class="Controls__label-circle Controls__label-circle--y"
        :class="{ 'Controls__label-circle--active': gamepadButtonYPressed }"
      >
        Y
      </div>
      <p class="Controls__text">JUMP</p>
    </div>
    <div class="Controls__row">
      <div
        class="Controls__label-circle"
        :class="{ 'Controls__label-circle--active': gamepadButtonAPressed }"
      >
        A
      </div>
      <p class="Controls__text">ACTION</p>
    </div>
  </div>
</template>
<style lang="scss">
@import "controls";
</style>
