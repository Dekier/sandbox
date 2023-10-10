<script setup lang="ts">
import { useModelSettings } from "~/composables/useModel";
const { setModel } = useModelSettings();
const {
  scene: modelScene,
  nodes,
  animations,
} = await useGLTF("/models/baner.glb", {
  draco: true,
});
const { actions } = useAnimations(animations, modelScene);
actions.desk.play();
actions.desk2.play();

const model = nodes.desk;
setModel(model);
const modelDesk = nodes.desk2;
setModel(modelDesk);
</script>

<template>
  <primitive :object="model" />
  <primitive :object="modelDesk" />
</template>
