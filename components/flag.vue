<script setup lang="ts">
import {
  AnimationMixer,
  MeshStandardMaterial,
  TextureLoader,
  AnimationClip,
} from "three";
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
console.log(actions);
actions.KeyAction.play();

for (let index = 0; index < model.children.length; index++) {
  model.children[index].receiveShadow = true;
  model.children[index].castShadow = true;
}
</script>

<template>
  <primitive :object="model" />
</template>
