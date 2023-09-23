<script setup lang="ts">
import { MeshBasicMaterial } from "three";
import { useGLTF } from "@tresjs/cientos";
const { nodes } = await useGLTF("/models/hause.glb", { draco: true });
const model = nodes.test001;
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
</script>

<template>
  <primitive :object="model" />
</template>
