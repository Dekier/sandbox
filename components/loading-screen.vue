<script setup lang="ts">
import { useProgress } from "@tresjs/cientos";

const { hasFinishLoading, progress } = await useProgress();
</script>

<template>
  <transition name="fade">
    <div v-show="!hasFinishLoading" class="Loading__main-container">
      <div
        class="Loading__center-container"
        :class="{ 'Loading__center-container--hide': hasFinishLoading }"
      >
        Loading... {{ progress }} %
      </div>
    </div>
  </transition>
</template>
<style lang="scss">
@import "loading-screen";
</style>
