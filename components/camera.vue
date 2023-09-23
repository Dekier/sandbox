<script setup lang="ts">
import { useControls } from "@tresjs/leches";
const { $gsap } = useNuxtApp();

const isActiveOrbitControl = ref(false);

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
        cameraX.value = -8;
        cameraY.value = 7;
        cameraZ.value = 25;
      },
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
  <TresPerspectiveCamera
    :position="[cameraX, cameraY, cameraZ]"
    :fov="70"
    :aspect="1"
    :near="0.1"
    :far="100"
    ref="perspectiveCamera"
  />
  <OrbitControls
    :enablePan="false"
    :minDistance="17"
    :maxDistance="80"
    :maxPolarAngle="Math.PI / 2"
    :enabled="isActiveOrbitControl"
  />
</template>
