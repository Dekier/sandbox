<script setup lang="ts">
const storeControl = useControlsStore();
const startGame = () => {
  storeControl.setKeysTrue("escape");
};
</script>

<template>
  <!-- <div
    v-if="!storeControl.escape"
    class="Menu__main-container"
    @click="startGame"
  >
    <button type="button" class="Menu__button">START</button>
  </div> -->
</template>
<style lang="scss">
@import "menu";
</style>
