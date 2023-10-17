<script setup lang="ts">
import { DoubleSide, Object3D, InstancedMesh, Matrix4 } from "three";
const controlsStore = useControlsStore();
const { isMovingCharacter } = storeToRefs(controlsStore);
const { bendModel, calculateDistance } = useUtils();
const { nodes } = await useGLTF("/models/grass3.glb", {
  draco: true,
});

const models: InstancedMesh[] = [];
const instancesCount = ref(400);
if (nodes.grass004) {
  const geometry = nodes.grass004.geometry;
  const material = nodes.grass004.material!.clone();
  const positionY = nodes.grass004.position.y;

  let dummy = new Object3D();
  let mat4 = new Matrix4();

  const { scene } = useTresContext();
  let io = new InstancedMesh(geometry, material, instancesCount.value);
  for (let i = 0; i < instancesCount.value; i++) {
    dummy.position.set(
      Math.random() * 10 + 29 - Math.random(),
      positionY,
      Math.random() * 10 + -12 - Math.random()
    );
    dummy.scale.set(1.7, 1.7, 1.7);
    dummy.updateMatrix();
    io.setMatrixAt(i, dummy.matrix);
    io.receiveShadow = true;
    io.castShadow = true;
    io.material.side = DoubleSide;
  }
  scene.value.add(io);

  const { onBeforeLoop } = useRenderLoop();
  const currentDistance = ref(0);
  onBeforeLoop(() => {
    if (isMovingCharacter.value) {
      for (let i = 0; i < instancesCount.value; i++) {
        io.getMatrixAt(i, mat4);
        mat4.decompose(dummy.position, dummy.quaternion, dummy.scale);
        currentDistance.value = calculateDistance(dummy.position);

        if (currentDistance.value < 2) {
          const { x, z } = bendModel(dummy.position);

          dummy.rotation.x = lerp(dummy.rotation.x, x, 0.08);
          dummy.rotation.z = lerp(dummy.rotation.z, z, 0.08);

          dummy.updateMatrix();
          io.setMatrixAt(i, dummy.matrix);
          io.instanceMatrix.needsUpdate = true;
        }
      }
    }
  });
  const lerp = (start: number, end: number, alpha: number): number => {
    return start * (1 - alpha) + end * alpha;
  };
}
</script>

<template>
  <primitive v-for="(model, index) in models" :object="model" :key="index" />
</template>
