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
  Matrix4,
  Object3D,
  InstancedMesh,
  Color,
  UniformsLib,
  DynamicDrawUsage,
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

const { calculatePixelPercentage, draw } = useCanvas();
const storeGeneral = useGeneralStore();
const { color, settingsFlora } = storeToRefs(storeGeneral);
const { scene, renderer, camera } = useTresContext();
const { onLoop, resume } = useRenderLoop();

const characterStore = useCharacterStore();
const { positionCharacter } = storeToRefs(characterStore);

import vertexShader from "@/src/shaders/flowers/vertex.glsl";
import fragmentShader from "@/src/shaders/flowers/fragment.glsl";
const loader = new TextureLoader();
const alphaMap = loader.load("/materials/flowers/alpha3.webp");

const darkerFactor = 1.6;
const uniforms = {
  time: {
    value: 0,
  },
  uCharacterPosition: { value: new Vector3(0, 0, 0) },
  alphaMap: { value: alphaMap },
  hexColor: {
    value: new Vector3(
      new Color(color.value).r / darkerFactor,
      new Color(color.value).g / darkerFactor,
      new Color(color.value).b / darkerFactor
    ),
  },
  ...UniformsLib.lights,
};

const leavesMaterial = new ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
  side: DoubleSide,
  lights: true,
});
let instanceNumber = 600;

const setSmallLeavesInstaceNumber = () => {
  switch (settingsFlora.value) {
    case "Very Low":
      instanceNumber = 50;

      break;
    case "Low":
      instanceNumber = 250;
      break;

    case "Medium":
      instanceNumber = 500;

      break;

    case "High":
      instanceNumber = 1000;

      break;

    case "Ultra":
      instanceNumber = 1500;

      break;

    default:
      break;
  }
};
setSmallLeavesInstaceNumber();
watch(settingsFlora, () => {
  setSmallLeavesInstaceNumber();
  setPercentNumber();
  setMesh();
});

let dummy = new Object3D();
const geometry = new PlaneGeometry(0.2, 0.8, 1, 2);
geometry.translate(0, 0.5, 0);

const threshold = 0.3;
let validPositions = [];
let imageData = null;
let pixels = null;
let whitePercentage = null;
let newPercentInstanceNumber = 0;
const drawingContext = props.drawingCanvas?.getContext("2d");
const setPercentNumber = () => {
  imageData = drawingContext.getImageData(0, 0, 200, 200);
  pixels = imageData.data;
  whitePercentage = calculatePixelPercentage(pixels, "#FFFFFF");
  newPercentInstanceNumber = Math.round(
    instanceNumber * (whitePercentage / 100)
  );
};

watch(color, (value) => {
  leavesMaterial.uniforms.hexColor.value = new Vector3(
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
  leavesMaterial.uniforms.time.value = elapsed;
  leavesMaterial.uniformsNeedUpdate = true;
  if (positionCharacter.value) {
    leavesMaterial.uniforms.uCharacterPosition.value = positionCharacter.value;
  }
});

const instanceMeshSmallLeavesRef = shallowRef(null);
watch(instanceMeshSmallLeavesRef, (value) => {
  if (!value) return;

  setPercentNumber();
  setMesh();
});

const setMesh = () => {
  instanceMeshSmallLeavesRef.value.instanceMatrix.setUsage(DynamicDrawUsage);
  instanceMeshSmallLeavesRef.value.count = newPercentInstanceNumber;
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

    dummy.scale.y = 1.5 + Math.random() * 0.7;
    dummy.scale.x = 1.5 + Math.random() * 0.4;
    dummy.scale.z = 1.5 + Math.random() * 0.4;
    dummy.rotation.y = Math.random() * 184;

    dummy.updateMatrix();
    instanceMeshSmallLeavesRef.value.setMatrixAt(i, dummy.matrix);
  }
  instanceMeshSmallLeavesRef.value.instanceMatrix.needsUpdate = true;
  instanceMeshSmallLeavesRef.value.computeBoundingSphere();
};
</script>

<template>
  <TresInstancedMesh
    ref="instanceMeshSmallLeavesRef"
    :args="[geometry, leavesMaterial, instanceNumber]"
  />
</template>
