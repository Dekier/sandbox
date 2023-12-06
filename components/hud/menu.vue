<script setup lang="ts">
const storeGeneral = useGeneralStore();
const startGame = () => {
  console.log("start");
  storeGeneral.setIsStartedGame(true);
};
</script>

<template>
  <div
    id="button-start-game"
    v-if="!storeGeneral.isStartedGame"
    class="Menu__main-container"
    @click="startGame"
  >
    <button type="button" class="Menu__button">START</button>
  </div>
</template>
<style lang="scss">
@import "menu";
</style>
