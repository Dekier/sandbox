<script setup lang="ts">
const storeGeneral = useGeneralStore();
const { isActiveMenuGame } = storeToRefs(storeGeneral);
const startGame = () => {
  storeGeneral.setIsActiveMenuGame(false);
  // storeGeneral.setIsStartedGame(true);
};
</script>

<template>
  <div
    id="button-start-game"
    v-if="isActiveMenuGame"
    class="Menu__main-container"
  >
    <button type="button" class="Menu__button" @click="startGame">PLAY</button>
  </div>
</template>
<style lang="scss">
@import "menu";
</style>
