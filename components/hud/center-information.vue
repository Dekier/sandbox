<script setup lang="ts">
const hudStore = useHudStore();
const storeControls = useControlsStore();
const { isActiveGamepad } = storeToRefs(hudStore);
const { userUseGamepad } = storeToRefs(storeControls);
const isActiveInformation = ref(false);
watch(isActiveGamepad, (value) => {
  isActiveInformation.value = true;
  setTimeout(() => {
    isActiveInformation.value = false;
  }, 3000);
});
const text = computed(() => {
  return isActiveGamepad.value ? "Connected" : "Disconnected";
});

const isActiveKeyboardInfo = ref(false);
const isActiveGamepadInfo = ref(false);
watch(userUseGamepad, (value) => {
  if (value) {
    isActiveKeyboardInfo.value = false;
    isActiveGamepadInfo.value = true;

    setTimeout(() => {
      isActiveGamepadInfo.value = false;
    }, 3000);
  } else {
    isActiveKeyboardInfo.value = true;
    isActiveGamepadInfo.value = false;

    setTimeout(() => {
      isActiveKeyboardInfo.value = false;
    }, 3000);
  }
});

const activeIcon = computed(() => {
  return userUseGamepad.value ? "/svg/gamepad.svg" : "/svg/keyboard.svg";
});
</script>

<template>
  <Transition name="fade-information">
    <div v-if="isActiveInformation" class="CenterInformation__main-container">
      <img src="/svg/gamepad.svg" class="CenterInformation__icon" />
      <span class="CenterInformation__text">{{ text }}</span>
    </div>
  </Transition>

  <Transition name="fade-information">
    <div
      v-if="isActiveKeyboardInfo && !isActiveInformation"
      class="CenterInformation__main-container"
    >
      <img src="/svg/keyboard.svg" class="CenterInformation__icon-keyboard" />
      <span class="CenterInformation__text">Active</span>
    </div>
  </Transition>

  <Transition name="fade-information">
    <div
      v-if="isActiveGamepadInfo && !isActiveInformation"
      class="CenterInformation__main-container"
    >
      <img src="/svg/gamepad.svg" class="CenterInformation__icon" />
      <span class="CenterInformation__text">Active</span>
    </div>
  </Transition>
</template>

<style lang="scss">
@import "center-information";
</style>
