<script setup lang="ts">
import {
  TextureLoader,
  Vector3,
  PlaneGeometry,
  DoubleSide,
  ShaderMaterial,
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
  drawingCanvas: {
    type: Object,
    required: true,
  },
  isActiveUpdateCanvas: {
    type: Boolean,
    required: true,
  },
});

import { useCanvas } from "~/composables/useCanvas";
const { calculatePixelPercentage, draw } = useCanvas();
const characterStore = useCharacterStore();
const { positionCharacter, positionCharacterLookAt } =
  storeToRefs(characterStore);
const storeGeneral = useGeneralStore();
const { color, settingsGraphics } = storeToRefs(storeGeneral);
const { onLoop } = useRenderLoop();

import vertexShader from "@/src/shaders/vertex3.glsl";
import fragmentShader from "@/src/shaders/fragment3.glsl";
const loader = new TextureLoader();
const alphaMap = loader.load("/materials/grass/blade_alpha5.png");

const darkerFactor = 1.8;
const uniforms = {
  time: {
    value: 0,
  },
  uCharacterPosition: { value: new Vector3(0, 0, 0) },
  alphaMap: { value: alphaMap },
  alphaMapMoving: { value: null },
  hexColor: {
    value: new Vector3(
      new Color(color.value).r / darkerFactor,
      new Color(color.value).g / darkerFactor,
      new Color(color.value).b / darkerFactor
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

let instanceNumber = 150000;

const setGrassInstaceNumber = () => {
  switch (settingsGraphics.value) {
    case "Low":
      instanceNumber = 50000;
      break;

    case "Medium":
      instanceNumber = 100000;

      break;

    case "High":
      instanceNumber = 150000;

      break;

    default:
      break;
  }
};
setGrassInstaceNumber();

watch(settingsGraphics, () => {
  setGrassInstaceNumber();
  setPercentNumber();
  setMesh();
});

let dummy = new Object3D();
const geometry = new PlaneGeometry(0.1, 1, 1, 2);
geometry.translate(0, 0.5, 0);
const drawingContext = props.drawingCanvas?.getContext("2d");

const threshold = 0.3;
let validPositions = [];
let imageData = null;
let pixels = null;
let whitePercentage = null;
let newPercentInstanceNumber = 0 as number;
const setPercentNumber = () => {
  imageData = drawingContext.getImageData(0, 0, 200, 200);
  pixels = imageData.data;
  whitePercentage = calculatePixelPercentage(pixels, "#FFFFFF");
  newPercentInstanceNumber = Math.round(
    instanceNumber * (whitePercentage / 100)
  );
};

watch(color, (value) => {
  grassMaterial.uniforms.hexColor.value = new Vector3(
    new Color(value).r / darkerFactor,
    new Color(value).g / darkerFactor,
    new Color(value).b / darkerFactor
  );
});

watch(
  () => props.isActiveUpdateCanvas,
  (value) => {
    if (!value) {
      setPercentNumber();
      setMesh();
    }
  }
);

onLoop(({ _delta, elapsed }) => {
  grassMaterial.uniforms.time.value = elapsed;
  // grassMaterial.uniformsNeedUpdate = true;
  if (positionCharacter.value) {
    grassMaterial.uniforms.uCharacterPosition.value = positionCharacter.value;
  }
});
const instanceMeshGrassRef = shallowRef(null);

watch(instanceMeshGrassRef, (value) => {
  if (!value) return;
  setPercentNumber();
  setMesh();
});
const setMesh = () => {
  instanceMeshGrassRef.value.instanceMatrix.setUsage(DynamicDrawUsage);
  instanceMeshGrassRef.value.count = newPercentInstanceNumber;
  validPositions = [];
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
      randomPosition.x + Math.random() * 1.2 - 200 / 2,
      0,
      randomPosition.z - 200 / 2 + Math.random() * 1.2
    );

    dummy.scale.y = 0.6 + Math.random() * 0.7;
    dummy.scale.x = 8.0 + Math.random() * 0.4;
    dummy.scale.z = 8.0 + Math.random() * 0.4;
    dummy.rotation.y = Math.random() * 184;

    dummy.updateMatrix();
    instanceMeshGrassRef.value.setMatrixAt(i, dummy.matrix);
  }
  instanceMeshGrassRef.value.instanceMatrix.needsUpdate = true;
  instanceMeshGrassRef.value.computeBoundingSphere();
};
</script>

<template>
  <TresInstancedMesh
    ref="instanceMeshGrassRef"
    :args="[geometry, grassMaterial, instanceNumber]"
  />
</template>
