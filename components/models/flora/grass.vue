<script setup lang="ts">
import {
  Mesh,
  MeshStandardMaterial,
  TextureLoader,
  RepeatWrapping,
  Vector2,
  Vector3,
  PlaneGeometry,
  DoubleSide,
  ShaderMaterial,
  BufferGeometry,
  Matrix4,
  Object3D,
  InstancedMesh,
  Color,
  MeshDepthMaterial,
  RGBADepthPacking,
  UniformsLib,
  DynamicDrawUsage,
  CanvasTexture,
  Euler,
  MeshPhongMaterial,
  MeshDistanceMaterial,
  BoxGeometry,
  Quaternion,
  Fog,
} from "three";
const props = defineProps({
  positions: {
    type: Object,
    required: true,
  },
  drawingCanvas: {
    type: Object,
    required: true,
  },
});

import { useCanvas } from "~/composables/useCanvas";
const { calculatePixelPercentage, draw } = useCanvas();
import vertexShaderShadow from "@/src/shaders/shadow/vertex.glsl";
import fragmentShaderShadow from "@/src/shaders/shadow/fragment.glsl";
const storeGeneral = useGeneralStore();
const { color } = storeToRefs(storeGeneral);
const { scene, renderer, camera } = useTresContext();
const { onLoop, resume } = useRenderLoop();

const characterStore = useCharacterStore();
const { positionCharacter } = storeToRefs(characterStore);

import vertexShader from "@/src/shaders/vertex3.glsl";
import fragmentShader from "@/src/shaders/fragment3.glsl";
const loader = new TextureLoader();
const alphaMap = loader.load("/materials/grass/blade_alpha3.png");

const uniforms = {
  time: {
    value: 0,
  },
  uCharacterPosition: { value: new Vector3(0, 0, 0) },
  alphaMap: { value: alphaMap },
  hexColor: {
    value: new Vector3(
      new Color(color.value).r,
      new Color(color.value).g,
      new Color(color.value).b
    ),
  },
  fogColor: { value: new Color("#BEE1F7") },
  fogNear: { value: 130 },
  fogFar: { value: 150 },
  ...UniformsLib.lights,
};

const grassMaterial = new ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
  side: DoubleSide,
  lights: true,
});
const instanceNumber = 200000;
let dummy = new Object3D();
const geometry = new PlaneGeometry(0.1, 1, 1, 4);
geometry.translate(0, 0.5, 0);
let instancedMesh = new InstancedMesh(geometry, grassMaterial, instanceNumber);
instancedMesh.castShadow = false;
instancedMesh.receiveShadow = false;

const drawStartPos = new Vector2();
const drawingContext = props.drawingCanvas?.getContext("2d");

const setupCanvasDrawing = () => {
  let paint = false;
  props.drawingCanvas?.addEventListener("pointerdown", (e) => {
    paint = true;
    drawStartPos.set(e.offsetX, e.offsetY);
  });

  props.drawingCanvas?.addEventListener("pointermove", (e) => {
    if (paint) draw(drawingContext, e.offsetX, e.offsetY, drawStartPos);
  });

  props.drawingCanvas?.addEventListener("pointerup", () => {
    paint = false;
    setIntancesMesh();
  });

  setIntancesMesh();
};
let oldModel = null;
let oldPercentInstanceNumber = instanceNumber;

const setIntancesMesh = () => {
  const imageData = drawingContext.getImageData(0, 0, 200, 200);
  const pixels = imageData.data;
  const whitePercentage = calculatePixelPercentage(pixels, "#FFFFFF");
  const newPercentInstanceNumber = Math.round(
    instanceNumber * (whitePercentage / 100)
  );
  if (oldModel) {
    oldModel.geometry.dispose();
    oldModel.material.dispose();
    scene.value.remove(oldModel);

    dummy = new Object3D();
    instancedMesh = new InstancedMesh(
      geometry,
      grassMaterial,
      newPercentInstanceNumber
    );
  }

  const threshold = 0.3;
  const validPositions = [];
  for (let i = 0; i < pixels.length; i += 4) {
    const pixelValue = (pixels[i] / 255.0 - 0.5) * 2.0;

    if (pixelValue > threshold) {
      const x = (i / 4) % 200;
      const z = Math.floor(i / 4 / 200);
      validPositions.push({ x, z });
    }
  }
  for (let i = 0; i < newPercentInstanceNumber; i++) {
    const randomIndex = Math.floor(Math.random() * validPositions.length);
    const randomPosition = validPositions[randomIndex];
    dummy.position.set(
      randomPosition.x + Math.random() * 1.2 - 200 / 2 + props.positions.x,
      0,
      randomPosition.z - 200 / 2 + Math.random() * 1.2 + props.positions.z
    );

    dummy.scale.y = 0.6 + Math.random() * 0.7;
    dummy.scale.x = 8.0 + Math.random() * 0.4;
    dummy.scale.z = 8.0 + Math.random() * 0.4;
    dummy.rotation.y = Math.random() * 184;
    // dummy.rotation.x = (Math.random() - 0.3) * 1.0;
    // dummy.rotation.z = (Math.random() - 0.3) * 1.0;

    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);
  }
  oldModel = instancedMesh;
  scene.value.add(instancedMesh);
};

setupCanvasDrawing();
watch(color, (value) => {
  grassMaterial.uniforms.hexColor.value = new Vector3(
    new Color(value).r,
    new Color(value).g,
    new Color(value).b
  );
});

onLoop(({ _delta, elapsed }) => {
  grassMaterial.uniforms.time.value = elapsed;
  grassMaterial.uniformsNeedUpdate = true;
  if (positionCharacter.value) {
    grassMaterial.uniforms.uCharacterPosition.value = positionCharacter.value;
  }
});
</script>

<template></template>
