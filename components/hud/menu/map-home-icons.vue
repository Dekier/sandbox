<script setup lang="ts">
const storeModularGround = useModularGroundStore();
const {
  groundOneSideList,
  groundCornerList,
  groundTwoSideList,
  groundThreeSideList,
  groundZeroList,
} = storeToRefs(storeModularGround);

const floraStore = useFloraStore();
const { treeList, treeSecondList } = storeToRefs(floraStore);
const characterStore = useCharacterStore();
const { characterPosition, characterAngle } = storeToRefs(characterStore);

const rotationOnePiece = (side: string) => {
  switch (side) {
    case "top":
      return "rotate(90deg)";
    case "right":
      return "rotate(180deg)";

    case "bottom":
      return "rotate(-90deg)";

    default:
      return "rotate(0deg)";
  }
};
const rotationCornerPiece = (side: string) => {
  switch (side) {
    case "top-right":
      return "rotate(-90deg)";
    case "bottom-left":
      return "rotate(90deg)";

    case "top-left":
      return "rotate(180deg)";

    default:
      return "rotate(0deg)";
  }
};

const rotationTwoPiece = (side: string) => {
  switch (side) {
    case "left-right":
      return "rotate(-90deg)";

    default:
      return "rotate(0deg)";
  }
};

const rotationThreePiece = (side: string) => {
  switch (side) {
    case "left":
      return "rotate(90deg)";

    case "right":
      return "rotate(-90deg)";

    case "top":
      return "rotate(-180deg)";

    default:
      return "rotate(0deg)";
  }
};
</script>

<template>
  <img
    class="MapHomeIcons__user-position-icon"
    src="/svg/cursor.svg"
    :style="{
      transform: `translate(calc(-50% + ${
        characterPosition.x * 3
      }px), calc(-50% + ${characterPosition.z * 3}px)) rotate(${
        characterAngle + 1.5
      }rad)`,
    }"
  />
  <img
    v-for="data in treeList"
    :key="data.id"
    class="MapHomeIcons__tree-icon"
    src="/svg/tree.svg"
    :style="{
      transform: `translate(calc(-50% + ${data.positionX * 3}px), calc(-50% + ${
        data.positionZ * 3 - 8
      }px))`,
    }"
  />
  <img
    v-for="data in treeSecondList"
    :key="data.id"
    class="MapHomeIcons__tree-icon"
    src="/svg/tree.svg"
    :style="{
      transform: `translate(calc(-50% + ${data.positionX * 3}px), calc(-50% + ${
        data.positionZ * 3 - 8
      }px))`,
    }"
  />
  <div
    v-for="data in groundOneSideList"
    :key="data.id"
    class="MapHomeIcons__module-one-side"
    :style="{
      transform: `translate(calc(-50% + ${data.positionX * 3}px), calc(-50% + ${
        data.positionZ * 3
      }px)) ${rotationOnePiece(data.side)}`,
    }"
  />

  <div
    v-for="data in groundCornerList"
    :key="data.id"
    class="MapHomeIcons__module-corner"
    :style="{
      transform: `translate(calc(-50% + ${data.positionX * 3}px), calc(-50% + ${
        data.positionZ * 3
      }px)) ${rotationCornerPiece(data.side)}`,
    }"
  />
  <div
    v-for="data in groundTwoSideList"
    :key="data.id"
    class="MapHomeIcons__module-two-side"
    :style="{
      transform: `translate(calc(-50% + ${data.positionX * 3}px), calc(-50% + ${
        data.positionZ * 3
      }px)) ${rotationTwoPiece(data.side)}`,
    }"
  />
  <div
    v-for="data in groundThreeSideList"
    :key="data.id"
    class="MapHomeIcons__module-three-side"
    :style="{
      transform: `translate(calc(-50% + ${data.positionX * 3}px), calc(-50% + ${
        data.positionZ * 3
      }px)) ${rotationThreePiece(data.side)}`,
    }"
  />
  <div
    v-for="data in groundZeroList"
    :key="data.id"
    class="MapHomeIcons__module-zero"
    :style="{
      transform: `translate(calc(-50% + ${data.positionX * 3}px), calc(-50% + ${
        data.positionZ * 3
      }px)) ${rotationThreePiece(data.side)}`,
    }"
  />
</template>
<style lang="scss">
@import "map-home-icons";
</style>
