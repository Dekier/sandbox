<script setup lang="ts">
// import { Environment } from "@tresjs/cientos";
import { PCFSoftShadowMap, SRGBColorSpace, ACESFilmicToneMapping } from "three";
const { pane } = useTweakPane();

// pane.addBlade({
//   view: "fpsgraph",
//   label: "fps",
// });

const gl = {
  shadows: true,
  physicallyCorrectLights: true,
  outputColorSpace: SRGBColorSpace,
  toneMapping: ACESFilmicToneMapping,
  toneMappingExposure: 3,
  shadowMap: { enabled: true, type: PCFSoftShadowMap },
};

const cameraX = ref(-6);
// pane
//   .addBlade({
//     view: "slider",
//     label: "camera: x",
//     min: -50,
//     max: 50,
//     steps: 1,
//     value: cameraX.value,
//   })
//   .on("change", (ev) => {
//     cameraX.value = ev.value;
//   });

const cameraY = ref(9);
// pane
//   .addBlade({
//     view: "slider",
//     label: "camera: y",
//     min: -50,
//     max: 50,
//     steps: 1,
//     value: cameraY.value,
//   })
//   .on("change", (ev) => {
//     cameraY.value = ev.value;
//   });

const cameraZ = ref(20);
// pane
//   .addBlade({
//     view: "slider",
//     label: "camera: z",
//     min: -50,
//     max: 50,
//     steps: 1,
//     value: cameraZ.value,
//   })
//   .on("change", (ev) => {
//     cameraZ.value = ev.value;
//   });
const { onLoop } = useRenderLoop();
</script>

<template>
  <TresCanvas
    clear-color="#dbccb4"
    window-size
    preset="realistic"
    ref="renderer"
    v-bind="gl"
    antialias
  >
    <TresPerspectiveCamera
      :position="[cameraX, cameraY, cameraZ]"
      :rotation="[-0.24415, -0.284478, -0.069803]"
      :fov="70"
      :aspect="1"
      :near="0.1"
      :far="100"
    />
    <!-- <Suspense>
      <Environment files="hdrs/hdr2.hdr" :background="true" />
    </Suspense> -->
    <OrbitControls
      :enablePan="false"
      :minDistance="17"
      :maxDistance="30"
      :maxPolarAngle="Math.PI / 2"
    />
    <Suspense>
      <Flag />
    </Suspense>
    <Suspense>
      <Hause />
    </Suspense>
    <Suspense>
      <HauseBottom />
    </Suspense>
    <Suspense>
      <HauseBoxes />
    </Suspense>
    <Suspense>
      <Telescope />
    </Suspense>
    <Suspense>
      <Ground />
    </Suspense>
    <Suspense>
      <Baner />
    </Suspense>
    <Suspense>
      <Lantern />
    </Suspense>
    <Light />
    <!-- <PostProcessing /> -->
  </TresCanvas>
</template>
