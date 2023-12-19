<script setup lang="ts">
import {
  TextureLoader,
  ShaderMaterial,
  Vector3,
  Color,
  UniformsLib,
  DoubleSide,
  MeshStandardMaterial,
} from "three";
import { useGLTF } from "@tresjs/cientos";
const storeGeneral = useGeneralStore();
const { colorTrees } = storeToRefs(storeGeneral);

const { nodes } = await useGLTF("/models/tree.glb", { draco: true });
console.log(nodes);
const modelTree = nodes.tree;

modelTree.castShadow = true;
modelTree.receiveShadow = true;

import vertexShader from "@/src/shaders/leafs/vertex.glsl";
import fragmentShader from "@/src/shaders/leafs/fragment.glsl";

const loader = new TextureLoader();
const alphaMap = loader.load("/materials/leaves/leaves.webp");

const uniforms = {
  time: {
    value: 0,
  },
  alphaMap: { value: alphaMap },
  hexColor: {
    value: new Vector3(
      new Color(colorTrees.value).r,
      new Color(colorTrees.value).g,
      new Color(colorTrees.value).b
    ),
  },
  ...UniformsLib.lights,
};

const leavesMaterial = new ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
  lights: true,
  side: DoubleSide,
});
const lol = new MeshStandardMaterial({
  color: 0xdbc0a4,
});
const modelLeafs = nodes.leaves;
console.log(modelLeafs);
modelLeafs.material?.dispose();
modelLeafs.material = leavesMaterial;

modelLeafs.castShadow = false;
modelLeafs.receiveShadow = false;

watch(colorTrees, (value) => {
  leavesMaterial.uniforms.hexColor.value = new Vector3(
    new Color(value).r,
    new Color(value).g,
    new Color(value).b
  );
});
// setModel(model);
const { onLoop } = useRenderLoop();
onLoop(({ _delta, elapsed }) => {
  leavesMaterial.uniforms.time.value = elapsed;
  leavesMaterial.uniformsNeedUpdate = true;
});
</script>

<template>
  <primitive :object="modelTree" />
  <primitive :object="modelLeafs" />
</template>
