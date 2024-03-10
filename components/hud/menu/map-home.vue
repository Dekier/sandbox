<script setup lang="ts">
const storeModularGround = useModularGroundStore();
const {
  groundIds,
  groundDataList,
  activeModularList,
  groundOneSideList,
  groundCornerList,
  groundTwoSideList,
  groundThreeSideList,
} = storeToRefs(storeModularGround);
const characterStore = useCharacterStore();
const { characterPosition, characterModel } = storeToRefs(characterStore);
const storeHud = useHudStore();

const changeSizeMap = () => {
  menuInGameStore.setTabType(tabType.value === "island" ? "" : "island");
};

const selectedSlices = ref([]);

const setSlice = (id: number) => {
  if (!checkModular(id)) return;
  if (selectedSlices.value.length) {
    const selectedIndex = selectedSlices.value.findIndex(
      (data) => !data.isActive && data.id === id
    );
    if (selectedIndex !== -1) {
      selectedSlices.value.splice(selectedIndex, 1);
    } else {
      const data = groundDataList.value.find(
        (data) => !data.isActive && data.id === id
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
    (data) => !data.isActive && data.id === id
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
  if (selectedSlices.value.length) {
    storeModularGround.updatePieces(selectedSlices.value);
    selectedSlices.value = [];
  }
};

const checkModular = (id: number) => {
  const list = activeModularList.value.concat(selectedSlices.value);
  const element = list.find((data) => data.id === id);
  const isLeftActive = list.find((data) => data.id === id - 1);
  const isRightActive = list.find((data) => data.id === id + 1);

  const isTopActive = list.find((data) => data.id === id - 15);
  const isBottomActive = list.find((data) => data.id === id + 15);
  if (!element?.isActive) {
    return isLeftActive || isRightActive || isTopActive || isBottomActive;
  }
};

let isDragging = false;
// let startX, startY, offsetX, offsetY;

const dragElement = ref(null);
const listOfModulars = ref(null);

watch(dragElement, () => {
  // dragElement.value.addEventListener("mousedown", (e) => {
  //   if (e.srcElement.offsetParent.classList) {
  //     if (
  //       !e.srcElement.offsetParent.classList.contains(
  //         "MapHome__modular--can-select"
  //       ) &&
  //       !e.target.classList.contains("MapHome__modular--can-select")
  //     ) {
  //       isDragging = true;
  //       startX = e.clientX + 23;
  //       startY = e.clientY;
  //       offsetX = listOfModulars.value.offsetLeft;
  //       offsetY = listOfModulars.value.offsetTop;
  //     }
  //   }
  // });
  // document.addEventListener("mousemove", (e) => {
  //   if (isDragging) {
  //     const x = e.clientX - startX + offsetX;
  //     const y = e.clientY - startY + offsetY;
  //     listOfModulars.value.style.left = `${x}px`;
  //     listOfModulars.value.style.top = `${y}px`;
  //   }
  // });
  // document.addEventListener("mouseup", () => {
  //   if (isDragging) {
  //     isDragging = false;
  //   }
  // });
});
const scale = ref(1.0);
// const mapScalePlus = () => {
//   if (scale.value < 1.4) {
//     scale.value += 0.2;
//     listOfModulars.value.style.transform = `translate(-50%, -50%) scale(${scale.value})`;
//   }
// };

// const mapScaleMinus = () => {
//   if (scale.value > 0.8) {
//     scale.value -= 0.2;
//     listOfModulars.value.style.transform = `translate(-50%, -50%) scale(${scale.value})`;
//   }
// };

const checkIsActive = (id: number) => {
  return activeModularList.value.findIndex((data) => data.id === id) !== -1;
};
</script>

<template>
  <div class="MapHome__main-container">
    <div class="MapHome__center-box">
      <div ref="dragElement" class="MapHome__map-container">
        <!-- <div class="MapHome__button-container">
          <button type="button" class="MapHome__button" @click="mapScalePlus()">
            +
          </button>
          <button
            type="button"
            class="MapHome__button"
            @click="mapScaleMinus()"
          >
            -
          </button>
        </div> -->

        <!-- <img class="MapHome__background" src="/image/map/paper.jpg" /> -->

        <div ref="listOfModulars" class="MapHome__list-of-modulars">
          <img
            src="/image/backgrounds/background-big.png"
            class="MapHome__background"
          />
          <HudMenuMapHomeIcons />
          <div
            v-for="data in groundIds"
            :key="data"
            class="MapHome__modular"
            :class="{
              'MapHome__modular--purchased-module': checkIsActive(data),
              'MapHome__modular--selected': isSelected(data),
              'MapHome__modular--can-select': checkModular(data),
            }"
            @click="setSlice(data)"
          >
            <div
              v-if="!checkIsActive(data)"
              class="MapHome__modular-hover-icon"
            />
            <img
              v-if="!checkIsActive(data)"
              class="MapHome__modular-sea-icon"
              src="/svg/waves.svg"
            />
          </div>
        </div>
      </div>

      <div class="MapHome__footer">
        <button type="button" class="MapHome__button-buy" @click="buyPieces">
          Unlock pieces
        </button>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
@import "map-home";
</style>
