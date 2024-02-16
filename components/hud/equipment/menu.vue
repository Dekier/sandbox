<script setup lang="ts">
const hudStore = useHudStore();
const storeEquipmentGround = useEquipmentStore();
const { equipmentHudList } = storeToRefs(storeEquipmentGround);

const isActive = ref(2);

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
</script>

<template>
  <div class="EquipmentMenu__main-container">
    <div
      class="EquipmentMenu__element-container"
      :class="{ 'EquipmentMenu__element-container--active': data === isActive }"
      v-for="data in 8"
      :key="data"
    >
      <div class="EquipmentMenu__content">
        <div v-if="equipmentHudList[data - 1]">
          <div class="EquipmentMenu__count">
            {{ equipmentHudList[data - 1].count }}
          </div>
          <div class="EquipmentMenu__image">soon</div>
        </div>
        <div
          class="EquipmentMenu__info-numbers"
          :class="{ 'EquipmentMenu__info-numbers--active': data === isActive }"
        >
          {{ data }}
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
@import "menu";
</style>
