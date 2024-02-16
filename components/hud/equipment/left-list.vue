<template>
  <div class="EquipmentLeftList__main-container">
    <TransitionGroup name="list">
      <div
        v-for="data in addedElementToEquipmentList"
        :key="data.id"
        class="EquipmentLeftList__element"
      >
        <div class="EquipmentLeftList__image">soon</div>
        <p class="EquipmentLeftList__text">{{ data.title }} (x{{ data.count }})</p>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
const hudStore = useHudStore();
const { addedElementToEquipmentList } = storeToRefs(hudStore);
</script>
<style lang="scss">
@import "left-list";
</style>
