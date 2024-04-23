<script setup lang="ts">
const storeGeneral = useGeneralStore();
const { settingsShadow } = storeToRefs(storeGeneral);

const listOfShadowsType = ref([
  "Off",
  "Very Low",
  "Low",
  "Medium",
  "High",
  "Ultra",
]);
const isActiveIndexShadowsType = ref(3);
switch (settingsShadow.value) {
  case 0:
    isActiveIndexShadowsType.value = 0;
    break;

  case 256:
    isActiveIndexShadowsType.value = 1;
    break;

  case 512:
    isActiveIndexShadowsType.value = 2;
    break;

  case 1024:
    isActiveIndexShadowsType.value = 3;
    break;
  case 2048:
    isActiveIndexShadowsType.value = 4;
    break;
  case 4096:
    isActiveIndexShadowsType.value = 5;
    break;

  default:
    break;
}

const shadowClickLeft = () => {
  if (isActiveIndexShadowsType.value > 0) {
    isActiveIndexShadowsType.value--;
  }
};

const shadowClickRight = () => {
  if (isActiveIndexShadowsType.value < listOfShadowsType.value.length - 1) {
    isActiveIndexShadowsType.value++;
  }
};

watch(isActiveIndexShadowsType, () => {
  switch (isActiveIndexShadowsType.value) {
    case 0:
      storeGeneral.setSettingsShadow(0);
      break;

    case 1:
      storeGeneral.setSettingsShadow(256);
      break;

    case 2:
      storeGeneral.setSettingsShadow(512);
      break;

    case 3:
      storeGeneral.setSettingsShadow(1024);
      break;
    case 4:
      storeGeneral.setSettingsShadow(2048);
      break;
    case 5:
      storeGeneral.setSettingsShadow(4096);
      break;

    default:
      break;
  }
});
</script>

<template>
  <div class="Settings__row-2">
    <p class="Settings__title">Shadows</p>

    <div class="Settings__button-container">
      <button
        class="Settings__button-left"
        :class="{
          'Settings__button-left--disable': isActiveIndexShadowsType === 0,
        }"
        @click="shadowClickLeft"
      >
        <img src="/svg/arrow.svg" class="Settings__arrow-left" />
      </button>
      <div class="Settings__selected">
        {{ listOfShadowsType[isActiveIndexShadowsType] }}
      </div>
      <button
        class="Settings__button-right"
        :class="{
          'Settings__button-right--disable':
            isActiveIndexShadowsType === listOfShadowsType.length - 1,
        }"
        @click="shadowClickRight"
      >
        <img src="/svg/arrow.svg" class="Settings__arrow-right" />
      </button>
    </div>
  </div>
</template>
