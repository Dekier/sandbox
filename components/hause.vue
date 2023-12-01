<script setup lang="ts">
import { useGLTF } from "@tresjs/cientos";
const { nodes } = await useGLTF("/models/hause.glb", { draco: true });

import { useModelSettings } from "~/composables/useModel";
const { setModel } = useModelSettings();
const model = nodes.test001;
// model.position.y = -1.5;
setModel(model);
</script>

<template>
  <primitive :object="model" />
</template>
