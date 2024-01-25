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
const {
  scene: modelScene,
  nodes,
  animations,
} = await useGLTF("/models/character.glb", { draco: true });
const { actions, mixer } = useAnimations(animations, modelScene);
console.log(nodes);
console.log(actions);
const { onLoop } = useRenderLoop();
// actions.walk2.play();
const modelCharacter = nodes.wiking;

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

const walk = () => {
  if (
    upPressed.value &&
    !downPressed.value &&
    !isActiveForwardAnimation.value &&
    !leftShiftPressed.value
  ) {
    actions.walk.reset();
    actions.walk.play();
    idleStop();
    isActiveForwardAnimation.value = true;
  } else if (
    !upPressed.value &&
    isActiveForwardAnimation.value &&
    !leftShiftPressed.value
  ) {
    // mixer.stopAllAction();
    idleStart();
    actions.walk.stop();
    isActiveForwardAnimation.value = false;
    // actions.walk2.reset();
  }
};

const walkBack = () => {
  if (
    downPressed.value &&
    !upPressed.value &&
    !isActiveBackAnimation.value &&
    !leftShiftPressed.value
  ) {
    actions.walkBack.reset();
    actions.walkBack.play();
    idleStop();
    isActiveBackAnimation.value = true;
  } else if (
    !downPressed.value &&
    isActiveBackAnimation.value &&
    !leftShiftPressed.value
  ) {
    // mixer.stopAllAction();
    idleStart();
    actions.walkBack.stop();
    isActiveBackAnimation.value = false;
  }
};

const run = () => {
  if (
    !downPressed.value &&
    upPressed.value &&
    !isActiveRunAnimation.value &&
    leftShiftPressed.value
  ) {
    console.log("run");
    actions.run.reset();
    actions.run.play();
    actions.walk.stop();
    isActiveBackAnimation.value = false;
    idleStop();
    isActiveRunAnimation.value = true;
  } else if (isActiveRunAnimation.value && !leftShiftPressed.value) {
    // mixer.stopAllAction();
    if (upPressed.value) {
      actions.walk.reset();
      actions.walk.play();
    } else {
      idleStart();
    }
    actions.run.stop();
    isActiveRunAnimation.value = false;
  }
};

const idleStart = () => {
  actions.idle.play();
};
const idleStop = () => {
  actions.idle.stop();
};

// idleStart();
const isActiveForwardAnimation = ref(false);
const isActiveBackAnimation = ref(false);
const isActiveRunAnimation = ref(false);
onLoop(({ delta }) => {
  mixer.timeScale = 130 * delta;
  if (mixer) {
    mixer.update(0.01);
  }
  walk();
  walkBack();
  run();

  storeControl.setSpeedCharacter();
  characterStore.setPositionCharacter(modelCharacter.position);
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
