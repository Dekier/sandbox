<script setup lang="ts">
import { MeshBasicMaterial } from "three";
const {
  scene: modelScene,
  nodes,
  animations,
} = await useGLTF("/models/lantern.glb", {
  draco: true,
});
const { actions, mixer } = useAnimations(animations, modelScene);
actions.lantern.play();
actions.lantern2.play();

const model = nodes.lantern;
for (let index = 0; index < model.children.length; index++) {
  model.children[index].receiveShadow = true;
  model.children[index].castShadow = true;
}

const modellantern = nodes.lantern2;
for (let index = 0; index < modellantern.children.length; index++) {
  modellantern.children[index].receiveShadow = true;
  modellantern.children[index].castShadow = true;
}
model.children[model.children.length - 1].material.dispose();

model.children[model.children.length - 1].material = new MeshBasicMaterial({
  color: 0x000000,
});
modellantern.children[modellantern.children.length - 1].material.dispose();

modellantern.children[modellantern.children.length - 1].material =
  new MeshBasicMaterial({
    color: 0x000000,
  });
</script>

<template>
  <primitive :object="model" />
  <primitive :object="modellantern" />
</template>
