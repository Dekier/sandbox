<script setup lang="ts">
import { MeshBasicMaterial } from "three";
const {
  scene: modelScene,
  nodes,
  animations,
} = await useGLTF("/models/tree.glb", {
  draco: true,
});
const { actions, mixer } = useAnimations(animations, modelScene);
// actions.lantern.play();
// actions.lantern2.play();

const model = nodes.Vert001;
for (let index = 0; index < model.children.length; index++) {
  model.children[index].receiveShadow = true;
  model.children[index].castShadow = true;
}

// model.children[model.children.length - 1].material.dispose();

// model.children[model.children.length - 1].material = new MeshBasicMaterial({
//   color: 0x000000,
// });
</script>

<template>
  <primitive :object="model" />
</template>
