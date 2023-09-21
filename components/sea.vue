<script setup lang="ts">
import { Vector2, Color, ShaderMaterial } from "three";
import vertexShader from "@/src/shaders/vertex.glsl";
import fragmentShader from "@/src/shaders/fragment.glsl";

const modelSea: Ref<TresObject | null> = ref(null);
const seaMaterial = ref();
let uniforms = {
  uTime: { value: 0 },

  uBigWavesElevation: { value: 0.26 },
  uBigWavesFrequency: { value: new Vector2(0.4, 0.1) },
  uBigWavesSpeed: { value: 0.75 },

  uSmallWavesElevation: { value: 0.15 },
  uSmallWavesFrequency: { value: 10 },
  uSmallWavesSpeed: { value: 0.6 },
  uSmallIterations: { value: 10 },

  uDepthColor: { value: new Color("#89cbf5") },
  uSurfaceColor: { value: new Color("#9bd8ff") },
  uColorOffset: { value: 0.09 },
  uColorMultiplier: { value: 5 },
};

// pane
//   .addBlade({
//     view: "slider",
//     label: "uBigWavesElevation",
//     min: 0,
//     max: 2,
//     value: uniforms.uBigWavesElevation.value,
//   })
//   .on("change", (ev) => {
//     uniforms.uBigWavesElevation.value = ev.value;
//   });

// pane
//   .addBlade({
//     view: "slider",
//     label: "uBigWavesSpeed",
//     min: 0,
//     max: 4,
//     value: uniforms.uBigWavesSpeed.value,
//   })
//   .on("change", (ev) => {
//     uniforms.uBigWavesSpeed.value = ev.value;
//   });

// pane
//   .addBlade({
//     view: "slider",
//     label: "uSmallWavesElevation",
//     min: 0,
//     max: 4,
//     value: uniforms.uSmallWavesElevation.value,
//   })
//   .on("change", (ev) => {
//     uniforms.uSmallWavesElevation.value = ev.value;
//   });

// pane
//   .addBlade({
//     view: "slider",
//     label: "uSmallWavesFrequency",
//     min: 0,
//     max: 40,
//     value: uniforms.uSmallWavesFrequency.value,
//   })
//   .on("change", (ev) => {
//     uniforms.uSmallWavesFrequency.value = ev.value;
//   });

// pane
//   .addBlade({
//     view: "slider",
//     label: "uSmallWavesSpeed",
//     min: 0,
//     max: 4,
//     value: uniforms.uSmallWavesSpeed.value,
//   })
//   .on("change", (ev) => {
//     uniforms.uSmallWavesSpeed.value = ev.value;
//   });

// pane
//   .addBlade({
//     view: "slider",
//     label: "uSmallIterations",
//     min: 0,
//     max: 40,
//     value: uniforms.uSmallIterations.value,
//   })
//   .on("change", (ev) => {
//     uniforms.uSmallIterations.value = ev.value;
//   });
const { onLoop, resume } = useRenderLoop();
resume();
onLoop(({ _delta, elapsed }) => {
  if (seaMaterial.value) {
    seaMaterial.value.uniforms.uTime.value = elapsed;
  }
});
watch(modelSea, (model) => {
  const shaderMaterial = new ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: uniforms,
  });
  model?.value.traverse((child: any) => {
    if (child.isMesh) {
      child.material = shaderMaterial;
      seaMaterial.value = child.material;
    }
  });
});
</script>

<template>
  <GLTFModel path="/models/sea.glb" ref="modelSea" :position-y="0" />
</template>
