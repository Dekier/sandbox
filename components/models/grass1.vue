<script setup lang="ts">
import { Object3D, InstancedMesh, Matrix4 } from "three";
const controlsStore = useControlsStore();
const { isMovingCharacter } = storeToRefs(controlsStore);
const { bendModel, calculateDistance } = useUtils();
const { nodes } = await useGLTF("/models/grass-flat-2.glb", {
  draco: true,
});

const instancesCount = ref(40000);

const { isMobile } = useDevice();

if (isMobile) {
  instancesCount.value = 100;
}

const model = nodes.grass008;
if (model) {
  const geometry = model.geometry;
  const material = model.material!.clone();
  const positionY = model.position.y;

  let dummy = new Object3D();
  let mat4 = new Matrix4();

  const { onBeforeLoop } = useRenderLoop();

  const { scene } = useTresContext();
  let io = new InstancedMesh(geometry, material, instancesCount.value);
  for (let i = 0; i < instancesCount.value; i++) {
    // dummy.position.set(
    //   Math.random() * 10 + 29 - Math.random(),
    //   positionY,
    //   Math.random() * 10 + -12 - Math.random()
    // );
    dummy.position.set(
      Math.random() * 100 - 50,
      positionY,
      Math.random() * 100 - 50
    );
    dummy.scale.set(1.9, 1.9, 1.9);
    dummy.updateMatrix();
    io.setMatrixAt(i, dummy.matrix);
    io.receiveShadow = true;
    io.castShadow = true;
  }
  scene.value.add(io);

  const currentDistance = ref(0);
  onBeforeLoop(() => {
    // for (let i = 0; i < instancesCount.value; i++) {
    //   io.getMatrixAt(i, mat4);
    //   mat4.decompose(dummy.position, dummy.quaternion, dummy.scale);
    //   currentDistance.value = calculateDistance(dummy.position);
    //   if (currentDistance.value < 2) {
    //     const { x, z } = bendModel(dummy.position);
    //     dummy.rotation.x = lerp(dummy.rotation.x, x, 0.1);
    //     dummy.rotation.z = lerp(dummy.rotation.z, z, 0.1);
    //     dummy.updateMatrix();
    //     io.setMatrixAt(i, dummy.matrix);
    //     io.instanceMatrix.needsUpdate = true;
    //   }
    // }
  });
  const lerp = (start: number, end: number, alpha: number): number => {
    return start * (1 - alpha) + end * alpha;
  };
}
</script>

<template></template>
