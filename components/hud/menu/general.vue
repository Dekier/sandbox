<script setup lang="ts">
const menuInGameStore = useMenuInGameStore();
const { tabType } = storeToRefs(menuInGameStore);
const characterStore = useCharacterStore();
const { positionCharacter } = storeToRefs(characterStore);
</script>

<template>
  <div class="MenuInGame__main-container">
    <HudMenuHeader />
    <HudMenuMapHome v-if="positionCharacter && tabType === 'island'" />
  </div>
</template>
<style lang="scss">
@import "general";
</style>
