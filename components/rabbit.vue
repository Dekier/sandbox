<script setup lang="ts">
import { useModelSettings } from "~/composables/useModel";
const { setModel } = useModelSettings();
// const {
//   scene: modelScene,
//   nodes,
//   animations,
// } = await useGLTF("/models/rabbit.glb", {
//   draco: true,
// });
// const { actions } = useAnimations(animations, modelScene);
// actions.desk.play();
// actions.desk2.play();
// const {
//   scene: modelScene,
//   nodes,
//   animations,
// } = await useGLTF("/models/new-grass2.glb", {
//   draco: true,
// });
// let heh = [];
// modelScene.traverse((lol) => {
//   heh.push({ x: lol.position.x, y: lol.position.y });
// });
// console.log(heh);
// for (let index = 0; index < nodes.length; index++) {
//   console.log(nodes);
// }
// const model = nodes.Plane002;
// setModel(model);
// const modelDesk = nodes.desk2;
// setModel(modelDesk);
</script>

<template>
  <!-- <primitive :object="model" /> -->
  <!-- <primitive :object="modelDesk" /> -->
</template>
