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
const { groundThreeSideList } = storeToRefs(storeModularGround);

const props = defineProps({
  groundGeometry: {
    type: Object,
    required: true,
  },
  sandGeometry: {
    type: Object,
    required: true,
  },
  groundMaterial: {
    type: ShaderMaterial,
    required: true,
  },
  sandMaterial: {
    type: MeshLambertMaterial,
    required: true,
  },
});
const instanceMeshThreeSideRef = shallowRef(null);
const instanceMeshThreeSide2Ref = shallowRef(null);
let dummy = new Object3D();
watch(instanceMeshThreeSideRef, () => {
  setMeshThreeSide();
});
watch(
  () => groundThreeSideList.value.length,
  () => {
    setMeshThreeSide();
  }
);

const setMeshThreeSide = () => {
  instanceMeshThreeSideRef.value.instanceMatrix.setUsage(DynamicDrawUsage);
  instanceMeshThreeSideRef.value.count = groundThreeSideList.value.length;
  instanceMeshThreeSide2Ref.value.instanceMatrix.setUsage(DynamicDrawUsage);
  instanceMeshThreeSide2Ref.value.count = groundThreeSideList.value.length;
  for (let i = 0; i < groundThreeSideList.value.length; i++) {
    dummy.position.set(
      groundThreeSideList.value[i].positionX,
      0.0,
      groundThreeSideList.value[i].positionZ
    );

    if (groundThreeSideList.value[i].side === "left") {
      dummy.rotation.y = -Math.PI / 2;
    } else if (groundThreeSideList.value[i].side === "right") {
      dummy.rotation.y = Math.PI / 2;
    } else if (groundThreeSideList.value[i].side === "top") {
      dummy.rotation.y = Math.PI;
    } else if (groundThreeSideList.value[i].side === "bottom") {
      dummy.rotation.y = 0;
    }
    dummy.updateMatrix();
    instanceMeshThreeSideRef.value.setMatrixAt(i, dummy.matrix);
    instanceMeshThreeSide2Ref.value.setMatrixAt(i, dummy.matrix);
  }

  instanceMeshThreeSideRef.value.instanceMatrix.needsUpdate = true;
  instanceMeshThreeSideRef.value.computeBoundingSphere();

  instanceMeshThreeSide2Ref.value.instanceMatrix.needsUpdate = true;
  instanceMeshThreeSide2Ref.value.computeBoundingSphere();
};
</script>

<template>
  <TresInstancedMesh
    ref="instanceMeshThreeSideRef"
    :args="[props.groundGeometry, props.groundMaterial, 500]"
  />

  <TresInstancedMesh
    :receiveShadow="true"
    ref="instanceMeshThreeSide2Ref"
    :args="[props.sandGeometry, props.sandMaterial, 500]"
  />
</template>
