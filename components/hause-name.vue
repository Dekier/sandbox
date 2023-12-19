<script setup lang="ts">
import { MeshBasicMaterial } from "three";
import { useGLTF } from "@tresjs/cientos";
const { newSetModel } = useModelSettings();

const { nodes } = await useGLTF("/models/hause-name.glb", { draco: true });
const model = nodes.name;

newSetModel(model);
// model.position.y = model.position.y + 1.5;
// for (let index = 0; index < model.children.length; index++) {
//   model.children[index].receiveShadow = true;
//   model.children[index].castShadow = true;
// }
</script>

<template>
  <primitive :object="model" />
</template>
