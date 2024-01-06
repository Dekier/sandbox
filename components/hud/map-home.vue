<script setup lang="ts">
const storeModularGround = useModularGroundStore();
const { groundDataList } = storeToRefs(storeModularGround);
const storeHud = useHudStore();
const { isActiveFullSizeMap } = storeToRefs(storeHud);

document.body.addEventListener("keydown", (e) => {
  const key = e.code.replace("Key", "").toLowerCase();
  if (key === "m") {
    storeHud.setIsActiveFullSizeMap(!isActiveFullSizeMap.value);
  }
});

const changeSizeMap = () => {
  storeHud.setIsActiveFullSizeMap(!isActiveFullSizeMap.value);
};

const selectedSlices = ref([]);

const setSlice = (index: number) => {
  selectedSlices.value.push(groundDataList.value[index]);
};

const isSelected = (id: number) => {
  if (selectedSlices.value.length) {
    return selectedSlices.value.find((data) => data.id == id);
  }
  return false;
};
</script>

<template>
  <div v-if="isActiveFullSizeMap" class="MapHome__main-container">
    <div class="MapHome__list-of-modulars">
      <div
        v-for="(data, index) in groundDataList"
        :key="data.id"
        class="MapHome__modular"
        :class="{
          'MapHome__modular--purchased-module': data.isActive,
          'MapHome__modular--selected': isSelected(data.id),
        }"
        @click="setSlice(index)"
      ></div>
    </div>
  </div>
  <div>
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
