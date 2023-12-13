<script setup lang="ts">
import { Vector3, Vector2, Spherical, Group } from "three";
const { $gsap } = useNuxtApp();
const storeGeneral = useGeneralStore();
const characterStore = useCharacterStore();
const storeControl = useControlsStore();
const { positionCharacterLookAt, characterModel } = storeToRefs(characterStore);
const { isStartedGame } = storeToRefs(storeGeneral);

const { scene } = useTresContext();
const cameraTheta = ref(0);
const cameraX = ref(0);
const cameraY = ref(1);
const cameraZ = ref(16);
const delta = ref(new Vector2());
const isMouseLocked = ref(false);
const perspectiveCamera = ref<TresObject | null>(null);
const { onLoop } = useRenderLoop();
watch(positionCharacterLookAt, () => {
  cameraSettings();
});

watch(characterModel, (value) => {
  perspectiveCamera.value!.lookAt(characterModel.value.position.clone());
  container.position.x = characterModel.value.position.x;
  container.position.z = characterModel.value.position.z;
});

// watch(isStartedGame, (value) => {
//   const element = document.body;
//   if (element.requestPointerLock || element.mozRequestPointerLock) {
//     element.requestPointerLock =
//       element.requestPointerLock || element.mozRequestPointerLock;
//     if (!isMouseLocked.value) {
//       element.requestPointerLock();
//     }
//   }
// });

const xAxis = new Vector3(1, 0, 0);
const tempCameraVector = new Vector3();
const tempModelVector = new Vector3();
// const cameraOrigin = new Vector3(0, 3, 0);
const cameraOrigin = new Vector3(0, 3, 0);
const container = new Group();
scene.value.add(container);
const cameraSettings = () => {
  container.add(perspectiveCamera.value);
  perspectiveCamera.value!.lookAt(positionCharacterLookAt.value);
  onLoop(({ delta, elapsed }) => {
    if (!perspectiveCamera.value || !positionCharacterLookAt.value) {
      return;
    }

    if (storeControl.isMovingCharacter) {
      perspectiveCamera.value.getWorldDirection(tempCameraVector);
      const cameraDirection = tempCameraVector.setY(0).normalize();

      characterModel.value.getWorldDirection(tempModelVector);
      const playerDirection = tempModelVector.setY(0).normalize();

      const cameraAngle =
        cameraDirection.angleTo(xAxis) * (cameraDirection.z > 0 ? 1 : -1);
      const playerAngle =
        playerDirection.angleTo(xAxis) * (playerDirection.z > 0 ? 1 : -1);
      const angleToRotate = playerAngle - cameraAngle;

      let sanitisedAngle = angleToRotate;
      if (angleToRotate > Math.PI) {
        sanitisedAngle = angleToRotate - 2 * Math.PI;
      }
      if (angleToRotate < -Math.PI) {
        sanitisedAngle = angleToRotate + 2 * Math.PI;
      }

      characterModel.value.rotateY(
        Math.max(-0.05, Math.min(sanitisedAngle, 0.05))
      );

      storeControl.setSanitisedAngle(sanitisedAngle);
      // poniżej 0.05 to jest prędkość
      container.position.add(
        cameraDirection.multiplyScalar(storeControl.speed * delta)
      );
      perspectiveCamera.value.lookAt(
        container.position.clone().add(cameraOrigin)
      );
      characterModel.value.position.x = container.position.x;
      characterModel.value.position.z = container.position.z;
    }
  });
};

window.addEventListener("pointermove", (e) => {
  if (isMouseLocked.value) {
    let movementX = 0;

    if (e.movementX > 20) {
      movementX = 20;
    }

    if (e.movementX < -20) {
      movementX = -20;
    }

    if (e.movementX < 20 && e.movementX > -20) {
      movementX = e.movementX;
    }

    let movementY = 0;

    if (e.movementY > 20) {
      movementY = 20;
    }

    if (e.movementY < -20) {
      movementY = -20;
    }
    if (e.movementY < 20 && e.movementY > -20) {
      movementY = e.movementY;
    }
    const offset = new Spherical().setFromVector3(
      perspectiveCamera.value!.position.clone().sub(cameraOrigin)
    );
    const phi = offset.phi - movementY * 0.002;
    offset.theta -= movementX * 0.002;
    offset.phi = Math.max(0.7, Math.min(0.55 * Math.PI, phi));
    perspectiveCamera.value!.position.copy(
      cameraOrigin.clone().add(new Vector3().setFromSpherical(offset))
    );
    perspectiveCamera.value!.lookAt(
      container.position.clone().add(cameraOrigin)
    );
  }
});

document.addEventListener("pointerlockchange", () => {
  isMouseLocked.value =
    document.pointerLockElement === document.body ||
    document.mozPointerLockElement === document.body;
});
document.addEventListener("mozpointerlockchange", () => {
  isMouseLocked.value =
    document.pointerLockElement === document.body ||
    document.mozPointerLockElement === document.body;
});

document.addEventListener("click", () => {
  if (isStartedGame.value) {
    const element = document.body;

    // Check if Pointer Lock is supported
    if (element.requestPointerLock || element.mozRequestPointerLock) {
      element.requestPointerLock =
        element.requestPointerLock || element.mozRequestPointerLock;

      // Request Pointer Lock only if it's not already locked
      if (!isMouseLocked.value) {
        element.requestPointerLock();
      }
    }
  }
});
const defaultKeys = {
  escape: false,
} as {
  escape: boolean;
};
document.body.addEventListener("keyup", (e) => {
  const key = e.code.replace("Key", "").toLowerCase();
  if (defaultKeys[key] !== undefined) {
    storeGeneral.setIsStartedGame(false);
  }
  isMouseLocked.value =
    document.pointerLockElement === document.body ||
    document.mozPointerLockElement === document.body;
});
</script>

<template>
  <TresPerspectiveCamera
    :position="[cameraX, cameraY, cameraZ]"
    :fov="55"
    :aspect="1"
    :near="1"
    :far="240"
    ref="perspectiveCamera"
  />

  <!-- <OrbitControls
    :enablePan="false"
    :minDistance="1"
    :maxDistance="100"
    :maxPolarAngle="Math.PI / 2"
    :enabled="true"
  /> -->
</template>
