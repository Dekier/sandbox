<script setup lang="ts">
import { DirectionalLight, DirectionalLightHelper, CameraHelper } from "three";
import { useControls } from "@tresjs/leches";
import { useHudStore } from "~/stores/hud";
import { storeToRefs } from "pinia";
const hudStore = useHudStore();
const { isActiveShadows, shadowSize, lightX, lightY, lightZ } =
  storeToRefs(hudStore);

const { scene, camera } = useTresContext();
const { isMobile } = useDevice();

var directionalLight = new DirectionalLight(0xffffff, 2);
directionalLight.position.set(lightX.value, lightY.value, lightZ.value);
directionalLight.rotation.set(-0.8, -1.7, -0.7);
directionalLight.intensity = 1.5;
directionalLight.castShadow = true;
directionalLight.shadow.bias = -0.002;
directionalLight.shadow.mapSize.width = isMobile ? 1024 : 4096;
directionalLight.shadow.mapSize.height = isMobile ? 1024 : 4096;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 90;
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;
scene.value.add(directionalLight);

watch(isActiveShadows, (value) => {
  directionalLight.castShadow = value;
});

watch(shadowSize, (value) => {
  directionalLight.shadow.mapSize.set(value, value);
  directionalLight.shadow.map.setSize(value, value);
});

if (directionalLight) {
  // const helper = new DirectionalLightHelper(directionalLight, 5);
  // scene.value.add(helper);
  // const helperShadow = new CameraHelper(directionalLight.shadow.camera);
  // scene.value.add(helperShadow);

  watch(lightX, (value) => {
    directionalLight.position.x = value;
  });

  watch(lightY, (value) => {
    directionalLight.position.y = value;
  });

  watch(lightZ, (value) => {
    directionalLight.position.z = value;
  });

  // const { value: light_Y } = useControls({
  //   light_Y: {
  //     value: directionalLight.position.y,
  //     min: 15,
  //     max: 65,
  //   },
  // });
  // watch(light_Y, (value) => {
  //   directionalLight.position.y = value;
  // });

  // const { value: light_Z } = useControls({
  //   light_Z: {
  //     value: directionalLight.position.z,
  //     min: -25,
  //     max: 30,
  //   },
  // });
  // watch(light_Z, (value) => {
  //   directionalLight.position.z = value;
  // });
}
const tresDirectionalLight: Ref<TresObject | null> = ref(null);
</script>

<template>
  <TresDirectionalLight
    :intensity="0.2"
    :position="[2, 4, 8]"
    ref="TresDirectionalLight"
  />
  <TresHemisphereLight :intensity="1" />
</template>
