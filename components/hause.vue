<script setup lang="ts">
import {
  MeshBasicMaterial,
  Mesh,
  PlaneGeometry,
  MeshStandardMaterial,
} from "three";
import { useGLTF } from "@tresjs/cientos";
const { scene } = useTresContext();
const { nodes } = await useGLTF("/models/hause.glb", { draco: true });
const model = nodes.glass001;
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

watchEffect(() => {
  if (scene.value) {
    console.log(scene.value);
  }
});
</script>

<template>
  <primitive :object="model" />
</template>
