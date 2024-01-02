<script setup lang="ts">
import { TextureLoader, Vector2 } from "three";
const groundPositions = ref({ x: -200, z: 0 });
console.log("dskfjsd");

const loadedCanvas = ref(false);
const loader = new TextureLoader();
loader.load("/materials/grass/perlin.webp", (texture) => {
  setupCanvasDrawing(texture.source.data);
});
const drawingCanvas = document.getElementById("drawing-canvas-1");
const drawStartPos = new Vector2();
const drawingContext = drawingCanvas?.getContext("2d");
const setupCanvasDrawing = async (texture) => {
  drawingContext.fillStyle = "#FFFFFF";
  drawingContext.fillRect(0, 0, 200, 200);
  drawingContext.drawImage(texture, 0, 0, 200, 200);
  //   await drawDots(treeData.value, drawingContext);
  //   await drawDots(treeSecondData.value, drawingContext);
  loadedCanvas.value = true;
};
</script>

<template>
  <Suspense>
    <Ground
      :key="'sdfsdfds'"
      :positions="groundPositions"
      :drawing-canvas="drawingCanvas"
    />
  </Suspense>

  <Suspense>
    <ModelsFloraGrass
      v-if="loadedCanvas"
      :positions="groundPositions"
      :drawing-canvas="drawingCanvas"
    />
  </Suspense>
</template>
