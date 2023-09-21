<script setup lang="ts">
import { MeshBasicMaterial } from "three";
import { useGLTF } from "@tresjs/cientos";

const { nodes } = await useGLTF("/models/hause-boxes.glb", { draco: true });
const model = nodes.Cube012;
model.children[model.children.length - 1].material.dispose();

model.children[model.children.length - 1].material = new MeshBasicMaterial({
  color: 0x000000,
});

for (let index = 0; index < model.children.length; index++) {
  model.children[index].material.envMapIntensity = 0;
  model.children[index].receiveShadow = true;
  model.children[index].castShadow = true;
}
</script>

<template>
  <primitive :object="model" />
</template>
