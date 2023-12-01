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
const { positionCharacter, characterModel } = storeToRefs(characterStore);
const { scene, camera } = useTresContext();
const { isMobile } = useDevice();

const cameraShadowSize = ref({ left: -60, right: 60, top: 30, bottom: -10 });
const directionalLight = new DirectionalLight(0xffffff, 2);
directionalLight.position.set(lightX.value, lightY.value, lightZ.value);
directionalLight.rotation.set(-0.8, -1.7, -0.7);
directionalLight.intensity = 1.4;
directionalLight.castShadow = true;
directionalLight.shadow.bias = -0.002;
directionalLight.target = characterModel.value;
// directionalLight.shadow.radius = 2;
directionalLight.shadow.mapSize.width = isMobile ? 1024 : 4048;
directionalLight.shadow.mapSize.height = isMobile ? 1024 : 4048;
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 90;

directionalLight.lookAt = positionCharacter.value;
scene.value.add(directionalLight);

watch(isActiveShadows, (value) => {
  directionalLight.castShadow = value;
});

watch(shadowSize, (value) => {
  directionalLight.shadow.mapSize.set(value, value);
  directionalLight.shadow.map.setSize(value, value);
});
let helperShadow = null;
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
  console.log(directionalLight.shadow.camera.left);
  directionalLight.shadow.camera.left = left;
  directionalLight.shadow.camera.right = right;
  directionalLight.shadow.camera.top = top;
  directionalLight.shadow.camera.bottom = bottom;
  directionalLight.shadow.needsUpdate = true;
  directionalLight.shadow.camera.updateProjectionMatrix();
  if (helperShadow) {
    helperShadow.update();
  }
};
if (directionalLight) {
  // const helper = new DirectionalLightHelper(directionalLight, 5);
  // scene.value.add(helper);
  helperShadow = new CameraHelper(directionalLight.shadow.camera);
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
}
setShadowCameraSize({ left: -60, right: 60, top: 30, bottom: -10 });

// const tresDirectionalLight: Ref<TresObject | null> = ref(null);
let positionCamera = new Vector3(0, 0, 0);
const pinCameraToCharacter = () => {
  positionCamera = new Vector3(
    positionCharacter.value.x - 22,
    positionCharacter.value.y + 10,
    positionCharacter.value.z + 25
  );
  directionalLight.position.copy(positionCamera);
};
pinCameraToCharacter();
const { onLoop } = useRenderLoop();
onLoop(({ _delta, elapsed }) => {
  if (isMovingCharacter.value) {
    pinCameraToCharacter();
    if (
      positionCharacter.value.x > 25 &&
      directionalLight.shadow.camera.left === -60
    ) {
      setShadowCameraSize({ left: -120, right: 60, top: 30, bottom: -10 });
    }
    if (
      positionCharacter.value.x < 25 &&
      directionalLight.shadow.camera.left === -120
    ) {
      setShadowCameraSize({ left: -60, right: 60, top: 30, bottom: -10 });
    }
    if (
      positionCharacter.value.x < -15 &&
      directionalLight.shadow.camera.left === -60
    ) {
      directionalLight.shadow.camera.far = 120;
      setShadowCameraSize({ left: -30, right: 60, top: 30, bottom: -10 });
    }
    if (
      positionCharacter.value.x > -15 &&
      directionalLight.shadow.camera.left === -30
    ) {
      directionalLight.shadow.camera.far = 90;
      setShadowCameraSize({ left: -60, right: 60, top: 30, bottom: -10 });
    }
  }
});
</script>

<template>
  <TresDirectionalLight
    :intensity="0.5"
    :position="[20, -20, -20]"
    ref="TresDirectionalLight"
  />
  <TresHemisphereLight :intensity="1.2" />
</template>
