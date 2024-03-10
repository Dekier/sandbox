<script setup lang="ts">
import {
  TextureLoader,
  ShaderMaterial,
  Vector3,
  Color,
  UniformsLib,
  DoubleSide,
  MeshLambertMaterial,
  InstancedMesh,
  Object3D,
  Vector2,
  Matrix4,
  DynamicDrawUsage,
} from "three";

const count = 100000;
const terrainSize = 450;

const { scene: modelScene, nodes } = await useGLTF("/models/tree-test.glb", {
  draco: true,
});
const modelWood = nodes.tree;
const instanceMeshWoodRef = ref();
watch(instanceMeshWoodRef, (value) => {
  if (!value) return;
  setMeshWood();
});

const dummy = new Object3D();
const setMeshWood = () => {
  instanceMeshWoodRef.value.instanceMatrix.setUsage(DynamicDrawUsage);
  instanceMeshWoodRef.value.count = count;

  for (let i = 0; i < count; i++) {
    const randomX = Math.random() * terrainSize - terrainSize / 2;
    const randomZ = Math.random() * terrainSize - terrainSize / 2;

    dummy.position.set(randomX, 0.0, randomZ);
    dummy.scale.setScalar(Math.random() * 0.1 + 0.1);

    dummy.updateMatrix();
    instanceMeshWoodRef.value.setMatrixAt(i, dummy.matrix);
  }

  instanceMeshWoodRef.value.instanceMatrix.needsUpdate = true;
  instanceMeshWoodRef.value.computeBoundingSphere();
};
</script>
<template>
  <TresInstancedMesh
    ref="instanceMeshWoodRef"
    :args="[modelWood.geometry, modelWood.material, count]"
  />
</template>
