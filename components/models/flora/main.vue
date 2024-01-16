<script setup lang="ts">
const { drawDots, drawRects } = useCanvas();
const characterStore = useCharacterStore();
const { positionCharacter } = storeToRefs(characterStore);
const floraStore = useFloraStore();
const { treeData, treeSecondData, bushData, bushStickData } =
  storeToRefs(floraStore);
const storeModularGround = useModularGroundStore();
const { activeModularList } = storeToRefs(storeModularGround);
const isActiveUpdateCanvas = ref(false);

const loadedCanvas = ref(false);

const drawingCanvas = document.getElementById("drawing-canvas");
const drawingContext = drawingCanvas?.getContext("2d");
const setupCanvasDrawing = async () => {
  drawingContext.fillStyle = "#000000";
  drawingContext.fillRect(0, 0, 200, 200);
  // drawingContext.drawImage(texture, 0, 0, 200, 200);
  await drawRects(activeModularList.value, drawingContext);
  // await drawDots(treeData.value, drawingContext, "#000000");
  // await drawDots(treeSecondData.value, drawingContext, "#000000");
  loadedCanvas.value = true;
};
setupCanvasDrawing();
watch(activeModularList, async () => {
  isActiveUpdateCanvas.value = true;
  await drawRects(activeModularList.value, drawingContext);
  // await drawDots(treeData.value, drawingContext, "#000000");
  // await drawDots(treeSecondData.value, drawingContext, "#000000");
  isActiveUpdateCanvas.value = false;
});

const groundPositions = ref({ x: 0, z: 0 });
</script>

<template>
  <!-- <Suspense>
    <Ground
      v-if="loadedCanvas"
      :positions="groundPositions"
      :drawing-canvas="drawingCanvas"
    />
  </Suspense> -->
  <Suspense>
    <ModelsFloraModularGround
      v-if="loadedCanvas"
      :drawing-canvas="drawingCanvas"
      :is-active-update-canvas="isActiveUpdateCanvas"
    />
  </Suspense>
  <!-- <Suspense>
    <Seaa />
  </Suspense> -->
  <Suspense>
    <ModelsFloraSea />
  </Suspense>
  <Suspense>
    <ModelsFloraGrass
      v-if="loadedCanvas"
      :drawing-canvas="drawingCanvas"
      :positions="groundPositions"
      :is-active-update-canvas="isActiveUpdateCanvas"
    />
  </Suspense>
  <Suspense>
    <ModelsFloraSmallLeaves
      v-if="loadedCanvas"
      :drawing-canvas="drawingCanvas"
      :is-active-update-canvas="isActiveUpdateCanvas"
    />
  </Suspense>
  <!-- <Suspense>
    <ModelsFloraNewGrass
      v-if="loadedCanvas"
      :drawing-canvas="drawingCanvas"
      :positions="groundPositions"
      :is-active-update-canvas="isActiveUpdateCanvas"
    />
  </Suspense> -->
  <!-- <Suspense>
    <ModelsFloraTree v-if="loadedCanvas" :trees-data="treeData" />
  </Suspense>
  <Suspense>
    <ModelsFloraTreeSecond :trees-data="treeSecondData" />
  </Suspense>
  <Suspense>
    <ModelsFloraBush v-if="loadedCanvas" :bush-data="bushData" />
  </Suspense>
  <Suspense>
    <ModelsFloraFern
      v-if="loadedCanvas"
      :drawing-canvas="drawingCanvas"
      :is-active-update-canvas="isActiveUpdateCanvas"
    />
  </Suspense>
  <Suspense>
    <ModelsFloraBushStick
      v-if="positionCharacter"
      :bush-stick-data="bushStickData"
    />
  </Suspense> -->
</template>
