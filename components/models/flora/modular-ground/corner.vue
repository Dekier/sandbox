<script setup lang="ts">
import {
  MeshLambertMaterial,
  Object3D,
  ShaderMaterial,
  DynamicDrawUsage,
} from "three";
const { nodes } = await useGLTF("/models/ground.glb", { draco: true });
const storeModularGround = useModularGroundStore();
const { groundCornerList } = storeToRefs(storeModularGround);

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
const instanceMeshCornerRef = shallowRef(null);
const instanceMeshCorner2Ref = shallowRef(null);
let dummy = new Object3D();
watch(instanceMeshCornerRef, () => {
  setMeshCorner();
});
watch(
  () => groundCornerList.value.length,
  () => {
    setMeshCorner();
  }
);

const setMeshCorner = () => {
  instanceMeshCornerRef.value.instanceMatrix.setUsage(DynamicDrawUsage);
  instanceMeshCornerRef.value.count = groundCornerList.value.length;
  instanceMeshCorner2Ref.value.instanceMatrix.setUsage(DynamicDrawUsage);
  instanceMeshCorner2Ref.value.count = groundCornerList.value.length;
  for (let i = 0; i < groundCornerList.value.length; i++) {
    dummy.position.set(
      groundCornerList.value[i].positionX,
      0.0,
      groundCornerList.value[i].positionZ
    );

    if (groundCornerList.value[i].side === "top-left") {
      dummy.rotation.y = -Math.PI;
    } else if (groundCornerList.value[i].side === "bottom-left") {
      dummy.rotation.y = -Math.PI / 2;
    } else if (groundCornerList.value[i].side === "top-right") {
      dummy.rotation.y = Math.PI / 2;
    } else if (groundCornerList.value[i].side === "bottom-right") {
      dummy.rotation.y = 0;
    }
    dummy.updateMatrix();
    instanceMeshCornerRef.value.setMatrixAt(i, dummy.matrix);
    instanceMeshCorner2Ref.value.setMatrixAt(i, dummy.matrix);
  }

  instanceMeshCornerRef.value.instanceMatrix.needsUpdate = true;
  instanceMeshCornerRef.value.computeBoundingSphere();

  instanceMeshCorner2Ref.value.instanceMatrix.needsUpdate = true;
  instanceMeshCorner2Ref.value.computeBoundingSphere();
};
</script>

<template>
  <TresInstancedMesh
    ref="instanceMeshCornerRef"
    :args="[props.groundGeometry, props.groundMaterial, 500]"
  />

  <TresInstancedMesh
    :receiveShadow="true"
    ref="instanceMeshCorner2Ref"
    :args="[props.sandGeometry, props.sandMaterial, 500]"
  />
</template>
