<script setup lang="ts">
const characterStore = useCharacterStore();
const { positionCharacter } = storeToRefs(characterStore);
</script>
<template>
  <ModelsCharacterBody />
  <ModelsCharacterArms v-if="positionCharacter" />
</template>
