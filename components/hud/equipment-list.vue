<template>
  <div class="EquipmentList__main-container">
    <TransitionGroup name="list">
      <div
        v-for="data in addedElementToEquipmentList"
        :key="data.id"
        class="EquipmentList__element"
      >
        <div class="EquipmentList__image">soon</div>
        <p class="EquipmentList__text">{{ data.title }} (x{{ data.count }})</p>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
const hudStore = useHudStore();
const { addedElementToEquipmentList } = storeToRefs(hudStore);
</script>
<style lang="scss">
@import "equipment-list";
</style>
