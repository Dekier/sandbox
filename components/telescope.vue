<script setup lang="ts">
import { useGLTF } from "@tresjs/cientos";
import { useModelSettings } from "~/composables/useModel";
const { setModel } = useModelSettings();

const {
  scene: modelScene,
  nodes,
  animations,
} = await useGLTF("/models/telescope.glb", {
  draco: true,
});
const { actions } = useAnimations(animations, modelScene);
let currentTelescopeAction = actions.telescopeAction;
let currentTelescopeMiddleAction = actions.telescopeMiddleAction;

currentTelescopeAction.play();
currentTelescopeMiddleAction.play();
const model = nodes.telescope;
setModel(model);

const modelBottom = nodes.telescopeBottom;
setModel(modelBottom);

const modelMiddle = nodes.telescopeMiddle;
setModel(modelMiddle);
</script>

<template>
  <primitive :object="model" />
  <primitive :object="modelMiddle" />
  <primitive :object="modelBottom" />
</template>
