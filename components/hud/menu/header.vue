<script setup lang="ts">
const menuInGameStore = useMenuInGameStore();
const { tabType } = storeToRefs(menuInGameStore);
const tabs = ref(["world", "journal", "equipment", "character", "island"]);
</script>

<template>
  <div class="MenuInGameHeader__main-container">
    <div class="MenuInGameHeader__dot" />
    <button
      class="MenuInGameHeader__button"
      :class="{ 'MenuInGameHeader__button--active': tabType === data }"
      type="button"
      v-for="data in tabs"
      :key="data"
      @click="menuInGameStore.setTabType(data)"
    >
      {{ data }}
    </button>
  </div>
</template>
<style lang="scss">
@import "header";
</style>
