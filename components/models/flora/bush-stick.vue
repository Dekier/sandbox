<script setup lang="ts">
import {
  TextureLoader,
  ShaderMaterial,
  Vector3,
  Color,
  UniformsLib,
  Matrix4,
  DoubleSide,
  MeshLambertMaterial,
  Object3D,
  InstancedMesh,
  DynamicDrawUsage,
} from "three";
import { useGLTF } from "@tresjs/cientos";
const storeGeneral = useGeneralStore();
const controlsStore = useControlsStore();
const { isMovingCharacter } = storeToRefs(controlsStore);
const { $gsap } = useNuxtApp();
const { colorTrees } = storeToRefs(storeGeneral);
const { bendModel, calculateDistance } = useUtils();
const props = defineProps({
  bushStickList: {
    type: Array,
    required: true,
  },
});
const {
  scene: modelScene,
  nodes,
  animations,
} = await useGLTF("/models/bush-stick.glb", { draco: true });
const { actions } = useAnimations(animations, modelScene);
actions.stick.play();
const modelLeaves = nodes.leavesStick;
const modelWood = nodes.woodStick;

const loader = new TextureLoader();
const alphaMap = loader.load("/materials/leaves/leaves.png");

const instanceMeshWoodRef = shallowRef(null);
let instaceMeshWood = null;

const bushMaterial = new MeshLambertMaterial({
  color: new Color(colorTrees.value),
  alphaMap: alphaMap,
  alphaTest: 0.3,
  side: DoubleSide,
});

modelLeaves.material?.dispose();
modelLeaves.material = bushMaterial;

modelLeaves.castShadow = true;
modelLeaves.receiveShadow = true;

watch(colorTrees, (value) => {
  bushMaterial.color = new Color(value);
});
let dummyWood = new Object3D();

let dummyLeaves = new Object3D();
let instancesLeaves = null;

const { scene } = useTresContext();
const setIntancesMesh = () => {
  dummyLeaves = new Object3D();
  instancesLeaves = new InstancedMesh(
    modelLeaves.geometry,
    modelLeaves.material,
    1000
  );
  instancesLeaves.castShadow = true;
  instancesLeaves.receiveShadow = true;

  instancesLeaves.morphTargetInfluences = modelLeaves.morphTargetInfluences;
  instancesLeaves.morphTargetDictionary = modelLeaves.morphTargetDictionary;

  for (let i = 0; i < props.bushStickList.length; i++) {
    dummyLeaves.position.set(
      props.bushStickList[i].positionX,
      modelLeaves.position.y,
      props.bushStickList[i].positionZ
    );
    dummyLeaves.updateMatrix();
    instancesLeaves.setMatrixAt(i, dummyLeaves.matrix);
  }
  scene.value.add(instancesLeaves);
};

const updateIntancesMeshLeaves = () => {
  instancesLeaves.instanceMatrix.setUsage(DynamicDrawUsage);
  instancesLeaves.count = props.bushStickList.length;
  for (let i = 0; i < props.bushStickList.length; i++) {
    dummyLeaves.position.set(
      props.bushStickList[i].positionX,
      modelLeaves.position.y,
      props.bushStickList[i].positionZ
    );
    dummyLeaves.updateMatrix();
    instancesLeaves.setMatrixAt(i, dummyLeaves.matrix);
  }
  instancesLeaves.instanceMatrix.needsUpdate = true;
  instancesLeaves.computeBoundingSphere();
};

setIntancesMesh();
updateIntancesMeshLeaves();

const { onBeforeLoop } = useRenderLoop();
let matWood = new Matrix4();
let matLeaves = new Matrix4();
const currentDistance = ref(0);
onBeforeLoop(() => {
  for (let i = 0; i < props.bushStickList.length; i++) {
    instanceMeshWoodRef.value.getMatrixAt(i, matWood);
    matWood.decompose(
      dummyWood.position,
      dummyWood.quaternion,
      dummyWood.scale
    );

    instancesLeaves.getMatrixAt(i, matLeaves);
    matLeaves.decompose(
      dummyLeaves.position,
      dummyLeaves.quaternion,
      dummyLeaves.scale
    );

    currentDistance.value = calculateDistance(dummyWood.position);
    if (currentDistance.value < 7) {
      const { x, z } = bendModel(dummyWood.position);
      dummyWood.rotation.x = lerp(dummyWood.rotation.x, x, 0.04);
      dummyWood.rotation.z = lerp(dummyWood.rotation.z, z, 0.04);
      dummyWood.updateMatrix();
      instanceMeshWoodRef.value.setMatrixAt(i, dummyWood.matrix);
      instanceMeshWoodRef.value.instanceMatrix.needsUpdate = true;

      dummyLeaves.rotation.x = lerp(dummyLeaves.rotation.x, x, 0.04);
      dummyLeaves.rotation.z = lerp(dummyLeaves.rotation.z, z, 0.04);
      dummyLeaves.updateMatrix();
      instancesLeaves.setMatrixAt(i, dummyLeaves.matrix);
      instancesLeaves.instanceMatrix.needsUpdate = true;
    }
  }
});

const lerp = (start: number, end: number, alpha: number): number => {
  return start * (1 - alpha) + end * alpha;
};
watch(instanceMeshWoodRef, (value) => {
  if (!value) return;
  setMesh();
});

watch(
  () => props.bushStickList.length,
  () => {
    setMesh();
    updateIntancesMeshLeaves();
  }
);

const setMesh = () => {
  instanceMeshWoodRef.value.instanceMatrix.setUsage(DynamicDrawUsage);
  instanceMeshWoodRef.value.count = props.bushStickList.length;
  for (let i = 0; i < props.bushStickList.length; i++) {
    dummyWood.position.set(
      props.bushStickList[i].positionX,
      0.0,
      props.bushStickList[i].positionZ
    );

    dummyWood.updateMatrix();
    instanceMeshWoodRef.value.setMatrixAt(i, dummyWood.matrix);
  }
  instanceMeshWoodRef.value.instanceMatrix.needsUpdate = true;
  instanceMeshWoodRef.value.computeBoundingSphere();
};
</script>

<template>
  <TresInstancedMesh
    :castShadow="true"
    :receiveShadow="true"
    ref="instanceMeshWoodRef"
    :args="[modelWood.geometry, modelWood.material, 1000]"
  />
</template>
