<script setup lang="ts">
// import { Environment } from "@tresjs/cientos";
import { PCFSoftShadowMap, SRGBColorSpace, ACESFilmicToneMapping } from "three";
const { pane } = useTweakPane();
const { $gsap } = useNuxtApp();

const isActiveOrbitControl = ref(false);
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

let cameraX = ref(20);
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
//  $gsap.to(cameraX.value, { })
let cameraY = ref(20);
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

let cameraZ = ref(100);
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

const perspectiveCamera: Ref<TresObject | null> = ref(null);
watch(perspectiveCamera, () => {
  if (perspectiveCamera.value) {
    $gsap.to(perspectiveCamera.value.position, {
      x: -8,
      y: 7,
      z: 25,
      duration: 4,
      ease: "Power2.easeOut",
      onComplete() {
        isActiveOrbitControl.value = true;
      },
    });
    const { onLoop } = useRenderLoop();
    onLoop(({ _delta, elapsed }) => {
      cameraX.value = -8;
      cameraY.value = 7;
      cameraZ.value = 25;
    });
    $gsap.to(perspectiveCamera.value.rotation, {
      x: -0.17690704200258198,
      y: -0.4026382120174583,
      z: -0.06993854928506144,
      duration: 4.5,
      ease: "Power2.easeOut",
      onComplete() {
        isActiveOrbitControl.value = true;
      },
    });
  }
});
</script>

<template>
  <LoadingScreen />
  <TresCanvas
    clear-color="#DCD1B6"
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
      ref="perspectiveCamera"
    />
    <!-- <Suspense>
      <Environment files="hdrs/hdr2.hdr" :background="true" />
    </Suspense> -->
    <OrbitControls
      :enablePan="false"
      :minDistance="17"
      :maxDistance="30"
      :maxPolarAngle="Math.PI / 2"
      :enabled="isActiveOrbitControl"
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
      <HauseName />
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
