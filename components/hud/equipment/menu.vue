<script setup lang="ts">
const hudStore = useHudStore();
const storeEquipmentGround = useEquipmentStore();
const { equipmentItemsHandList, itemMaxCountList } =
  storeToRefs(storeEquipmentGround);

const isActive = ref(1);

document.addEventListener(
  "keydown",
  (event) => {
    if (
      ["1", "2", "3", "4", "5", "6", "7", "8"].includes(event.key.toLowerCase())
    ) {
      isActive.value = parseInt(event.key.toLowerCase());
    }
  },
  false
);

const getMaxCount = (title: string) => {
  return itemMaxCountList.value.find((data) => data.title === title)?.maxCount;
};
</script>

<template>
  <div class="EquipmentMenu__main-container">
    <img
      src="/image/backgrounds/background.png"
      class="EquipmentMenu__background"
    />
    <div class="EquipmentMenu__element-container" v-for="data in 8" :key="data">
      <div
        class="EquipmentMenu__content"
        v-if="equipmentItemsHandList[data - 1].title"
        :class="{ 'EquipmentMenu__content--active': data === isActive }"
      >
        <div
          class="EquipmentMenu__count"
          :class="{ 'EquipmentMenu__count--active': data === isActive }"
        >
          {{ equipmentItemsHandList[data - 1].count }} /
          {{ getMaxCount(equipmentItemsHandList[data - 1].title) }}
        </div>
        <img
          class="EquipmentMenu__image"
          :class="{ 'EquipmentMenu__image--active': data === isActive }"
          :src="equipmentItemsHandList[data - 1].src"
        />
      </div>

      <div
        class="EquipmentMenu__info-numbers"
        :class="{ 'EquipmentMenu__info-numbers--active': data === isActive }"
      >
        {{ data }}
      </div>
    </div>
  </div>
</template>
<style lang="scss">
@import "menu";
</style>
