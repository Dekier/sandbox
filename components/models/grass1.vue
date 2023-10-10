<script setup lang="ts">
import { DoubleSide, Object3D, InstancedMesh, Matrix4 } from "three";
const controlsStore = useControlsStore();
const { isMovingCharacter } = storeToRefs(controlsStore);
const { bendModel, calculateDistance } = useUtils();
const { nodes } = await useGLTF("/models/grass1.glb", {
  draco: true,
});
const models: InstancedMesh[] = [];
const instancesCount = ref(600);
if (nodes.grass002) {
  const geometry = nodes.grass002.geometry;
  const material = nodes.grass002.material!.clone();
  const positionY = nodes.grass002.position.y;

  let dummy = new Object3D();
  let mat4 = new Matrix4();

  const { onLoop } = useRenderLoop();

  const { scene } = useTresContext();
  let io = new InstancedMesh(geometry, material, instancesCount.value);
  for (let i = 0; i < instancesCount.value; i++) {
    dummy.position.set(
      Math.random() * 10 + 29 - Math.random(),
      positionY,
      Math.random() * 10 + -12 - Math.random()
    );
    const randomScale = Math.random() * 0.4 + 1;
    dummy.scale.set(randomScale, randomScale, randomScale);
    dummy.updateMatrix();
    io.setMatrixAt(i, dummy.matrix);
    io.receiveShadow = true;
    io.castShadow = true;
    io.material.side = DoubleSide;
  }
  scene.value.add(io);

  const currentDistance = ref(0);
  const countHalfAnimation = ref(0);
  onLoop(() => {
    if (isMovingCharacter.value) {
      countHalfAnimation.value++;
      if (countHalfAnimation.value === 2) {
        for (let i = 0; i < instancesCount.value; i++) {
          io.getMatrixAt(i, mat4);
          mat4.decompose(dummy.position, dummy.quaternion, dummy.scale);
          currentDistance.value = calculateDistance(dummy.position);
          if (currentDistance.value < 2) {
            const { x, z } = bendModel(dummy.position);
            if (dummy.rotation.x !== x && dummy.rotation.z !== z) {
              dummy.rotation.x = x;
              dummy.rotation.z = z;
              dummy.updateMatrix();

              io.setMatrixAt(i, dummy.matrix);
              io.instanceMatrix.needsUpdate = true;
            }
          }
        }
        countHalfAnimation.value = 0;
      }
    }
  });
}
</script>

<template>
  <primitive v-for="(model, index) in models" :object="model" :key="index" />
</template>
