<script setup lang="ts">
// import {
//   BloomEffect,
//   DotScreenEffect,
//   EffectComposer,
//   EffectPass,
//   GlitchEffect,
//   RenderPass,
//   ShaderPass,
//   SMAAEffect,
//   ChromaticAberrationEffect,
//   SMAAPreset,
// } from "postprocessing";
import { EffectComposer, Bloom, Pixelation } from "@tresjs/post-processing";
import { Color } from "three";
// import { useWindowSize } from "@vueuse/core";
// import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
// import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass.js";
// const { width, height } = useWindowSize();
// let effectComposer;
// let activePass;
// const { renderer, scene, camera } = useTresContext();
// // pane
// //   .addBlade({
// //     view: "list",
// //     label: "Effects",
// //     options: [
// //       { text: "DotScreen", value: DotScreenEffect },
// //       { text: "Bloom", value: BloomEffect },
// //       { text: "Glitch", value: GlitchEffect },

// //       { text: "ChromaticAberrationEffect", value: ChromaticAberrationEffect },
// //       { text: "None", value: null },
// //     ],
// //     value: null,
// //   })
// //   .on("change", (ev) => {
// //     effectComposer?.removePass(activePass);

// //     activePass = new EffectPass(camera.value, new ev.value());
// //     effectComposer?.addPass(activePass);
// //   });

// const { value: shadowSizeValue } = useControls({
//   post: {
//     value: null,
//     options: [
//       { text: "DotScreen", value: DotScreenEffect },
//       { text: "Bloom", value: BloomEffect },
//       { text: "Glitch", value: GlitchEffect },

//       { text: "ChromaticAberrationEffect", value: ChromaticAberrationEffect },
//       { text: "None", value: null },
//     ],
//   },
// });
// watch(shadowSizeValue, (value) => {
//   effectComposer?.removePass(activePass);

//   activePass = new EffectPass(camera.value, new SMAAEffect());
//   effectComposer?.addPass(activePass);
// });
// // effectComposer?.removePass(activePass);
// // activePass = new EffectPass(camera.value, new BloomEffect());
// // effectComposer?.addPass(activePass);

// const context = ref(null);

// const { onLoop } = useRenderLoop();

// watchEffect(() => {
//   if (renderer.value) {
//     renderer.value.setSize(width.value, height.value);
//     renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//     effectComposer = new EffectComposer(renderer.value);
//     effectComposer.addPass(new RenderPass(scene.value, camera.value));
//     if (renderer.value.getPixelRatio() === 1) {
//       const smaaPass = new SMAAPass();
//       effectComposer.addPass(smaaPass);
//     }

//     onLoop(() => {
//       effectComposer.render();
//     });
//   }
// });
</script>

<template>
  <!-- <EffectComposer :depth-buffer="true">
    <Bloom
      :radius="4.85"
      :intensity="1.0"
      :luminance-threshold="0.1"
      :luminance-smoothing="0.0"
      mipmap-blur
    />
  </EffectComposer> -->
  <EffectComposer>
    <Pixelation :granularity="3" />
  </EffectComposer>
</template>
