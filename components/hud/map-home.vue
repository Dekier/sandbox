<script setup lang="ts">
const storeModularGround = useModularGroundStore();
const { groundDataList, activeModularList } = storeToRefs(storeModularGround);
const storeHud = useHudStore();
const { isActiveFullSizeMap } = storeToRefs(storeHud);

const changeSizeMap = () => {
  storeHud.setIsActiveFullSizeMap(!isActiveFullSizeMap.value);
};

const selectedSlices = ref([]);

const setSlice = (id: number) => {
  if (!checkModular(id)) return;
  if (selectedSlices.value.length) {
    const selectedIndex = selectedSlices.value.findIndex(
      (data) => !data.isActive && !data.isWall && data.id === id
    );
    if (selectedIndex !== -1) {
      selectedSlices.value.splice(selectedIndex, 1);
    } else {
      const data = groundDataList.value.find(
        (data) => !data.isActive && !data.isWall && data.id === id
      );
      if (data) {
        selectedSlices.value.push(data);
      }
    }

    for (let index = 0; index < selectedSlices.value.length; index++) {
      if (!checkModular(selectedSlices.value[index].id)) {
        selectedSlices.value.splice(index, 1);
      }
    }
    return;
  }
  const data = groundDataList.value.find(
    (data) => !data.isActive && !data.isWall && data.id === id
  );
  if (data) {
    selectedSlices.value.push(data);
  }
};

const isSelected = (id: number) => {
  if (selectedSlices.value.length) {
    return selectedSlices.value.find((data) => data.id == id);
  }
  return false;
};

const buyPieces = () => {
  storeModularGround.updatePieces(selectedSlices.value);
  selectedSlices.value = [];
};

const checkModular = (id: number) => {
  const list = activeModularList.value.concat(selectedSlices.value);
  const isLeftActive = list.find((data) => data.id === id - 1);
  const isRightActive = list.find((data) => data.id === id + 1);

  const isTopActive = list.find((data) => data.id === id - 15);
  const isBottomActive = list.find((data) => data.id === id + 15);
  let isActiveCount = 0;

  return isLeftActive || isRightActive || isTopActive || isBottomActive;
};
</script>

<template>
  <div v-if="isActiveFullSizeMap" class="MapHome__main-container">
    <div class="MapHome__center-box">
      <div class="MapHome__header">
        <div
          class="MapHome__modular MapHome__modular--purchased-module MapHome__modular--info"
        ></div>
        <div class="MapHome__text">= 100</div>
      </div>
      <div class="MapHome__list-of-modulars">
        <div
          v-for="data in groundDataList"
          :key="data.id"
          class="MapHome__modular"
          :class="{
            'MapHome__modular--purchased-module': data.isActive && !data.isWall,
            'MapHome__modular--selected': isSelected(data.id),
            'MapHome__modular--wall': data.isWall,
            'MapHome__modular--can-select': checkModular(data.id),
          }"
          @click="setSlice(data.id)"
        >
          <div v-if="data.isWall" class="MapHome__modular-wall" />
        </div>
      </div>
      <div class="MapHome__footer">
        <div class="MapHome__text">
          Selected area: {{ selectedSlices.length }}
        </div>
        <div class="MapHome__text">Cost: {{ selectedSlices.length * 100 }}</div>

        <button type="button" class="MapHome__button-buy" @click="buyPieces">
          BUY
        </button>
      </div>
    </div>
  </div>
  <div class="MapHome__icon-container">
    <span class="MapHome__keyboard-button">M</span>
    <img
      src="/svg/map-slices.svg"
      class="MapHome__icon"
      @click="changeSizeMap"
    />
  </div>
</template>
<style lang="scss">
@import "map-home";
</style>
