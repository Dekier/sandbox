<script setup lang="ts">
const { $gsap } = useNuxtApp();
import { useCharacterStore } from "~/stores/character";
import { useHudStore } from "~/stores/hud";
const hudStore = useHudStore();
import { storeToRefs } from "pinia";
import { Vector3, Object3D } from "three";
const characterStore = useCharacterStore();
const { positionCharacterLookAt } = storeToRefs(characterStore);
const { isActiveCharacterCamera } = storeToRefs(hudStore);
const isActiveOrbitControl = ref(false);
let cameraX = ref(20);
let cameraY = ref(20);
let cameraZ = ref(100);
let a = new Vector3();
let b = new Vector3();
let dir = new Vector3();
let goal = new Object3D();
const perspectiveCamera: Ref<TresObject | null> = ref(null);
const { onLoop } = useRenderLoop();

watch(perspectiveCamera, () => {
  console.log(perspectiveCamera.value);
  cameraX.value = 10;
  cameraY.value = 10;
  cameraZ.value = 50;
});
watch(positionCharacterLookAt, () => {
  cameraSettings();
});

watch(isActiveCharacterCamera, () => {
  cameraSettings();
});

const cameraSettings = () => {
  if (perspectiveCamera.value) {
    if (!hudStore.isActiveCharacterCamera) {
      a = new Vector3();
      b = new Vector3();
      dir = new Vector3();
      goal.remove(perspectiveCamera.value);
      goal = new Object3D();
      cameraX.value = perspectiveCamera.value.position.x;
      cameraY.value = perspectiveCamera.value.position.y;
      cameraZ.value = perspectiveCamera.value.position.z;
      perspectiveCamera.value.lookAt(0, 0, 0);
      $gsap.to(perspectiveCamera.value.position, {
        x: -8,
        y: 7,
        z: 25,
        duration: 2,
        ease: "Power2.easeOut",
        onComplete() {
          cameraX.value = -8;
          cameraY.value = 7;
          cameraZ.value = 25;
        },
      });
      $gsap.to(perspectiveCamera.value.rotation, {
        x: -0.17690704200258198,
        y: -0.4026382120174583,
        z: -0.06993854928506144,
        duration: 2,
        ease: "Power2.easeOut",
        onComplete() {
          isActiveOrbitControl.value = true;
        },
      });
    } else {
      isActiveOrbitControl.value = false;

      $gsap.to(perspectiveCamera.value.position, {
        x: 0,
        y: 3,
        z: 10,
        duration: 2,
        ease: "Power2.easeOut",
        onComplete() {
          cameraX.value = 0;
          cameraY.value = 3;
          cameraZ.value = 10;
          isActiveOrbitControl.value = false;
        },
      });
      const coronaSafetyDistance = 0.3;
      goal.position.z = -coronaSafetyDistance;
      goal.add(perspectiveCamera.value);

      onLoop(() => {
        if (hudStore.isActiveCharacterCamera) {
          a.lerp(positionCharacterLookAt.value, 0.4);
          b.copy(goal.position);
          dir.copy(a).sub(b).normalize();
          const dis = a.distanceTo(b) - coronaSafetyDistance;
          goal.position.addScaledVector(dir, dis);
          if (perspectiveCamera.value && positionCharacterLookAt.value) {
            perspectiveCamera.value.lookAt(positionCharacterLookAt.value);
            const angle = Math.atan2(dir.x, dir.z);
            characterStore.setAngle(angle);
          }
        }
      });
    }
  }
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
  <!-- <PointerLockControls /> -->
  <OrbitControls
    :enablePan="false"
    :minDistance="17"
    :maxDistance="40"
    :maxPolarAngle="Math.PI / 2"
    :enabled="isActiveOrbitControl"
  />
</template>
