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
  characterState,
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

watch(buttonRTValue, () => {
  storeControl.setSpeedCharacter();
});

const idleStart = () => {
  actions.idle.play();
};

idleStart();
const isActiveForwardAnimation = ref(false);
const isActiveBackAnimation = ref(false);
const isActiveRunAnimation = ref(false);
const oldState = ref("idle");
watch(characterState, (newValue, oldValue) => {
  oldState.value = oldValue;

  if (newValue === "walk") {
    walk();
  }

  if (newValue === "idle") {
    idle();
  }
  console.log("newValue", newValue);
  if (newValue === "run") {
    mixer.timeScale = 0.8;
    console.log("run");
    run();
  } else {
    mixer.timeScale = 1.0;
  }

  if (newValue === "walk-back") {
    walkBack();
  }
});
const walk = () => {
  let prevAction = setPrevAction();
  actions.walk.enabled = true;
  if (oldState.value === "run") {
    const ratio =
      actions.walk.getClip().duration / prevAction.getClip().duration;
    actions.walk.time = prevAction.time * ratio;
  } else {
    actions.walk.time = 0.0;
    actions.walk.setEffectiveTimeScale(1.0);
    actions.walk.setEffectiveWeight(1.0);
  }

  actions.walk.crossFadeFrom(prevAction, 0.5, true);
  actions.walk.play();
};

const walkBack = () => {
  let prevAction = setPrevAction();
  actions.walkBack.enabled = true;
  if (oldState.value === "run") {
    const ratio =
      actions.walkBack.getClip().duration / prevAction.getClip().duration;
    actions.walkBack.time = prevAction.time * ratio;
  } else {
    actions.walkBack.time = 0.0;
    actions.walkBack.setEffectiveTimeScale(1.0);
    actions.walkBack.setEffectiveWeight(1.0);
  }

  actions.walkBack.crossFadeFrom(prevAction, 0.5, true);
  actions.walkBack.play();
};

const run = () => {
  let prevAction = setPrevAction();
  actions.run.enabled = true;
  if (oldState.value === "run") {
    const ratio =
      actions.run.getClip().duration / prevAction.getClip().duration;
    actions.run.time = prevAction.time * ratio;
  } else {
    actions.run.time = 0.0;
    actions.run.setEffectiveTimeScale(1.0);
    actions.run.setEffectiveWeight(1.0);
  }

  actions.run.crossFadeFrom(prevAction, 0.5, true);
  actions.run.play();
};

const idle = () => {
  let prevAction = setPrevAction();
  actions.idle.time = 0.0;
  actions.idle.enabled = true;
  actions.idle.setEffectiveTimeScale(1.0);
  actions.idle.setEffectiveWeight(1.0);
  actions.idle.crossFadeFrom(prevAction, 0.5, true);
  actions.idle.play();
};
const setPrevAction = () => {
  switch (oldState.value) {
    case "idle":
      return actions.idle;

    case "run":
      return actions.run;

    case "walk":
      return actions.walk;

    case "walk-back":
      return actions.walkBack;
  }
};

onLoop(({ delta }) => {
  // mixer.timeScale = 130 * delta;
  if (mixer) {
    mixer.update(0.01);
  }

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
