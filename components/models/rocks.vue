<script setup lang="ts">
import { useGLTF } from "@tresjs/cientos";
import { useModelSettings } from "~/composables/useModel";
const { setModel } = useModelSettings();
const { nodes } = await useGLTF("/models/rocks.glb", { draco: true });
const model = nodes.rocks;
setModel(model);
</script>

<template>
  <primitive :object="model" />
</template>
