<template>
  <div class="EquipmentLeftList__main-container">
    <TransitionGroup name="list">
      <div
        v-for="data in addedElementToEquipmentList"
        :key="data.id"
        class="EquipmentLeftList__element"
      >
        <img
          src="/image/backgrounds/background-2.png"
          class="EquipmentLeftList__background"
        />
        <img :src="data.src" class="EquipmentLeftList__image" />
        <p class="EquipmentLeftList__text">
          {{ data.title }} (x{{ data.count }})
        </p>
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
