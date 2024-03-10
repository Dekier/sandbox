<script setup lang="ts">
import { Behaviour, InstancedMesh2 } from "./InstancedMesh2";

const count = 100000;
const terrainSize = 450;

const { scene: modelScene, nodes } = await useGLTF("/models/tree-test.glb", {
  draco: true,
});
const modelWood = nodes.tree;

const trees = new InstancedMesh2({
  geometry: modelWood.geometry,
  material: modelWood.material,
  count,
  behaviour: Behaviour.static,
  onInstanceCreation: (obj, index) => {
    obj.position
      .setX(Math.random() * terrainSize - terrainSize / 2)
      .setZ(Math.random() * terrainSize - terrainSize / 2);
    obj.scale.setScalar(Math.random() * 0.1 + 0.1);
    obj
      .rotateY(Math.random() * Math.PI * 2)
      .rotateZ(Math.random() * 0.3 - 0.15);
  },
});
const { scene, camera } = useTresContext();
scene.value.add(trees);
const { onBeforeLoop } = useRenderLoop();
onBeforeLoop(() => {
  trees.updateCulling(camera.value);
  // console.log(trees.count);
});
</script>
<template></template>
