<script setup lang="ts">
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";
import { HalfFloatType } from "three";
const { renderer, scene, camera } = useTresContext();
import { useModelSettings } from "~/composables/useModel";
import { useGLTF } from "@tresjs/cientos";
import { useControls } from "~/composables/useControls";
const { changeModelRotation } = useControls();
const { nodes } = await useGLTF("/models/head.glb", { draco: true });
const model = nodes.head1;
model.traverse((child: any) => {
  if (child.isMesh) {
    child.castShadow = true;
    child.receiveShadow = true;
  }
});

const { onLoop } = useRenderLoop();

const modelEmission = nodes.emission1;
modelEmission.traverse((child: any) => {
  if (child.isMesh) {
    child.castShadow = true;
    child.receiveShadow = true;
  }
});
</script>

<template>
  <primitive :object="model" />
  <primitive :object="modelEmission" />
</template>
