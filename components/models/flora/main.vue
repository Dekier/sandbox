<script setup lang="ts">
const { drawDots, drawRects } = useCanvas();
const characterStore = useCharacterStore();
const downloadedModels = useDownloadedModels();
const { positionCharacter } = storeToRefs(characterStore);
const floraStore = useFloraStore();
const storeModularGround = useModularGroundStore();
const { activeModularList } = storeToRefs(storeModularGround);
const { fernList, bushList, treeList, bushStickList, treeSecondList } =
  storeToRefs(floraStore);
storeModularGround.setRandomModular();

const isActiveUpdateCanvas = ref(false);

const loadedCanvas = ref(false);

const drawingCanvas = document.getElementById("drawing-canvas");
const drawingContext = drawingCanvas?.getContext("2d");
const setupCanvasDrawing = async () => {
  drawingContext.fillStyle = "#000000";
  drawingContext.fillRect(0, 0, 200, 200);
  // drawingContext.drawImage(texture, 0, 0, 200, 200);
  await drawRects(activeModularList.value, drawingContext);
  await drawDots(treeList.value, drawingContext, "#000000");
  await drawDots(treeSecondList.value, drawingContext, "#000000");
  loadedCanvas.value = true;
};
setupCanvasDrawing();
watch(activeModularList, async () => {
  isActiveUpdateCanvas.value = true;
  await drawRects(activeModularList.value, drawingContext);
  await drawDots(treeList.value, drawingContext, "#000000");
  await drawDots(treeSecondList.value, drawingContext, "#000000");
  isActiveUpdateCanvas.value = false;
});

const groundPositions = ref({ x: 0, z: 0 });

floraStore.setFloraLists(activeModularList.value);
const { nodes } = await useGLTF("/models/smallSticks.glb", {
  draco: true,
});
downloadedModels.setSmallStick(nodes);
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
    <ModelsFloraModularGround v-if="loadedCanvas" />
  </Suspense>
  <!-- <Suspense>
    <TestLol />
  </Suspense> -->

  <!-- <Suspense>
    <ModelsFloraGrass
      v-if="loadedCanvas"
      :drawing-canvas="drawingCanvas"
      :is-active-update-canvas="isActiveUpdateCanvas"
    />
  </Suspense> -->
  <Suspense>
    <ModelsFloraGrass
      v-if="loadedCanvas"
      :drawing-canvas="drawingCanvas"
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
  <Suspense>
    <ModelsFloraTree v-if="treeList.length" :tree-list="treeList" />
  </Suspense>
  <Suspense>
    <ModelsFloraTreeSecond
      v-if="treeSecondList.length"
      :tree-list="treeSecondList"
    />
  </Suspense>
  <Suspense>
    <ModelsFloraBush v-if="bushList.length" :bush-list="bushList" />
  </Suspense>
  <Suspense>
    <ModelsFloraFern v-if="fernList.length" :fern-list="fernList" />
  </Suspense>
  <Suspense>
    <ModelsFloraBushStick
      v-if="bushStickList.length"
      :bush-stick-list="bushStickList"
    />
  </Suspense>
</template>
