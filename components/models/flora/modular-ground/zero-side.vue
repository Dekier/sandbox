<script setup lang="ts">
import {
  MeshLambertMaterial,
  Object3D,
  Color,
  TextureLoader,
  UniformsLib,
  ShaderMaterial,
  Vector3,
  DynamicDrawUsage,
} from "three";
import { useGLTF } from "@tresjs/cientos";
const { nodes } = await useGLTF("/models/ground.glb", { draco: true });
const storeModularGround = useModularGroundStore();
const { groundZeroList } = storeToRefs(storeModularGround);

const props = defineProps({
  groundGeometry: {
    type: Object,
    required: true,
  },
  groundMaterial: {
    type: ShaderMaterial,
    required: true,
  },
});
const instanceMeshZeroSideRef = shallowRef(null);
let dummy = new Object3D();
watch(instanceMeshZeroSideRef, () => {
  setMeshZeroSide();
});
watch(
  () => groundZeroList.value.length,
  () => {
    setMeshZeroSide();
  }
);

const setMeshZeroSide = () => {
  instanceMeshZeroSideRef.value.instanceMatrix.setUsage(DynamicDrawUsage);
  instanceMeshZeroSideRef.value.count = groundZeroList.value.length;
  for (let i = 0; i < groundZeroList.value.length; i++) {
    dummy.position.set(
      groundZeroList.value[i].positionX,
      0.0,
      groundZeroList.value[i].positionZ
    );

    if (groundZeroList.value[i].side === "bottom") {
      dummy.rotation.y = -Math.PI;
    } else if (groundZeroList.value[i].side === "top") {
      dummy.rotation.y = 0;
    } else if (groundZeroList.value[i].side === "left") {
      dummy.rotation.y = Math.PI / 2;
    } else if (groundZeroList.value[i].side === "right") {
      dummy.rotation.y = -Math.PI / 2;
    }
    dummy.updateMatrix();
    instanceMeshZeroSideRef.value.setMatrixAt(i, dummy.matrix);
  }
  instanceMeshZeroSideRef.value.instanceMatrix.needsUpdate = true;
  instanceMeshZeroSideRef.value.computeBoundingSphere();
};
</script>

<template>
  <TresInstancedMesh
    ref="instanceMeshZeroSideRef"
    :args="[props.groundGeometry, props.groundMaterial, 500]"
  />
</template>
