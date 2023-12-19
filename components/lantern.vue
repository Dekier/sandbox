<script setup lang="ts">
import { useModelSettings } from "~/composables/useModel";
const { newSetModel } = useModelSettings();
const {
  scene: modelScene,
  nodes,
  animations,
} = await useGLTF("/models/lantern.glb", {
  draco: true,
});
const { actions } = useAnimations(animations, modelScene);
actions.lantern.play();
actions.lantern2.play();

const model = nodes.lantern;
const modellantern = nodes.lantern2;

newSetModel(model);
newSetModel(modellantern);
</script>

<template>
  <primitive :object="model" />
  <primitive :object="modellantern" />
</template>
