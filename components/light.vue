<script setup lang="ts">
import {
  DirectionalLight,
  DirectionalLightHelper,
  CameraHelper,
  Vector3,
} from "three";
import { Lensflare } from "@tresjs/cientos";

const hudStore = useHudStore();
const { isActiveShadows, shadowSize, lightX, lightY, lightZ } =
  storeToRefs(hudStore);

const storeControl = useControlsStore();
const { isMovingCharacter } = storeToRefs(storeControl);
const characterStore = useCharacterStore();
const { scene, camera } = useTresContext();
const { isMobile } = useDevice();

// const cameraShadowSize = ref({ left: -60, right: 60, top: 30, bottom: -10 });
const directionalLight = new DirectionalLight(0xffffff, 2.5);
// directionalLight.position.set(lightX.value, lightY.value, lightZ.value);
directionalLight.position.set(-100, 55, 100);
// directionalLight.rotation.set(-0.8, 100.7, 100.7);
directionalLight.castShadow = true;
directionalLight.shadow.bias = -0.002;
// directionalLight.shadow.radius = 2;
directionalLight.shadow.mapSize.width = isMobile ? 1024 : 4048;
directionalLight.shadow.mapSize.height = isMobile ? 1024 : 4048;
directionalLight.shadow.camera.near = 0.0;
directionalLight.shadow.camera.far = 255;
// directionalLight.target = characterModel.value;
// directionalLight.lookAt = new Vector3(0, 0, 0);
// directionalLight.lookAt = positionCharacter.value;
scene.value.add(directionalLight);

// watch(isActiveShadows, (value) => {
//   directionalLight.castShadow = value;
// });

// watch(shadowSize, (value) => {
//   directionalLight.shadow.mapSize.set(value, value);
//   directionalLight.shadow.map.setSize(value, value);
// });
const setShadowCameraSize = ({
  left,
  right,
  top,
  bottom,
}: {
  left: number;
  right: number;
  top: number;
  bottom: number;
}) => {
  directionalLight.shadow.camera.left = left;
  directionalLight.shadow.camera.right = right;
  directionalLight.shadow.camera.top = top;
  directionalLight.shadow.camera.bottom = bottom;
  directionalLight.shadow.needsUpdate = true;
  directionalLight.shadow.camera.updateProjectionMatrix();
  // if (helperShadow) {
  //   helperShadow.update();
  // }
};
if (directionalLight) {
  // const helper = new DirectionalLightHelper(directionalLight, 5);
  // scene.value.add(helper);
  // let helperShadow = new CameraHelper(directionalLight.shadow.camera);
  // scene.value.add(helperShadow);

  setShadowCameraSize({ left: -110, right: 110, top: 52, bottom: -45 });
}
const { onLoop } = useRenderLoop();
onLoop(({ _delta, elapsed }) => {
  // if (isMovingCharacter.value) {
  //   pinCameraToCharacter();
  //   if (
  //     positionCharacter.value.x > 25 &&
  //     directionalLight.shadow.camera.left === -60
  //   ) {
  //     setShadowCameraSize({ left: -120, right: 60, top: 30, bottom: -10 });
  //   }
  //   if (
  //     positionCharacter.value.x < 25 &&
  //     directionalLight.shadow.camera.left === -120
  //   ) {
  //     setShadowCameraSize({ left: -60, right: 60, top: 30, bottom: -10 });
  //   }
  //   if (
  //     positionCharacter.value.x < -15 &&
  //     directionalLight.shadow.camera.left === -60
  //   ) {
  //     directionalLight.shadow.camera.far = 120;
  //     setShadowCameraSize({ left: -30, right: 60, top: 30, bottom: -10 });
  //   }
  //   if (
  //     positionCharacter.value.x > -15 &&
  //     directionalLight.shadow.camera.left === -30
  //   ) {
  //     directionalLight.shadow.camera.far = 90;
  //     setShadowCameraSize({ left: -60, right: 60, top: 30, bottom: -10 });
  //   }
  // }
});
</script>

<template>
  <TresDirectionalLight
    :intensity="0.8"
    :position="[20, -20, -20]"
    ref="TresDirectionalLight"
  />
  <TresHemisphereLight
    :intensity="1.5"
    :color="0xffffff"
    :ground-color="0xffffff"
  />
</template>
