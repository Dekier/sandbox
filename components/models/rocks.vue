<script setup lang="ts">
import { Object3D, InstancedMesh, Matrix4 } from "three";
const controlsStore = useControlsStore();
const { isMovingCharacter } = storeToRefs(controlsStore);
const { nodes } = await useGLTF("/models/rock.glb", {
  draco: true,
});

const instancesCount = ref(10);

const { isMobile } = useDevice();

if (nodes.rock) {
  const geometry = nodes.rock.geometry;
  const material = nodes.rock.material!.clone();
  const positionY = nodes.rock.position.y;

  let dummy = new Object3D();

  const { scene } = useTresContext();
  let io = new InstancedMesh(geometry, material, instancesCount.value);
  for (let i = 0; i < instancesCount.value; i++) {
    dummy.position.set(
      Math.random() * 10 - 20 - Math.random(),
      positionY,
      Math.random() * 10 + -12 - Math.random()
    );
    dummy.rotation.y = Math.random() * 10;
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    io.setMatrixAt(i, dummy.matrix);
    io.receiveShadow = true;
    io.castShadow = true;
  }
  scene.value.add(io);
}
</script>

<template></template>
