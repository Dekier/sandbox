<template>
  <div id="sfsfs" class="fsdf"></div>
</template>

<script setup lang="ts">
import { Vector3 } from "three";
const characterStore = useCharacterStore();
const { positionCharacter } = storeToRefs(characterStore);
const storeControl = useControlsStore();
const hudStore = useHudStore();

const controllerIndex: Ref<null | number> = ref(null);

const velocity = ref(0.01);
const playerZ = ref(positionCharacter.value.z);
const playerX = ref(positionCharacter.value.x);
window.addEventListener("gamepadconnected", (e) => {
  console.log("connected");
  hudStore.setIsActiveGamepad(true);
  controllerIndex.value = e.gamepad.index;
});

window.addEventListener("gamepaddisconnected", (e) => {
  console.log("disconnected");
  hudStore.setIsActiveGamepad(false);
  controllerIndex.value = null;
  storeControl;
});
let angle;
const controllerInput = () => {
  if (controllerIndex.value !== null) {
    const gamepad = navigator.getGamepads()[controllerIndex.value];
    // const buttons = gamepad?.buttons;
    // upPressed.value = buttons[12].pressed;
    // downPressed.value = buttons[13].pressed;
    // leftPressed.value = buttons[14].pressed;
    // rightPressed.value = buttons[15].pressed;

    const leftRightValue = gamepad?.axes[0];
    storeControl.setXaxis(leftRightValue);

    const upDownValue = gamepad?.axes[1];
    storeControl.setZaxis(upDownValue);

    angle = Math.atan2(leftRightValue, upDownValue);
    storeControl.setAngle(angle);
  }
};
const movePlayer = () => {
  // if (upPressed.value) {
  //   playerZ.value -= velocity.value;
  // }
  // if (downPressed.value) {
  //   playerZ.value += velocity.value;
  // }
  // if (leftPressed.value) {
  //   playerX.value -= velocity.value;
  // }
  // if (rightPressed.value) {
  //   playerX.value += velocity.value;
  // }
};
const updatePlayer = () => {
  movePlayer();
};
const { onLoop } = useRenderLoop();

onLoop(() => {
  if (controllerIndex.value !== null) {
    controllerInput();
    updatePlayer();
  }
});
</script>
