<script setup lang="ts">
import { useCharacterControls } from "~/composables/useControls";
import { useUtils } from "~/composables/useUtils";
import { Mesh } from "three";
const { newSetModel } = useModelSettings();
const { changeModelRotation } = useCharacterControls();
const storeEquipmentGround = useEquipmentStore();
const storeGeneral = useGeneralStore();
const storeControl = useControlsStore();
const characterStore = useCharacterStore();
const menuInGameStore = useMenuInGameStore();
const { tabType } = storeToRefs(menuInGameStore);
const { $gsap } = useNuxtApp();
const { isActiveMenuGame, isActiveBlockAnimation, settingsShadow } =
  storeToRefs(storeGeneral);
const {
  keys,
  keyE,
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
const { onLoop } = useRenderLoop();
const modelCharacter = nodes.wiking;
newSetModel(modelCharacter);
modelCharacter.position.y = 2.87;
characterStore.setPositionCharacter(modelCharacter.position);
characterStore.setPositionCharacterLookAt(modelCharacter.position);
characterStore.setCharacterModel(modelCharacter);

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

  switch (newValue) {
    case "walk":
      walk();
      break;
    case "collect":
      if (characterStore.characterIsCloseFern) {
        collect();
      }
      break;
    case "attack":
      attack();
      break;
    case "idle":
      idle();
      break;
    case "walk-back":
      walkBack();
      break;
    case "run":
      run();
      break;

    default:
      break;
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
    // actions.walk.setEffectiveTimeScale(1.0);
    // actions.walk.setEffectiveWeight(1.0);
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
    // actions.walkBack.setEffectiveTimeScale(1.0);
    // actions.walkBack.setEffectiveWeight(1.0);
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
    // actions.run.setEffectiveTimeScale(0.0);
    // actions.run.setEffectiveWeight(1.0);
  }

  actions.run.crossFadeFrom(prevAction, 0.5, true);
  actions.run.play();
};

const attack = () => {
  let prevAction = setPrevAction();
  actions.attack.enabled = true;
  if (oldState.value === "attack") {
    const ratio =
      actions.attack.getClip().duration / prevAction.getClip().duration;
    actions.attack.time = prevAction.time * ratio;
  } else {
    actions.attack.time = 0.0;
    // actions.attack.setEffectiveTimeScale(1.0);
    // actions.attack.setEffectiveWeight(1.0);
  }

  actions.attack.crossFadeFrom(prevAction, 0.5, true);
  actions.attack.play();
};

const collect = () => {
  let prevAction = setPrevAction();
  actions.collect.enabled = true;
  if (oldState.value === "collect") {
    const ratio =
      actions.collect.getClip().duration / prevAction.getClip().duration;
    actions.collect.time = prevAction.time * ratio;
  } else {
    actions.collect.time = 0.0;
    // actions.collect.setEffectiveTimeScale(1.0);
    // actions.collect.setEffectiveWeight(1.0);
  }

  actions.collect.crossFadeFrom(prevAction, 0.5, true);
  actions.collect.play();
};

const idle = () => {
  let prevAction = setPrevAction();
  actions.idle.time = 0.0;
  actions.idle.enabled = true;
  // actions.idle.setEffectiveTimeScale(1.0);
  // actions.idle.setEffectiveWeight(1.0);
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
    case "attack":
      return actions.attack;
    case "collect":
      return actions.collect;
  }
};

onLoop(({ delta }) => {
  if (characterState.value === "attack") {
    mixer.update(1.5 * delta);
  } else if (characterState.value === "collect") {
    mixer.update(2.0 * delta);
  } else if (characterState.value === "run") {
    mixer.update(0.6 * delta);
  } else if (characterState.value === "walk") {
    mixer.update(1.5 * delta);
  } else {
    mixer.update(delta);
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
document.body.addEventListener("click", (event) => {
  if (
    event.button === 0 &&
    characterState.value !== "attack" &&
    !isActiveMenuGame.value &&
    storeEquipmentGround.isActiveHandItemTitle === "Small axe" &&
    !tabType.value &&
    !isActiveBlockAnimation.value
  ) {
    storeControl.setMouseEvent("left");
  }
});
</script>

<template>
  <Suspense>
    <primitive
      :castShadow="settingsShadow > 512"
      :receiveShadow="settingsShadow > 512"
      :object="modelCharacter"
    />
  </Suspense>
</template>
