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
window.addEventListener(
  "gamepadconnected",
  (e) => {
    storeControl.setUserUseGamepad(true);
    hudStore.setIsActiveGamepad(true);
    controllerIndex.value = e.gamepad.index;
  },
  false
);

window.addEventListener(
  "gamepaddisconnected",
  (e) => {
    console.log("disconnected");
    hudStore.setIsActiveGamepad(false);
    controllerIndex.value = null;
    storeControl;
  },
  false
);

const checkUserClickGamepadButton = (gamepad) => {
  for (var i = 0; i < gamepad.buttons.length; i++) {
    if (gamepad.buttons[i].pressed) {
      return true;
    }
  }
  return false;
};
let angle;
const controllerInput = () => {
  if (controllerIndex.value !== null) {
    const gamepad = navigator.getGamepads()[controllerIndex.value];
    const buttons = gamepad?.buttons;
    if (
      gamepad &&
      checkUserClickGamepadButton(gamepad) &&
      !storeControl.userUseGamepad
    ) {
      storeControl.setUserUseGamepad(true);
    }

    if (storeControl.userUseGamepad) {
      if (!buttons[7].pressed) {
        storeControl.setButtonRTValue(0);
      } else {
        storeControl.setButtonRTValue(buttons[7].value);
      }

      storeControl.setGamepadButtonYPressed(buttons[3].pressed);
      storeControl.setGamepadButtonXPressed(buttons[2].pressed);
      storeControl.setGamepadButtonAPressed(buttons[0].pressed);

      const leftRightValue = gamepad?.axes[0];
      storeControl.setXaxis(leftRightValue || 0);

      const upDownValue = gamepad?.axes[1];
      storeControl.setZaxis(upDownValue || 0);

      angle = Math.atan2(leftRightValue || 0, upDownValue || 0);
      if (Number(angle.toFixed(1)) !== storeControl.angle) {
        console.log(angle);
        storeControl.setAngle(angle);
      }
    }

    // upPressed.value = buttons[12].pressed;
    // downPressed.value = buttons[13].pressed;
    // leftPressed.value = buttons[14].pressed;
    // rightPressed.value = buttons[15].pressed;
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
