<script setup lang="ts">
import { MeshBasicMaterial, TextureLoader, MeshToonMaterial } from "three";
import { useGLTF } from "@tresjs/cientos";

const { nodes } = await useGLTF("/models/hause-bottom.glb", { draco: true });
const model = nodes.Cube005;
model.children[model.children.length - 1].material.dispose();

model.children[model.children.length - 1].material = new MeshBasicMaterial({
  color: 0x000000,
});

model.traverse((child: any) => {
  if (child.isMesh) {
    child.material.envMapIntensity = 0;
    child.receiveShadow = true;
    child.castShadow = true;
  }
});
</script>

<template>
  <primitive :object="model" />
</template>
