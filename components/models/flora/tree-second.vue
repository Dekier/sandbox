<script setup lang="ts">
import {
  TextureLoader,
  Vector3,
  Color,
  UniformsLib,
  DoubleSide,
  MeshLambertMaterial,
  Object3D,
  Matrix4,
  DynamicDrawUsage,
} from "three";
import vertexShader from "@/src/shaders/leaves-tree/vertex.glsl";
const storeGeneral = useGeneralStore();
const { colorTrees, settingsShadow } = storeToRefs(storeGeneral);
const { scene } = useTresContext();

const { scene: modelScene, nodes } = await useGLTF("/models/tree-2-test.glb", {
  draco: true,
});

const modelWood = nodes.tree2;
const modelLeaves = nodes.leaves2;

const props = defineProps({
  treeList: {
    type: Array,
    required: true,
  },
});

const loader = new TextureLoader();
const alphaMap = loader.load("/materials/leaves/leaves.png");
const instanceMeshWoodRef = shallowRef(null);
const instanceMeshLeavesRef = shallowRef(null);

watch(colorTrees, (value) => {
  instanceMeshLeavesRef.value.material.color = new Color(value);
});
const dummy = new Object3D();

watch(instanceMeshWoodRef, (value) => {
  if (!value) return;
  setMeshWood();
});

watch(instanceMeshLeavesRef, (value) => {
  if (!value) return;
  setMeshLeaves();
});

watch(
  () => props.treeList.length,
  () => {
    setMeshWood();
    setMeshLeaves();
  }
);

const setMeshWood = () => {
  instanceMeshWoodRef.value.instanceMatrix.setUsage(DynamicDrawUsage);
  instanceMeshWoodRef.value.count = props.treeList.length;
  for (let i = 0; i < props.treeList.length; i++) {
    dummy.position.set(
      props.treeList[i].positionX,
      0.0,
      props.treeList[i].positionZ
    );

    dummy.updateMatrix();
    instanceMeshWoodRef.value.setMatrixAt(i, dummy.matrix);
  }
  instanceMeshWoodRef.value.instanceMatrix.needsUpdate = true;
  instanceMeshWoodRef.value.computeBoundingSphere();
};

const setMeshLeaves = () => {
  instanceMeshLeavesRef.value.instanceMatrix.setUsage(DynamicDrawUsage);
  instanceMeshLeavesRef.value.count = props.treeList.length;
  for (let i = 0; i < props.treeList.length; i++) {
    dummy.position.set(
      props.treeList[i].positionX,
      0.0,
      props.treeList[i].positionZ
    );

    dummy.updateMatrix();
    instanceMeshLeavesRef.value.setMatrixAt(i, dummy.matrix);
  }
  instanceMeshLeavesRef.value.instanceMatrix.needsUpdate = true;
  instanceMeshLeavesRef.value.computeBoundingSphere();
  instanceMeshLeavesRef.value.material.alphaMap = alphaMap;
  instanceMeshLeavesRef.value.material.alphaTest = 0.3;
  instanceMeshLeavesRef.value.material.side = DoubleSide;
  instanceMeshLeavesRef.value.material.color = new Color(colorTrees.value);
};

const materialProps = {
  baseMaterial: MeshLambertMaterial,
  vertexShader,
  uniforms: {
    time: {
      value: 0,
    },
    u_WobbleAmplitude: { value: 0.07 },
    alphaMap: { value: alphaMap },
    alphaMapMoving: { value: null },
    hexColor: {
      value: new Vector3(
        new Color(colorTrees.value).r,
        new Color(colorTrees.value).g,
        new Color(colorTrees.value).b
      ),
    },
    ...UniformsLib.lights,
  },
};

const { onLoop } = useRenderLoop();
onMounted(async () => {
  await nextTick();

  onLoop(({ elapsed }) => {
    materialProps.uniforms.time.value = elapsed;
  });
});
</script>

<template>
  <TresInstancedMesh
    :castShadow="settingsShadow > 0"
    :receiveShadow="settingsShadow > 0"
    ref="instanceMeshWoodRef"
    :args="[modelWood.geometry, modelWood.material, 1000]"
  />
  <TresInstancedMesh
    :castShadow="settingsShadow > 0"
    :receiveShadow="settingsShadow > 0"
    ref="instanceMeshLeavesRef"
    :args="[modelLeaves.geometry, null, 1000]"
  >
    <CustomShaderMaterial v-bind="materialProps" />
  </TresInstancedMesh>
</template>
