<script setup lang="ts">
const { nodes } = await useGLTF("/models/hause.glb", { draco: true });
const { newSetModel } = useModelSettings();

const model = nodes.test002;
newSetModel(model);
// model.position.y = -1.5;
</script>

<template>
  <primitive :object="model" />
</template>
