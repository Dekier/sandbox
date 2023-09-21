<script setup lang="ts">
import { MeshBasicMaterial, TextureLoader } from "three";
import { useGLTF } from "@tresjs/cientos";

const { nodes } = await useGLTF("/models/hause-bottom.glb", { draco: true });
const model = nodes.Cube005;
model.children[model.children.length - 1].material.dispose();
console.log(nodes);

model.children[model.children.length - 1].material = new MeshBasicMaterial({
  color: 0x000000,
});

// const textureLoader = new TextureLoader();
// const lightmap = ref(null);
// lightmap.value = textureLoader.load("/lightmaps/lightmap-bottom.webp");
// lightmap.value.flipY = false;

model.traverse((child: any) => {
  if (child.isMesh) {
    child.material.envMapIntensity = 0;
    child.receiveShadow = true;
    child.castShadow = true;
    // // child.material.lightMap = lightmap.value;
    // child.material.lightMapIntensity = 1;
  }
});
</script>

<template>
  <primitive :object="model" />
</template>
