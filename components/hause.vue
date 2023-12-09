<script setup lang="ts">
import { MeshLambertMaterial, Color } from "three";
import { useGLTF } from "@tresjs/cientos";
const { nodes } = await useGLTF("/models/hause.glb", { draco: true });

import { useModelSettings } from "~/composables/useModel";
const { setModel } = useModelSettings();
const model = nodes.test002;
model.traverse((child: any) => {
  if (child.isMesh) {
    child.castShadow = true;
    child.receiveShadow = true;
    const color = child.material.color;
    child.material.dispose();
    child.material = new MeshLambertMaterial({
      color: new Color(color.r, color.g, color.b),
    });
  }
});
// model.position.y = -1.5;
</script>

<template>
  <primitive :object="model" />
</template>
