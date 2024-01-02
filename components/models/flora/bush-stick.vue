<script setup lang="ts">
import {
  TextureLoader,
  ShaderMaterial,
  Vector3,
  Color,
  UniformsLib,
  DoubleSide,
  MeshLambertMaterial,
} from "three";
import { useGLTF } from "@tresjs/cientos";
const storeGeneral = useGeneralStore();
const controlsStore = useControlsStore();
const { isMovingCharacter } = storeToRefs(controlsStore);
const { $gsap } = useNuxtApp();
const { colorTrees } = storeToRefs(storeGeneral);
const { bendModel, calculateDistance } = useUtils();

const {
  scene: modelScene,
  nodes,
  animations,
} = await useGLTF("/models/bush-stick.glb", { draco: true });
const { actions } = useAnimations(animations, modelScene);
console.log(nodes);
console.log(animations);
actions.stick.play();
const modelLeaves = nodes.leavesStick;
const modelWood = nodes.woodStick;
modelWood.castShadow = true;
modelWood.receiveShadow = true;

const loader = new TextureLoader();
const alphaMap = loader.load("/materials/leaves/leaves.png");

const bushMaterial = new MeshLambertMaterial({
  color: new Color(colorTrees.value),
  alphaMap: alphaMap,
  alphaTest: 0.3,
  side: DoubleSide,
});

modelLeaves.material?.dispose();
modelLeaves.material = bushMaterial;

modelLeaves.castShadow = true;
modelLeaves.receiveShadow = true;

watch(colorTrees, (value) => {
  modelLeaves.material.color = new Color(value);
});
// setModel(model);
const { onLoop } = useRenderLoop();
const prevPositions: Ref<Record<string, { x: number; z: number }>> = ref({});
onLoop(() => {
  if (isMovingCharacter.value) {
    const currentDistance = calculateDistance(modelWood.position);
    if (currentDistance < 6) {
      const { x, z } = bendModel(modelWood.position);
      $gsap.to(modelWood.rotation, {
        duration: 0.5,
        x,
        z,
        ease: "power4.easeOut",
      });

      $gsap.to(modelLeaves.rotation, {
        duration: 0.5,
        x,
        z,
        ease: "power4.easeOut",
      });
    }
  }
});
</script>

<template>
  <primitive :object="modelLeaves" />
  <primitive :object="modelWood" />
</template>
