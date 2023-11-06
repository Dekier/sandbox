<script setup lang="ts">
import { Vector3, Vector2, Spherical, Group } from "three";
const { $gsap } = useNuxtApp();
const characterStore = useCharacterStore();
const storeControl = useControlsStore();
const { positionCharacterLookAt, characterModel } = storeToRefs(characterStore);

const { scene } = useTresContext();
const cameraTheta = ref(0);
const cameraX = ref(0);
const cameraY = ref(1);
const cameraZ = ref(16);
const delta = ref(new Vector2());
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

const xAxis = new Vector3(1, 0, 0);
const tempCameraVector = new Vector3();
const tempModelVector = new Vector3();
const cameraOrigin = new Vector3(0, 2, 0);
const container = new Group();
scene.value.add(container);
const cameraSettings = () => {
  container.add(perspectiveCamera.value);
  perspectiveCamera.value!.lookAt(positionCharacterLookAt.value);
  onLoop(({ _delta, elapsed }) => {
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
        cameraDirection.multiplyScalar(storeControl.speed)
      );
      perspectiveCamera.value.lookAt(
        container.position.clone().add(cameraOrigin)
      );
      characterModel.value.position.x = container.position.x;
      characterModel.value.position.z = container.position.z;
    }
  });
};

let mousedown = false;
// window.addEventListener("pointerdown", (e) => {
//   mousedown = true;
// });

// window.addEventListener("pointerup", (e) => {
//   mousedown = false;
// });

window.addEventListener("pointermove", (e) => {
  if (storeControl.escape) {
    const { movementX, movementY } = e;
    const offset = new Spherical().setFromVector3(
      perspectiveCamera.value!.position.clone().sub(cameraOrigin)
    );
    const phi = offset.phi - movementY * 0.02;
    offset.theta -= movementX * 0.02;
    offset.phi = Math.max(0.7, Math.min(0.55 * Math.PI, phi));
    perspectiveCamera.value!.position.copy(
      cameraOrigin.clone().add(new Vector3().setFromSpherical(offset))
    );
    perspectiveCamera.value!.lookAt(
      container.position.clone().add(cameraOrigin)
    );
  }
});
</script>

<template>
  <TresPerspectiveCamera
    :position="[cameraX, cameraY, cameraZ]"
    :fov="45"
    :aspect="1"
    :near="1"
    :far="90"
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
