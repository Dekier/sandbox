<script setup lang="ts">
const { $gsap } = useNuxtApp();
const characterStore = useCharacterStore();
const { positionCharacterLookAt } = storeToRefs(characterStore);

const cameraX = ref(0);
const cameraY = ref(2);
const cameraZ = ref(17);

const perspectiveCamera = ref<TresObject | null>(null);

const { onLoop } = useRenderLoop();
watch(positionCharacterLookAt, () => {
  cameraSettings();
});

const cameraSettings = () => {
  onLoop(({ delta }) => {
    perspectiveCamera.value.position.copy(positionCharacterLookAt.value);

    perspectiveCamera.value.position.x += cameraX.value;
    perspectiveCamera.value.position.y += cameraY.value;
    perspectiveCamera.value.position.z += cameraZ.value;
    if (perspectiveCamera.value && positionCharacterLookAt.value) {
      perspectiveCamera.value.lookAt(positionCharacterLookAt.value);
    }
  });
};
</script>

<template>
  <TresPerspectiveCamera
    :position="[cameraX, cameraY, cameraZ]"
    :fov="45"
    :aspect="1"
    :near="1"
    :far="80"
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
