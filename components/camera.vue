<script setup lang="ts">
import { Vector3 } from "three";
const { $gsap } = useNuxtApp();
const characterStore = useCharacterStore();
const { positionCharacterLookAt, matrixWorldCharacter } =
  storeToRefs(characterStore);

const cameraX = ref(0);
const cameraY = ref(6);
const cameraZ = ref(23);
const perspectiveCamera = ref<TresObject | null>(null);

const { onLoop } = useRenderLoop();
watch(positionCharacterLookAt, () => {
  cameraSettings();
});

const cameraSettings = () => {
  onLoop(({ delta }) => {
    // perspectiveCamera.value.position.copy(positionCharacterLookAt.value);

    // perspectiveCamera.value.position.x += cameraX.value;
    // perspectiveCamera.value.position.y += cameraY.value;
    // perspectiveCamera.value.position.z += cameraZ.value;
    const targetPosition = new Vector3(
      positionCharacterLookAt.value.x + cameraX.value,
      positionCharacterLookAt.value.y + cameraY.value,
      positionCharacterLookAt.value.z + cameraZ.value
    );

    perspectiveCamera.value.position.lerp(targetPosition, 0.1);

    if (perspectiveCamera.value && positionCharacterLookAt.value) {
      perspectiveCamera.value.lookAt(positionCharacterLookAt.value);
    }
  });
};
</script>

<template>
  <TresPerspectiveCamera
    :position="[cameraX, cameraY, cameraZ]"
    :fov="35"
    :aspect="1"
    :near="1"
    :far="90"
    ref="perspectiveCamera"
  />
  <!-- <OrbitControls
    :enablePan="false"
    :minDistance="17"
    :maxDistance="40"
    :maxPolarAngle="Math.PI / 2"
    :enabled="false"
  /> -->
</template>
