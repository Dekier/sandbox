<script setup lang="ts">
import {
  MeshBasicMaterial,
  Mesh,
  PlaneGeometry,
  TextureLoader,
  RepeatWrapping,
  Vector2,
  NearestFilter,
  WebGLRenderTarget,
  Vector3,
  Color,
  UniformsLib,
  ShaderMaterial,
  CanvasTexture,
  MeshLambertMaterial,
  Texture,
  MeshDepthMaterial,
  RGBADepthPacking,
  MeshStandardMaterial,
} from "three";
import { Precipitation } from "@tresjs/cientos";
const characterStore = useCharacterStore();
const { positionCharacter } = storeToRefs(characterStore);
import vertexShader from "@/src/shaders/snow/vertex.glsl";
import fragmentShader from "@/src/shaders/snow/fragment.glsl";
const storeGeneral = useGeneralStore();
const { draw } = useCanvas();
const { color } = storeToRefs(storeGeneral);
const { scene, renderer, camera } = useTresContext();

const loader = new TextureLoader();
const drawingCanvas = document.getElementById("drawing-canvas-snow");
const drawStartPos = new Vector2();
const drawingContext = drawingCanvas?.getContext("2d");

drawingContext.fillStyle = "#FFFFFF";
drawingContext.fillRect(0, 0, 320, 320);
const colorMap = loader.load("/materials/snow/color.webp");
colorMap.wrapS = RepeatWrapping;
colorMap.wrapT = RepeatWrapping;
colorMap.repeat.x = 35;
colorMap.repeat.y = 35;
const geometry = new PlaneGeometry(160, 160, 500, 500);
// const snowMaterial = new MeshLambertMaterial({
//   map: colorMap,
//   color: 0xb8b8b8,
//   wireframe: false,
// });
const uniforms = {
  time: {
    value: 0,
  },
  alphaMap: { value: null },
  colorMap: { value: colorMap },
  uCharacterPosition: { value: new Vector3(0, 0, 0) },
  hexColor: {
    value: new Color(0xa3a3a3),
  },
  ...UniformsLib.lights,
};
const snowMaterial = new ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
  lights: true,
});
const groundModel = new Mesh(geometry, snowMaterial);
groundModel.rotation.x = -Math.PI / 2;
groundModel.position.y = 0;
groundModel.castShadow = true;
groundModel.receiveShadow = true;

scene.value.add(groundModel);

drawingContext.lineWidth = 2;
drawingContext.lineCap = "round";
drawingContext.imageSmoothingEnabled = true;
setTimeout(() => {
  drawingContext.fillStyle = "#FFFFFF";
  drawingContext.fillRect(0, 0, 320, 320);
}, 100);
watchEffect(() => {
  if (positionCharacter.value && drawingCanvas) {
    const canvasX =
      ((positionCharacter.value.x + 160 / 2) / 160) * drawingCanvas.width;
    const canvasY =
      ((positionCharacter.value.z + 160 / 2) / 160) * drawingCanvas.height;

    drawingContext.beginPath();
    drawingContext.moveTo(drawStartPos.x, drawStartPos.y);
    drawingContext.lineTo(canvasX, canvasY);
    drawingContext.stroke();
    drawStartPos.set(canvasX, canvasY);
    const newTexture = new CanvasTexture(drawingCanvas);
    snowMaterial.uniforms.alphaMap.value = newTexture;
    snowMaterial.displacementMap = newTexture;
    snowMaterial.displacementScale = 1.0;
  }
});
const { onLoop } = useRenderLoop();
onLoop(({ _delta, elapsed }) => {
  snowMaterial.uniforms.time.value = elapsed;
});
const { newSetModel } = useModelSettings();
const { nodes } = await useGLTF("/models/snow.glb", { draco: true });
const model = nodes.SnowBall001;
model.material?.dispose();
model.material = new MeshStandardMaterial({
  color: 0xd1d1d1,
  wireframe: false,
});
model.castShadow = true;
model.receiveShadow = true;

const snowflakeMap = loader.load("/materials/snow/snowflake.png");
</script>

<template>
  <primitive :object="model" />
  <Precipitation
    :map="snowflakeMap"
    :position="[0, 30, 0]"
    :area="[160, 60, 160]"
    :count="3000"
    :speed="0.8"
    :size="1"
  />
</template>
