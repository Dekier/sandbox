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
import { Precipitation } from "@tresjs/cientos";
import vertexShader from "@/src/shaders/leaves-tree/vertex.glsl";
const { newSetModel } = useModelSettings();
const storeGeneral = useGeneralStore();
const { scene } = useTresContext();

const { scene: modelScene, nodes } = await useGLTF("/models/big-rock.glb", {
  draco: true,
});
console.log(nodes);
const modelRock = nodes.rock;
newSetModel(modelRock);

const props = defineProps({
  seaModularList: {
    type: Array,
    required: true,
  },
});

const loader = new TextureLoader();
const alphaMap = loader.load("/materials/leaves/leaves.png");
const instanceMeshRockRef = shallowRef(null);

const dummy = new Object3D();
const matrix = new Matrix4();
const currentDistance = ref(0);

watch(instanceMeshRockRef, (value) => {
  if (!value) return;
  setMeshRock();
});

watch(
  () => props.seaModularList.length,
  () => {
    setMeshRock();
  }
);

const setMeshRock = () => {
  instanceMeshRockRef.value.instanceMatrix.setUsage(DynamicDrawUsage);
  instanceMeshRockRef.value.count = props.seaModularList.length;
  for (let i = 0; i < props.seaModularList.length; i++) {
    dummy.position.set(
      props.seaModularList[i].positionX,
      -1.0,
      props.seaModularList[i].positionZ
    );

    dummy.updateMatrix();
    instanceMeshRockRef.value.setMatrixAt(i, dummy.matrix);
  }
  instanceMeshRockRef.value.instanceMatrix.needsUpdate = true;
  instanceMeshRockRef.value.computeBoundingSphere();
};
</script>

<template>
  <TresInstancedMesh
    :castShadow="true"
    :receiveShadow="true"
    ref="instanceMeshRockRef"
    :args="[modelRock.geometry, modelRock.material, 12]"
  />
</template>
