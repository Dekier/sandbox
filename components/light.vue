<script setup lang="ts">
import {
  DirectionalLight,
  DirectionalLightHelper,
  CameraHelper,
  Vector3,
} from "three";
import { Lensflare } from "@tresjs/cientos";
const storeGeneral = useGeneralStore();
const { settingsShadow } = storeToRefs(storeGeneral);

const storeControl = useControlsStore();
const { isMovingCharacter } = storeToRefs(storeControl);
const characterStore = useCharacterStore();
const { scene, camera } = useTresContext();
// const { isMobile } = useDevice();

const directionalLight = new DirectionalLight(0xffffff, 3.0);

directionalLight.position.set(0, 100, 100);
directionalLight.castShadow = true;
directionalLight.shadow.bias = -0.001;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 225;
directionalLight.shadow.bias = -0.002;

scene.value.add(directionalLight);

const setShadpwMapSize = () => {
  directionalLight.shadow.map = null;
  directionalLight.shadow.mapSize.width = settingsShadow.value;
  directionalLight.shadow.mapSize.height = settingsShadow.value;
};
setShadpwMapSize();
watch(settingsShadow, () => {
  setShadpwMapSize();
});

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
  // let helperShadow = new CameraHelper(directionalLight.shadow.camera);
  // scene.value.add(helperShadow);
  // if (helperShadow) {
  //   helperShadow.update();
  // }
};
if (directionalLight) {
  // const helper = new DirectionalLightHelper(directionalLight, 5);
  // scene.value.add(helper);
  setShadowCameraSize({ left: -120, right: 120, top: 100, bottom: -83 });
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
    :intensity="0.5"
    :position="[20, -20, -20]"
    ref="dupa"
  />
  <TresHemisphereLight
    :intensity="2.0"
    :color="0xffffff"
    :ground-color="0xffffff"
  />
</template>
