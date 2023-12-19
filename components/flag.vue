<script setup lang="ts">
const { newSetModel } = useModelSettings();
import { useLoader } from "@tresjs/core";
import { ShaderMaterial, DoubleSide, Vector2 } from "three";
import vertexShader from "@/src/shaders/flag/vertex.glsl";
import fragmentShader from "@/src/shaders/flag/fragment.glsl";
const { nodes } = await useGLTF("/models/flag.glb", {
  draco: true,
});
const model = nodes.flag;
newSetModel(model);

const uniforms = {
  time: {
    value: 0,
  },
  resolution: { value: new Vector2() },
};

const flagMaterial = new ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
  side: DoubleSide,
});
model.material = flagMaterial;
const { onLoop } = useRenderLoop();
onLoop(({ _delta, elapsed }) => {
  flagMaterial.uniforms.time.value += 0.05;
});
</script>

<template>
  <primitive :object="model" />
</template>
