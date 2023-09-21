<script setup lang="ts">
import {
  BloomEffect,
  DotScreenEffect,
  EffectComposer,
  EffectPass,
  GlitchEffect,
  RenderPass,
  ShaderPass,
  ChromaticAberrationEffect,
} from "postprocessing";
import { useWindowSize } from "@vueuse/core";
let effectComposer;
let activePass;
const { pane } = useTweakPane();
const { renderer, scene, camera } = useTresContext();

// pane
//   .addBlade({
//     view: "list",
//     label: "Effects",
//     options: [
//       { text: "DotScreen", value: DotScreenEffect },
//       { text: "Bloom", value: BloomEffect },
//       { text: "Glitch", value: GlitchEffect },

//       { text: "ChromaticAberrationEffect", value: ChromaticAberrationEffect },
//       { text: "None", value: null },
//     ],
//     value: null,
//   })
//   .on("change", (ev) => {
//     effectComposer?.removePass(activePass);

//     activePass = new EffectPass(camera.value, new ev.value());
//     effectComposer?.addPass(activePass);
//   });
effectComposer?.removePass(activePass);
activePass = new EffectPass(camera.value, new BloomEffect());
effectComposer?.addPass(activePass);

const context = ref(null);

const { onLoop } = useRenderLoop();

const { width, height } = useWindowSize();

watchEffect(() => {
  if (renderer.value) {
    renderer.value.setSize(width.value, height.value);
    renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    effectComposer = new EffectComposer(renderer.value);
    effectComposer.addPass(new RenderPass(scene.value, camera.value));

    onLoop(() => {
      effectComposer.render();
    });
  }
});
</script>

<template></template>
