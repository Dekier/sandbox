<script setup lang="ts">
const menuInGameStore = useMenuInGameStore();
const { tabType } = storeToRefs(menuInGameStore);
</script>
<template>
  <HudMenuGeneral v-if="tabType" />
  <HudButtons />
  <HudMouseControl />
  <HudEquipmentLeftList />
  <HudEquipmentMenu />
  <!-- <HudSettings /> -->
  <!-- <HudControls /> -->
  <HudCenterInformation />
  <HudMenu />
  <HudLabels />
</template>
