<script setup lang="ts">
const storeGeneral = useGeneralStore();
const { settingsFlora } = storeToRefs(storeGeneral);

const listOfFloraType = ref(["Very Low", "Low", "Medium", "High", "Ultra"]);
const isActiveIndexFloraType = ref(3);
switch (settingsFlora.value) {
  case "Very Low":
    isActiveIndexFloraType.value = 0;
    break;

  case "Low":
    isActiveIndexFloraType.value = 1;
    break;

  case "Medium":
    isActiveIndexFloraType.value = 2;
    break;

  case "High":
    isActiveIndexFloraType.value = 3;
    break;
  case "Ultra":
    isActiveIndexFloraType.value = 4;
    break;

  default:
    break;
}

const shadowClickLeft = () => {
  if (isActiveIndexFloraType.value > 0) {
    isActiveIndexFloraType.value--;
  }
};

const shadowClickRight = () => {
  if (isActiveIndexFloraType.value < listOfFloraType.value.length - 1) {
    isActiveIndexFloraType.value++;
  }
};

watch(isActiveIndexFloraType, () => {
  switch (isActiveIndexFloraType.value) {
    case 0:
      storeGeneral.setSettingsFlora("Very Low");
      break;

    case 1:
      storeGeneral.setSettingsFlora("Low");
      break;

    case 2:
      storeGeneral.setSettingsFlora("Medium");
      break;

    case 3:
      storeGeneral.setSettingsFlora("High");
      break;
    case 4:
      storeGeneral.setSettingsFlora("Ultra");
      break;
    default:
      break;
  }
});
</script>

<template>
  <div class="Settings__row-2">
    <p class="Settings__title">Flora</p>

    <div class="Settings__button-container">
      <button
        class="Settings__button-left"
        :class="{
          'Settings__button-left--disable': isActiveIndexFloraType === 0,
        }"
        @click="shadowClickLeft"
      >
        <img src="/svg/arrow.svg" class="Settings__arrow-left" />
      </button>
      <div class="Settings__selected">
        {{ listOfFloraType[isActiveIndexFloraType] }}
      </div>
      <button
        class="Settings__button-right"
        :class="{
          'Settings__button-right--disable':
            isActiveIndexFloraType === listOfFloraType.length - 1,
        }"
        @click="shadowClickRight"
      >
        <img src="/svg/arrow.svg" class="Settings__arrow-right" />
      </button>
    </div>
  </div>
</template>
