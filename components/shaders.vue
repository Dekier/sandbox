<script setup lang="ts">
import { useModelSettings } from "~/composables/useModel";
const { setModel } = useModelSettings();
const characterStore = useCharacterStore();
import {
  Vector2,
  Color,
  ShaderMaterial,
  WebGLRenderTarget,
  NearestFilter,
  UnsignedShortType,
  DepthTexture,
  MeshDepthMaterial,
  RGBADepthPacking,
  NoBlending,
  TextureLoader,
  RepeatWrapping,
  UniformsUtils,
  UniformsLib,
  ClampToEdgeWrapping,
  GLSL3,
} from "three";
const { camera, renderer, scene } = useTresContext();

const { nodes } = await useGLTF("/models/suzanne.glb", { draco: false });

const model = nodes.Suzanne;

import vertexShader from "@/src/shaders/vertex.glsl";
import fragmentShader from "@/src/shaders/fragment.glsl";

var params = {
  foamColor: 0xffffff,
  waterColor: 0x0069c2,
  threshold: 0.1,
};

const pixelRatio = renderer.value.getPixelRatio();

let uniforms = {
  // time: {
  //   value: 0,
  // },
  specMap: {
    value: "#D6C9AC",
  },
};

const waterMaterial = new ShaderMaterial({
  uniforms,
  // vertexShader: vertexShader,
  fragmentShader: fragmentShader,
});

// waterMaterial.uniforms.cameraNear.value = 0.1;
// waterMaterial.uniforms.cameraFar.value = 10000;
// waterMaterial.uniforms.resolution.value.set(
//   window.innerWidth * pixelRatio,
//   window.innerHeight * pixelRatio
// );

model.material?.dispose();
model.material = waterMaterial;

const { onLoop, resume } = useRenderLoop();
resume();
onLoop(({ _delta, elapsed }) => {});
</script>

<template>
  <KeyboardControls>
    <primitive :object="model" />
  </KeyboardControls>
</template>
