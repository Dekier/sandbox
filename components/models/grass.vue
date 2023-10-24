<script setup lang="ts">
import { Object3D, InstancedMesh, Matrix4, DoubleSide } from "three";

const controlsStore = useControlsStore();
const { isMovingCharacter } = storeToRefs(controlsStore);

const { bendModel, calculateDistance } = useUtils();
const { nodes } = await useGLTF("/models/grass.glb", {
  draco: true,
});
const models: InstancedMesh[] = [];
const instancesCount = ref(400);

const { isMobile } = useDevice();

if (isMobile) {
  instancesCount.value = 100;
}
if (nodes.grass) {
  const geometry = nodes.grass.geometry;
  const material = nodes.grass.material!.clone();
  const positionY = nodes.grass.position.y;

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
    dummy.scale.set(2.2, 2.2, 2.2);
    dummy.rotation.set(0, 0, 0); // Set initial rotation
    dummy.updateMatrix();
    io.setMatrixAt(i, dummy.matrix);
    io.receiveShadow = true;
    io.castShadow = true;
    io.material.side = DoubleSide;
  }
  scene.value.add(io);

  const currentDistance = ref(0);
  const { onBeforeLoop } = useRenderLoop();
  onBeforeLoop(() => {
    for (let i = 0; i < instancesCount.value; i++) {
      io.getMatrixAt(i, mat4);
      mat4.decompose(dummy.position, dummy.quaternion, dummy.scale);
      currentDistance.value = calculateDistance(dummy.position);

      if (currentDistance.value < 2) {
        const { x, z } = bendModel(dummy.position);

        dummy.rotation.x = lerp(dummy.rotation.x, x, 0.1);
        dummy.rotation.z = lerp(dummy.rotation.z, z, 0.1);

        dummy.updateMatrix();
        io.setMatrixAt(i, dummy.matrix);
        io.instanceMatrix.needsUpdate = true;
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
