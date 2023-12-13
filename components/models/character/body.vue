<script setup lang="ts">
import { Vector3, Quaternion, MeshLambertMaterial } from "three";
import { useModelSettings } from "~/composables/useModel";
import { useControls } from "~/composables/useControls";
import { useGLTF } from "@tresjs/cientos";
import { useUtils } from "~/composables/useUtils";
const { newSetModel } = useModelSettings();
const { changeModelRotation } = useControls();
const storeControl = useControlsStore();
const characterStore = useCharacterStore();
const { $gsap } = useNuxtApp();
const {
  keys,
  speed,
  isJumping,
  isMovingCharacter,
  isBlockW,
  isBlockA,
  isBlockD,
  isBlockS,
  deltaX,
  deltaY,
  upPressed,
  downPressed,
  leftPressed,
  rightPressed,
  zAxis,
  xAxis,
  leftShiftPressed,
  buttonRTValue,
} = storeToRefs(storeControl);
const { jump } = useUtils();
const { nodes } = await useGLTF("/models/body.glb", { draco: true });
const modelCharacter = nodes.character;
modelCharacter.material = new MeshLambertMaterial({
  color: 0x7d7d7d,
});
// modelCharacter.traverse((child: any) => {
//   if (child.isMesh) {
//     child.castShadow = true;
//     child.receiveShadow = true;
//   }
// });
// modelCharacter.scale.set(1.2, 1.2, 1.2);
newSetModel(modelCharacter);
// const modelCamera = nodes.Cube031;
characterStore.setPositionCharacter(modelCharacter.position);
characterStore.setPositionCharacterLookAt(modelCharacter.position);
characterStore.setCharacterModel(modelCharacter);
// modelCamera.material.opacity = 0;
// modelCamera.material.transparent = true;

// watch(leftShiftPressed, () => {
//   storeControl.setSpeedCharacter();
// });

watch(buttonRTValue, () => {
  storeControl.setSpeedCharacter();
});

const { onLoop } = useRenderLoop();

onLoop((data) => {
  storeControl.setSpeedCharacter();
  // if (keys.value.space && !isJumping.value) {
  //   jump(modelCharacter);
  // }
  // if (storeControl.isMovingCharacter && modelCharacter) {
  //   changeModelRotation(modelCharacter);
  // const moveDirection = new Vector3();
  // moveDirection.z = Number(downPressed.value) - Number(upPressed.value);
  // moveDirection.x = Number(rightPressed.value) - Number(leftPressed.value);
  // moveDirection.normalize();
  // if (moveDirection.length() > 0) {
  //   const angle = Math.atan2(moveDirection.x, moveDirection.z);
  //   storeControl.setAngle(angle);
  // }
  // if ((modelCharacter && zAxis.value) || (modelCharacter && xAxis.value)) {
  //   modelCharacter.position.z += speed.value * zAxis.value * data.delta;
  //   modelCharacter.position.x += speed.value * xAxis.value * data.delta;
  // }
  //   if ((modelCharacter && deltaY.value) || (modelCharacter && deltaX.value)) {
  //     modelCharacter.position.z -=
  //       speed.value * deltaY.value * 1.5 * data.delta;
  //     modelCharacter.position.x +=
  //       speed.value * deltaX.value * 1.5 * data.delta;
  //   }
  //   if (upPressed.value) {
  //     if (!isBlockW.value) {
  //       modelCharacter.position.z -= speed.value * data.delta;
  //     }
  //   }
  //   if (downPressed.value) {
  //     if (!isBlockS.value) {
  //       modelCharacter.position.z += speed.value * data.delta;
  //     }
  //   }
  //   if (leftPressed.value) {
  //     if (!isBlockA.value) {
  //       modelCharacter.position.x -= speed.value * data.delta;
  //     }
  //   }
  //   if (rightPressed.value) {
  //     if (!isBlockD.value) {
  //       modelCharacter.position.x += speed.value * data.delta;
  //     }
  //   }
  // }
  // modelCamera.position.x = modelCharacter.position.x;
  // modelCamera.position.z = modelCharacter.position.z;
});
const defaultKeys = {
  a: false,
  s: false,
  d: false,
  w: false,
  shiftleft: false,
  space: false,
  e: false,
} as {
  a: boolean;
  s: boolean;
  d: boolean;
  w: boolean;
  shiftleft: boolean;
  space: boolean;
  e: boolean;
};
document.body.addEventListener("keydown", (e) => {
  const key = e.code.replace("Key", "").toLowerCase();
  if (defaultKeys[key] !== undefined) {
    storeControl.setKeysTrue(key);
  }
  if (storeControl.userUseGamepad) {
    storeControl.setUserUseGamepad(false);
  }
});
document.body.addEventListener("keyup", (e) => {
  const key = e.code.replace("Key", "").toLowerCase();
  if (defaultKeys[key] !== undefined) {
    storeControl.setKeysFalse(key);
  }
});
</script>

<template>
  <primitive :object="modelCharacter" />
  <!-- <primitive :object="modelCamera" /> -->
</template>
