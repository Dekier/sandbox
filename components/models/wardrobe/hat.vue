<script setup lang="ts">
import { MeshBasicMaterial } from "three";
const { $gsap } = useNuxtApp();
import { useGLTF } from "@tresjs/cientos";
import { useCharacterStore } from "~/stores/character";
import { storeToRefs } from "pinia";
const characterStore = useCharacterStore();
const { positionCharacter, angle } = storeToRefs(characterStore);
const { nodes } = await useGLTF("/models/hat.glb", { draco: true });
const model = nodes.hat;
model.children[model.children.length - 1].material.dispose();
model.children[model.children.length - 1].material = new MeshBasicMaterial({
  color: 0x000000,
});
nodes.Scene.traverse((child: any) => {
  if (child.isMesh) {
    child.castShadow = true;
    child.receiveShadow = true;
  }
});
const { onLoop } = useRenderLoop();
onLoop(() => {
  if (model.position) {
    model.position.x = positionCharacter.value.x;
    model.position.z = positionCharacter.value.z;
    model.rotation.y = -angle.value;
  }
});
</script>

<template>
  <primitive :object="model" />
</template>
