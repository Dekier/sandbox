<script setup lang="ts">
const { newSetModel } = useModelSettings();
const {
  scene: modelScene,
  nodes,
  animations,
} = await useGLTF("/models/baner.glb", {
  draco: true,
});
const lol = useAnimations(animations, modelScene);
// actions.desk.play();
// actions.desk2.play();

const model = nodes.desk;
newSetModel(model);
const modelDesk = nodes.desk2;
newSetModel(modelDesk);
</script>

<template>
  <primitive :object="model" />
  <primitive :object="modelDesk" />
</template>
