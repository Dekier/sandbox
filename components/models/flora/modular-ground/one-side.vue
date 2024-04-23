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
const { groundOneSideList } = storeToRefs(storeModularGround);

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
const instanceMeshOneSideRef = shallowRef(null);
const instanceMeshOneSide2Ref = shallowRef(null);
let dummy = new Object3D();
watch(instanceMeshOneSideRef, () => {
  setMeshOneSide();
});
watch(
  () => groundOneSideList.value.length,
  () => {
    setMeshOneSide();
  }
);

const setMeshOneSide = () => {
  instanceMeshOneSideRef.value.instanceMatrix.setUsage(DynamicDrawUsage);
  instanceMeshOneSideRef.value.count = groundOneSideList.value.length;
  instanceMeshOneSide2Ref.value.instanceMatrix.setUsage(DynamicDrawUsage);
  instanceMeshOneSide2Ref.value.count = groundOneSideList.value.length;
  for (let i = 0; i < groundOneSideList.value.length; i++) {
    dummy.position.set(
      groundOneSideList.value[i].positionX,
      0.0,
      groundOneSideList.value[i].positionZ
    );

    if (groundOneSideList.value[i].side === "bottom") {
      dummy.rotation.y = -Math.PI;
    } else if (groundOneSideList.value[i].side === "top") {
      dummy.rotation.y = 0;
    } else if (groundOneSideList.value[i].side === "left") {
      dummy.rotation.y = Math.PI / 2;
    } else if (groundOneSideList.value[i].side === "right") {
      dummy.rotation.y = -Math.PI / 2;
    }
    dummy.updateMatrix();
    instanceMeshOneSideRef.value.setMatrixAt(i, dummy.matrix);
    instanceMeshOneSide2Ref.value.setMatrixAt(i, dummy.matrix);
  }

  instanceMeshOneSideRef.value.instanceMatrix.needsUpdate = true;
  instanceMeshOneSideRef.value.computeBoundingSphere();

  instanceMeshOneSide2Ref.value.instanceMatrix.needsUpdate = true;
  instanceMeshOneSide2Ref.value.computeBoundingSphere();
};
</script>

<template>
  <TresInstancedMesh
    :castShadow="true"
    :receiveShadow="true"
    ref="instanceMeshOneSideRef"
    :args="[props.groundGeometry, props.groundMaterial, 500]"
  />

  <TresInstancedMesh
    :receiveShadow="true"
    :castShadow="true"
    ref="instanceMeshOneSide2Ref"
    :args="[props.sandGeometry, props.sandMaterial, 500]"
  />
</template>
