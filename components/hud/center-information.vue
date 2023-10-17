<script setup lang="ts">
const hudStore = useHudStore();
const { isActiveGamepad } = storeToRefs(hudStore);
const isActiveInformation = ref(false);
watch(isActiveGamepad, (value) => {
  isActiveInformation.value = true;
  setTimeout(() => {
    isActiveInformation.value = false;
  }, 3000);
});
const text = computed(() => {
  return hudStore.isActiveGamepad ? "Connected" : "Disconnected";
});
</script>

<template>
  <Transition name="fade-information">
    <div v-if="isActiveInformation" class="CenterInformation__main-container">
      <img src="/svg/gamepad.svg" class="CenterInformation__icon" />
      <span class="CenterInformation__text">{{ text }}</span>
    </div>
  </Transition>
</template>

<style lang="scss">
@import "center-information";
</style>
