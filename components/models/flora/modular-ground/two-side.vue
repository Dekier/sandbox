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
const { nodes } = await useGLTF("/models/ground.glb", { draco: true });
const storeModularGround = useModularGroundStore();
const { groundTwoSideList } = storeToRefs(storeModularGround);

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
const instanceMeshTwoSideRef = shallowRef(null);
const instanceMeshTwoSide2Ref = shallowRef(null);
let dummy = new Object3D();
watch(instanceMeshTwoSideRef, () => {
  setMeshTwoSide();
});
watch(
  () => groundTwoSideList.value.length,
  () => {
    setMeshTwoSide();
  }
);

const setMeshTwoSide = () => {
  instanceMeshTwoSideRef.value.instanceMatrix.setUsage(DynamicDrawUsage);
  instanceMeshTwoSideRef.value.count = groundTwoSideList.value.length;
  instanceMeshTwoSide2Ref.value.instanceMatrix.setUsage(DynamicDrawUsage);
  instanceMeshTwoSide2Ref.value.count = groundTwoSideList.value.length;
  for (let i = 0; i < groundTwoSideList.value.length; i++) {
    dummy.position.set(
      groundTwoSideList.value[i].positionX,
      0.0,
      groundTwoSideList.value[i].positionZ
    );

    if (groundTwoSideList.value[i].side === "left-right") {
      dummy.rotation.y = -Math.PI / 2;
    } else if (groundTwoSideList.value[i].side === "top-bottom") {
      dummy.rotation.y = Math.PI;
    }
    dummy.updateMatrix();
    instanceMeshTwoSideRef.value.setMatrixAt(i, dummy.matrix);
    instanceMeshTwoSide2Ref.value.setMatrixAt(i, dummy.matrix);
  }

  instanceMeshTwoSideRef.value.instanceMatrix.needsUpdate = true;
  instanceMeshTwoSideRef.value.computeBoundingSphere();

  instanceMeshTwoSide2Ref.value.instanceMatrix.needsUpdate = true;
  instanceMeshTwoSide2Ref.value.computeBoundingSphere();
};
</script>

<template>
  <TresInstancedMesh
    ref="instanceMeshTwoSideRef"
    :args="[props.groundGeometry, props.groundMaterial, 500]"
  />

  <TresInstancedMesh
    :receiveShadow="true"
    ref="instanceMeshTwoSide2Ref"
    :args="[props.sandGeometry, props.sandMaterial, 500]"
  />
</template>
