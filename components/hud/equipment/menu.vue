<script setup lang="ts">
const storeEquipmentGround = useEquipmentStore();
const { getSrcItem } = useEquipmentUtils();
const { equipmentItemsHandList, itemMaxCountList, isActiveHandItemTitle } =
  storeToRefs(storeEquipmentGround);

const isActive = ref(1);

document.addEventListener(
  "keydown",
  (event) => {
    if (
      [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "!",
        "@",
        "#",
        "$",
        "%",
        "^",
        "&",
        "*",
      ].includes(event.key.toLowerCase())
    ) {
      let value = "";
      switch (event.key.toLowerCase()) {
        case "!":
          value = "1";
          break;
        case "@":
          value = "2";
          break;
        case "#":
          value = "3";
          break;
        case "$":
          value = "4";
          break;
        case "%":
          value = "5";
          break;
        case "^":
          value = "6";
          break;
        case "&":
          value = "7";
          break;
        case "*":
          value = "8";
          break;

        default:
          value = event.key.toLowerCase();
          break;
      }
      isActive.value = parseInt(value);
      const title = equipmentItemsHandList.value[isActive.value - 1].title;
      storeEquipmentGround.setIsActiveHandItemTitle(title);
    }
  },
  false
);

watch(equipmentItemsHandList, () => {
  const title = equipmentItemsHandList.value[isActive.value - 1].title;
  storeEquipmentGround.setIsActiveHandItemTitle(title);
});

const getMaxCount = (title: string) => {
  return itemMaxCountList.value.find((data) => data.title === title)?.maxCount;
};
const animateCount = ref(false);
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
          v-if="equipmentItemsHandList[data - 1].count"
          class="EquipmentMenu__count"
          :class="{
            'EquipmentMenu__count--active': data === isActive,
          }"
        >
          {{ equipmentItemsHandList[data - 1].count }} /
          {{ getMaxCount(equipmentItemsHandList[data - 1].title) }}
        </div>
        <img
          class="EquipmentMenu__image"
          :class="{ 'EquipmentMenu__image--active': data === isActive }"
          :src="getSrcItem(equipmentItemsHandList[data - 1].title)"
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
