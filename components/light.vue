<script setup lang="ts">
import { DirectionalLight, DirectionalLightHelper, CameraHelper } from "three";
import { useLoader } from "@tresjs/core";
const { pane } = useTweakPane();

const { scene, camera } = useTresContext();
var directionalLight = new DirectionalLight(0xffffff, 2);
directionalLight.position.set(-26, 21, 13);
directionalLight.rotation.set(-0.8, -1.7, -0.7);
directionalLight.intensity = 1;
directionalLight.castShadow = true;
directionalLight.shadow.bias = -0.002;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 80;
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;
scene.value.add(directionalLight);
// pane
//   .addBlade({
//     view: "slider",
//     label: "directionalLight: bias",
//     min: -10,
//     max: 10,
//     steps: 0.001,
//     value: directionalLight.shadow.bias,
//   })
//   .on("change", (ev) => {
//     directionalLight.shadow.bias = ev.value;
//   });

pane
  .addBlade({
    view: "list",
    label: "Shadow size:",
    options: [
      { text: "512", value: 512 },
      { text: "1024", value: 1024 },
      { text: "2048", value: 2048 },
      { text: "4096", value: 4096 },
      { text: "8192", value: 8192 },
      { text: "16384", value: 16384 },
    ],
    value: directionalLight.shadow.mapSize.width,
  })
  .on("change", (ev) => {
    directionalLight.shadow.mapSize.set(ev.value, ev.value);
    directionalLight.shadow.map.setSize(ev.value, ev.value);
  });

if (directionalLight) {
  // const helper = new DirectionalLightHelper(directionalLight, 5);
  // scene.value.add(helper);

  // const helperShadow = new CameraHelper(directionalLight.shadow.camera);
  // scene.value.add(helperShadow);
  pane
    .addBlade({
      view: "slider",
      label: "directionalLight: x",
      min: -25,
      max: 32,
      value: directionalLight.position.x,
    })
    .on("change", (ev) => {
      directionalLight.position.x = ev.value;
    });

  pane
    .addBlade({
      view: "slider",
      label: "directionalLight: y",
      min: 15,
      max: 65,
      value: directionalLight.position.y,
    })
    .on("change", (ev) => {
      directionalLight.position.y = ev.value;
    });

  pane
    .addBlade({
      view: "slider",
      label: "directionalLight: z",
      min: -25,
      max: 13,
      value: directionalLight.position.z,
    })
    .on("change", (ev) => {
      directionalLight.position.z = ev.value;
    });
}
const tresDirectionalLight: Ref<TresObject | null> = ref(null);
</script>

<template>
  <TresDirectionalLight
    :intensity="0.5"
    :position="[2, 4, 8]"
    ref="TresDirectionalLight"
  />
  <TresHemisphereLight :intensity="0.6" />
</template>
