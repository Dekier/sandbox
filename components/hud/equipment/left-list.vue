<script setup lang="ts">
const hudStore = useHudStore();
const { getSrcItem } = useEquipmentUtils();
const { addedElementToEquipmentList } = storeToRefs(hudStore);
</script>

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
        <img :src="getSrcItem(data.title)" class="EquipmentLeftList__image" />
        <p class="EquipmentLeftList__text">
          {{ data.title }} (x{{ data.count }})
        </p>
      </div>
    </TransitionGroup>
  </div>
</template>

<style lang="scss">
@import "left-list";
</style>
