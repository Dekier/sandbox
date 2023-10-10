<script setup lang="ts">
let isActive = ref(false);
setTimeout(() => {
  isActive.value = true;
}, 100);
</script>
<template>
  <HudButtons />
  <HudSettings />
  <HudControls v-if="isActive" />
</template>
