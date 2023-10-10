<script setup lang="ts">
import { Vector3, Quaternion } from "three";
import { useModelSettings } from "~/composables/useModel";
import { useControls } from "~/composables/useControls";
import { useGLTF } from "@tresjs/cientos";
import { useUtils } from "~/composables/useUtils";
const { setModel } = useModelSettings();
const { changeModelRotation } = useControls();
const storeControl = useControlsStore();
const characterStore = useCharacterStore();
const { $gsap } = useNuxtApp();
const {
  keys,
  velocity,
  isJumping,
  isCharacterWalk,
  isBlockW,
  isBlockA,
  isBlockD,
  isBlockS,
} = storeToRefs(storeControl);
const { jump } = useUtils();
const { nodes } = await useGLTF("/models/body.glb", { draco: true });
const modelCharacter = nodes.character;
setModel(modelCharacter);
const modelCamera = nodes.Cube031;
characterStore.setPositionCharacter(modelCharacter.position);
characterStore.setPositionCharacterLookAt(modelCamera.position);
modelCamera.material.opacity = 0;
modelCamera.material.transparent = true;

const { onLoop } = useRenderLoop();

onLoop(() => {
  if (modelCharacter) {
    storeControl.setSpeedCharacter();
    if (keys.value.w) {
      if (!isBlockW.value) {
        modelCharacter.position.z -= velocity.value;
        modelCamera.position.z -= velocity.value;
      }
    }

    if (keys.value.s) {
      if (!isBlockS.value) {
        modelCharacter.position.z -= velocity.value;
        modelCamera.position.z -= velocity.value;
      }
    }
    if (keys.value.a) {
      if (!isBlockA.value) {
        if (keys.value.s) {
          modelCharacter.position.x += velocity.value;
          modelCamera.position.x += velocity.value;
        } else {
          modelCharacter.position.x -= velocity.value;
          modelCamera.position.x -= velocity.value;
        }
      }
    }

    if (keys.value.d) {
      if (!isBlockD.value) {
        if (keys.value.s) {
          modelCharacter.position.x -= velocity.value;
          modelCamera.position.x -= velocity.value;
        } else {
          modelCharacter.position.x += velocity.value;
          modelCamera.position.x += velocity.value;
        }
      }
    }
    if (keys.value.space && !isJumping.value) {
      jump(modelCharacter);
    }
    storeControl.setDirectionOffset();
    if (isCharacterWalk) {
      changeModelRotation(modelCharacter);
    }
  }

  const moveDirection = new Vector3();
  moveDirection.z = Number(keys.value.s) - Number(keys.value.w);
  moveDirection.x = Number(keys.value.d) - Number(keys.value.a);
  moveDirection.normalize();
  if (moveDirection.length() > 0) {
    const angle = Math.atan2(moveDirection.x, moveDirection.z);
    storeControl.setAngle(angle);
  }
  if (keys.value.d || keys.value.a || keys.value.w || keys.value.s) {
    if (!storeControl.isCharacterWalk) {
      storeControl.setIsCharacterWalk(true);
    }
  } else {
    if (storeControl.isCharacterWalk) {
      storeControl.setIsCharacterWalk(false);
    }
  }
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
  <primitive :object="modelCamera" />
</template>
