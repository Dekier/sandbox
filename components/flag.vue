<script setup lang="ts">
import { useLoader } from "@tresjs/core";
const {
  scene: modelScene,
  nodes,
  animations,
} = await useGLTF("/models/flag.glb", {
  draco: true,
});
const model = nodes.Plane028;
const { actions, mixer } = useAnimations(animations, modelScene);
actions.KeyAction.play();

for (let index = 0; index < model.children.length; index++) {
  model.children[index].receiveShadow = true;
  model.children[index].castShadow = true;
}
</script>

<template>
  <primitive :object="model" />
</template>
