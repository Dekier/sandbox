<script setup lang="ts">
import { MeshLambertMaterial, Color } from "three";
import { useGLTF } from "@tresjs/cientos";
const { nodes } = await useGLTF("/models/hause.glb", { draco: true });
const { newSetModel } = useModelSettings();

import { useModelSettings } from "~/composables/useModel";
const { setModel } = useModelSettings();
const model = nodes.test002;
newSetModel(model);
// model.position.y = -1.5;
</script>

<template>
  <primitive :object="model" />
</template>
