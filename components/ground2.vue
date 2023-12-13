<script setup lang="ts">
import { TextureLoader, RepeatWrapping, Color, PlaneGeometry } from "three";

const storeGeneral = useGeneralStore();
// const characterStore = useCharacterStore();
const { color, colorBackground } = storeToRefs(storeGeneral);

const loader = new TextureLoader();
const alphaMap = loader.load("/materials/grass/blade_alpha2.webp");
const rough = loader.load("/materials/grass/rough.webp");
rough.wrapS = RepeatWrapping;
rough.wrapT = RepeatWrapping;
rough.repeat.x = 35;
rough.repeat.y = 35;

const newColor = ref(new Color(colorBackground.value));
watch(colorBackground, (value) => {
  newColor.value = new Color(value);
});
const planeRef = ref();
watch(planeRef, (value) => {
  console.log(planeRef.value);
});

const geometry = new PlaneGeometry(163, 163, 1, 1);
// geometry.translate(0, 0.5, 0);
geometry.position.set(1, 0, 1);
</script>

<template>
  <!-- <Plane ref="planeRef" :args="[163, 163]" :position="[1, 0, 1]" receive-shadow> -->
  <!-- <TresMeshLambertMaterial :color="newColor" :map="rough" :roughness="1" /> -->
  <!-- <CustomShaderMaterial v-bind="materialProps" /> -->
  <!-- </Plane> -->
</template>
<style lang="scss">
// #drawing-canvas {
//   position: absolute;
//   background-color: #000000;
//   top: 20px;
//   left: 0px;
//   right: 0px;
//   margin: 0 auto;
//   z-index: 2;
//   opacity: 1;
//   cursor: crosshair;
//   touch-action: none;
//   width: 160px;
//   height: 160px;
// }
</style>
