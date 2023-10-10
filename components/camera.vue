<script setup lang="ts">
const { $gsap } = useNuxtApp();
const hudStore = useHudStore();
import { Vector3, Object3D } from "three";
const characterStore = useCharacterStore();
const { positionCharacterLookAt } = storeToRefs(characterStore);

const a = new Vector3();
const b = new Vector3();
const dir = new Vector3();
const goal = new Object3D();

const cameraX = ref(20);
const cameraY = ref(20);
const cameraZ = ref(100);

const perspectiveCamera = ref<TresObject | null>(null);

const { onLoop } = useRenderLoop();
watch(positionCharacterLookAt, () => {
  cameraSettings();
});

const cameraSettings = () => {
  $gsap.to(perspectiveCamera.value.position, {
    x: 0,
    y: 3,
    z: 10,
    duration: 2,
    ease: "Power2.easeOut",
  });

  goal.add(perspectiveCamera.value);

  onLoop(() => {
    a.lerp(positionCharacterLookAt.value, 0.5);
    b.copy(goal.position);
    dir.copy(a).sub(b).normalize();
    const dis = a.distanceTo(b);
    goal.position.addScaledVector(dir, dis);

    if (perspectiveCamera.value && positionCharacterLookAt.value) {
      perspectiveCamera.value.lookAt(positionCharacterLookAt.value);
    }
  });
};
</script>

<template>
  <TresPerspectiveCamera
    :position="[cameraX, cameraY, cameraZ]"
    :fov="70"
    :aspect="1"
    :near="0.01"
    :far="100"
    ref="perspectiveCamera"
  />
  <OrbitControls
    :enablePan="false"
    :minDistance="17"
    :maxDistance="40"
    :maxPolarAngle="Math.PI / 2"
    :enabled="false"
  />
</template>
