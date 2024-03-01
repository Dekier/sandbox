<script setup lang="ts">
const storeEquipmentDescription = useEquipmentDescriptionsStore();
const { equipmentDescriptionsList } = storeToRefs(storeEquipmentDescription);

const props = defineProps({
  activeItemTitle: {
    type: String,
    required: true,
  },
});

const title = (): string => {
  const index = equipmentDescriptionsList.value.findIndex(
    (data) => data.title === props.activeItemTitle
  );
  if (index !== -1) {
    return equipmentDescriptionsList.value[index].title;
  } else {
    return "";
  }
};
const description = (): string => {
  const index = equipmentDescriptionsList.value.findIndex(
    (data) => data.title === props.activeItemTitle
  );
  if (index !== -1) {
    return equipmentDescriptionsList.value[index].description;
  } else {
    return "";
  }
};
const src = (): string => {
  const index = equipmentDescriptionsList.value.findIndex(
    (data) => data.title === props.activeItemTitle
  );
  if (index !== -1) {
    return equipmentDescriptionsList.value[index].src;
  } else {
    return "";
  }
};
</script>

<template>
  <div class="EquipmentDescriptions__main-container">
    <img
      src="/image/backgrounds/background-big.png"
      class="EquipmentDescriptions__background"
    />
    <h1 class="EquipmentDescriptions__title">
      <img
        v-if="src()"
        :src="src()"
        class="EquipmentDescriptions__background-icon"
      />{{ title() }}
    </h1>
    <p class="EquipmentDescriptions__description">
      {{ description() }}
    </p>
  </div>
</template>
<style lang="scss">
@import "equipment-descriptions";
</style>
