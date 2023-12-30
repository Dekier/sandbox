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
  drawingContext.fillRect(0, 0, 160, 160);
  drawingContext.drawImage(texture, 0, 0, 160, 160);
  await drawDots(treeData.value, drawingContext);
  await drawDots(treeSecondData.value, drawingContext);
  loadedCanvas.value = true;
};
</script>

<template>
  <Suspense>
    <ModelsFloraTree
      v-if="positionCharacter && loadedCanvas"
      :trees-data="treeData"
    />
  </Suspense>
  <Suspense>
    <ModelsFloraTreeSecond
      v-if="positionCharacter"
      :trees-data="treeSecondData"
    />
  </Suspense>
  <Suspense>
    <ModelsFloraBush
      v-if="positionCharacter && loadedCanvas"
      :bush-data="bushData"
    />
  </Suspense>
  <Suspense>
    <ModelsFloraSmallLeaves v-if="positionCharacter" />
  </Suspense>
  <Suspense>
    <ModelsFloraFern v-if="positionCharacter && loadedCanvas" />
  </Suspense>
  <!-- <Suspense>
      <ModelsFloraBushStick v-if="positionCharacter" />
    </Suspense> -->
</template>
