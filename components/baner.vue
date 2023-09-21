<script setup lang="ts">
import { MeshBasicMaterial } from "three";
import { useLoader } from "@tresjs/core";
const {
  scene: modelScene,
  nodes,
  animations,
} = await useGLTF("/models/baner.glb", {
  draco: true,
});
const { actions, mixer } = useAnimations(animations, modelScene);
actions.desk.play();
actions.desk2.play();

const model = nodes.desk;
for (let index = 0; index < model.children.length; index++) {
  model.children[index].receiveShadow = true;
  model.children[index].castShadow = true;
}

const modelDesk = nodes.desk2;
for (let index = 0; index < modelDesk.children.length; index++) {
  modelDesk.children[index].receiveShadow = true;
  modelDesk.children[index].castShadow = true;
}
model.children[model.children.length - 1].material.dispose();

model.children[model.children.length - 1].material = new MeshBasicMaterial({
  color: 0x000000,
});
modelDesk.children[modelDesk.children.length - 1].material.dispose();

modelDesk.children[modelDesk.children.length - 1].material =
  new MeshBasicMaterial({
    color: 0x000000,
  });
</script>

<template>
  <primitive :object="model" />
  <primitive :object="modelDesk" />
</template>
