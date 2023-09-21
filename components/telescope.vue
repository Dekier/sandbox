<script setup lang="ts">
import { MeshBasicMaterial, AnimationMixer } from "three";
import { useGLTF } from "@tresjs/cientos";

const {
  scene: modelScene,
  nodes,
  animations,
} = await useGLTF("/models/telescope.glb", {
  draco: true,
});
const { actions, mixer } = useAnimations(animations, modelScene);
let currentTelescopeAction = actions.telescopeAction;
let currentTelescopeMiddleAction = actions.telescopeMiddleAction;

currentTelescopeAction.play();
currentTelescopeMiddleAction.play();
const model = nodes.telescope;
model.children[model.children.length - 1].material.dispose();

model.children[model.children.length - 1].material = new MeshBasicMaterial({
  color: 0x000000,
});

for (let index = 0; index < model.children.length; index++) {
  model.children[index].material.envMapIntensity = 0;
  model.children[index].receiveShadow = true;
  model.children[index].castShadow = true;
}

const modelBottom = nodes.telescopeBottom;
modelBottom.children[modelBottom.children.length - 1].material.dispose();

modelBottom.children[modelBottom.children.length - 1].material =
  new MeshBasicMaterial({
    color: 0x000000,
  });

for (let index = 0; index < modelBottom.children.length; index++) {
  modelBottom.children[index].material.envMapIntensity = 0;
  modelBottom.children[index].receiveShadow = true;
  modelBottom.children[index].castShadow = true;
}

const modelMiddle = nodes.telescopeMiddle;
modelMiddle.children[modelMiddle.children.length - 1].material.dispose();

modelMiddle.children[modelMiddle.children.length - 1].material =
  new MeshBasicMaterial({
    color: 0x000000,
  });

for (let index = 0; index < modelMiddle.children.length; index++) {
  modelMiddle.children[index].material.envMapIntensity = 0;
  modelMiddle.children[index].receiveShadow = true;
  modelMiddle.children[index].castShadow = true;
}
</script>

<template>
  <primitive :object="model" />
  <primitive :object="modelMiddle" />
  <primitive :object="modelBottom" />
</template>
