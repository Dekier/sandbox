<script setup lang="ts">
import { MeshBasicMaterial, Vector3 } from "three";
const { $gsap } = useNuxtApp();
import { storeToRefs } from "pinia";
import { useHudStore } from "~/stores/hud";
const storeHud = useHudStore();
import { useCharacterStore } from "~/stores/character";
const characterStore = useCharacterStore();
const { keys, angle, jumpHeight, isJumping } = storeToRefs(characterStore);
import { useGLTF } from "@tresjs/cientos";
const { nodes } = await useGLTF("/models/body.glb", { draco: true });
const speed = ref(0.0);
const velocity = ref(0.0);
const modelCharacter = nodes.character;
const modelCamera = nodes.Cube031;
characterStore.setPositionCharacter(modelCharacter.position);
characterStore.setPositionCharacterLookAt(modelCamera.position);
modelCamera.material.opacity = 0;
modelCamera.material.transparent = true;
modelCharacter.children[modelCharacter.children.length - 1].material.dispose();
modelCharacter.children[modelCharacter.children.length - 1].material =
  new MeshBasicMaterial({
    color: 0x000000,
  });
modelCharacter.traverse((child: any) => {
  if (child.isMesh) {
    child.castShadow = true;
    child.receiveShadow = true;
  }
});
x: 2.2;
z: 4.1;

x: 10.7;
z: 4.1;
const { onLoop } = useRenderLoop();
const moveDirection = new Vector3();
const blockW = () => {
  return (
    (modelCharacter.position.z <= 4.1 &&
      modelCharacter.position.z >= 3 &&
      modelCharacter.position.x >= 2.35 &&
      modelCharacter.position.x <= 10.98) ||
    (modelCharacter.position.z <= 4.1 &&
      modelCharacter.position.x <= -2.3 &&
      modelCharacter.position.x >= -9.95) ||
    (modelCharacter.position.z <= 12 &&
      modelCharacter.position.z >= 11 &&
      modelCharacter.position.x >= -2.35 &&
      modelCharacter.position.x <= 2.35)
  );
};

const blockS = () => {
  return (
    modelCharacter.position.z >= -11 &&
    modelCharacter.position.z <= -10 &&
    modelCharacter.position.x <= 11 &&
    modelCharacter.position.x >= -9.7
  );
};

const blockA = () => {
  return (
    (modelCharacter.position.z <= 11.94 &&
      modelCharacter.position.z >= 3 &&
      modelCharacter.position.x <= 2.4 &&
      modelCharacter.position.x >= 1) ||
    (modelCharacter.position.x <= 11 &&
      modelCharacter.position.x >= 10 &&
      modelCharacter.position.z <= 4 &&
      modelCharacter.position.z >= -11)
  );
};
const blockD = () => {
  return (
    (modelCharacter.position.z >= 4 &&
      modelCharacter.position.z <= 11.94 &&
      modelCharacter.position.x >= -2.4 &&
      modelCharacter.position.x <= -1.4) ||
    (modelCharacter.position.z <= 4 &&
      modelCharacter.position.z >= -10.6 &&
      modelCharacter.position.x >= -10 &&
      modelCharacter.position.x <= -9)
  );
};

onLoop(() => {
  if (modelCharacter && storeHud.isActiveCharacterCamera) {
    modelCharacter.rotation.y = angle.value;
    characterStore.setPositionCharacter(modelCamera.position);
    speed.value = 0.0;
    if (keys.value.w) {
      if (keys.value.shiftleft) {
        speed.value = 0.11;
      } else {
        speed.value = 0.08;
      }
    } else if (keys.value.s) {
      if (keys.value.shiftleft) {
        speed.value = -0.11;
      } else {
        speed.value = -0.08;
      }
    } else if (
      (!keys.value.w && !keys.value.s && keys.value.a) ||
      (!keys.value.w && !keys.value.s && keys.value.d)
    ) {
      if (keys.value.shiftleft) {
        speed.value = 0.11;
      } else {
        speed.value = 0.08;
      }
    }

    velocity.value += speed.value - velocity.value;
    if (keys.value.w) {
      if (!blockW()) {
        modelCharacter.position.z -= velocity.value;
        modelCamera.position.z -= velocity.value;
      }
    }

    if (keys.value.s) {
      if (!blockS()) {
        modelCharacter.position.z -= velocity.value;
        modelCamera.position.z -= velocity.value;
      }
    }

    if (keys.value.a) {
      if (!blockA()) {
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
      if (!blockD()) {
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
      characterStore.setIsJumping(true);
      jump();
    }
  }

  moveDirection.z = Number(keys.value.s) - Number(keys.value.w);
  moveDirection.x = Number(keys.value.d) - Number(keys.value.a);
  moveDirection.normalize(); // Normalizacja wektora
  if (moveDirection.length() > 0) {
    const angle = Math.atan2(moveDirection.x, moveDirection.z);
    characterStore.setAngle(angle);
  }
});

const jump = () => {
  $gsap.to(modelCharacter.position, {
    y: modelCharacter.position.y + jumpHeight.value,
    duration: 0.4,
    ease: "power1.out",
    onComplete: () => {
      $gsap.to(modelCharacter.position, {
        y: -1.4,
        duration: 0.4,
        ease: "power1.in",
        onComplete: () => {
          characterStore.setIsJumping(false);
        },
      });
    },
  });
};
const defaultKeys = {
  a: false,
  s: false,
  d: false,
  w: false,
  shiftleft: false,
  space: false,
} as {
  a: boolean;
  s: boolean;
  d: boolean;
  w: boolean;
  shiftleft: boolean;
  space: boolean;
};
document.body.addEventListener("keydown", function (e) {
  const key = e.code.replace("Key", "").toLowerCase();
  if (defaultKeys[key] !== undefined) {
    characterStore.setKeysTrue(key);
  }
});
document.body.addEventListener("keyup", function (e) {
  const key = e.code.replace("Key", "").toLowerCase();
  if (defaultKeys[key] !== undefined) {
    characterStore.setKeysFalse(key);
  }
});
</script>

<template>
  <primitive :object="modelCharacter" />
  <primitive :object="modelCamera" />
</template>
