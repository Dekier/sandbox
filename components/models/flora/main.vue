<script setup lang="ts">
import { TextureLoader, Vector2 } from "three";
const { drawDots } = useCanvas();
const characterStore = useCharacterStore();
const { positionCharacter } = storeToRefs(characterStore);
const floraStore = useFloraStore();
const { treeData, treeSecondData, bushData } = storeToRefs(floraStore);

const loadedCanvas = ref(false);
const loader = new TextureLoader();
loader.load("/materials/grass/perlin.webp", (texture) => {
  setupCanvasDrawing(texture.source.data);
});
const drawingCanvas = document.getElementById("drawing-canvas");
const drawStartPos = new Vector2();
const drawingContext = drawingCanvas?.getContext("2d");
const setupCanvasDrawing = async (texture) => {
  drawingContext.fillStyle = "#FFFFFF";
  drawingContext.fillRect(0, 0, 200, 200);
  drawingContext.drawImage(texture, 0, 0, 200, 200);
  await drawDots(treeData.value, drawingContext);
  await drawDots(treeSecondData.value, drawingContext);
  loadedCanvas.value = true;
};

const groundPositions = ref({ x: 0, z: 0 });
</script>

<template>
  <Suspense>
    <Ground
      v-if="loadedCanvas"
      :positions="groundPositions"
      :drawing-canvas="drawingCanvas"
    />
  </Suspense>
  <Suspense>
    <ModelsFloraGrass
      v-if="loadedCanvas"
      :drawing-canvas="drawingCanvas"
      :positions="groundPositions"
    />
  </Suspense>
  <Suspense>
    <ModelsFloraTree v-if="loadedCanvas" :trees-data="treeData" />
  </Suspense>
  <Suspense>
    <ModelsFloraTreeSecond :trees-data="treeSecondData" />
  </Suspense>
  <Suspense>
    <ModelsFloraBush v-if="loadedCanvas" :bush-data="bushData" />
  </Suspense>
  <Suspense>
    <ModelsFloraSmallLeaves />
  </Suspense>
  <Suspense>
    <ModelsFloraFern v-if="loadedCanvas" />
  </Suspense>
  <!-- <Suspense>
    <ModelsFloraBushStick v-if="positionCharacter" />
  </Suspense> -->
</template>
