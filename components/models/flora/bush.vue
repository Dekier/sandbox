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
  MeshDepthMaterial,
} from "three";
import { useGLTF } from "@tresjs/cientos";
const storeGeneral = useGeneralStore();
const controlsStore = useControlsStore();
const { isMovingCharacter } = storeToRefs(controlsStore);
const { $gsap } = useNuxtApp();
const { colorTrees } = storeToRefs(storeGeneral);
const { bendModel, calculateDistance } = useUtils();
const props = defineProps({
  bushList: {
    type: Array,
    required: true,
  },
});
const { scene: modelScene, nodes } = await useGLTF("/models/bush-test.glb", {
  draco: true,
});
const { scene } = useTresContext();
const { onBeforeLoop } = useRenderLoop();
const modelLeaves = nodes.leaves003;
const modelWood = nodes.wood;
import vertexShader from "@/src/shaders/leaves-small/vertex.glsl";
const loader = new TextureLoader();
const alphaMap = loader.load("/materials/leaves/leaves.png");

const instanceMeshWoodRef = shallowRef(null);
const instanceMeshLeavesRef = shallowRef(null);

watch(colorTrees, (value) => {
  instanceMeshLeavesRef.value.material.color = new Color(value);
});
const dummy = new Object3D();
const matrix = new Matrix4();
const currentDistance = ref(0);
onBeforeLoop(() => {
  for (let i = 0; i < props.bushList.length; i++) {
    instanceMeshWoodRef.value.getMatrixAt(i, matrix);
    instanceMeshLeavesRef.value.getMatrixAt(i, matrix);
    matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
    currentDistance.value = calculateDistance(dummy.position);
    if (currentDistance.value < 3) {
      const { x, z } = bendModel(dummy.position);
      dummy.rotation.x = lerp(dummy.rotation.x, x, 0.04);
      dummy.rotation.z = lerp(dummy.rotation.z, z, 0.04);
      dummy.updateMatrix();
      instanceMeshWoodRef.value.setMatrixAt(i, dummy.matrix);
      instanceMeshWoodRef.value.instanceMatrix.needsUpdate = true;
      instanceMeshLeavesRef.value.setMatrixAt(i, dummy.matrix);
      instanceMeshLeavesRef.value.instanceMatrix.needsUpdate = true;
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

watch(instanceMeshLeavesRef, (value) => {
  if (!value) return;
  setMeshLeaves();
});

watch(
  () => props.bushList.length,
  () => {
    setMesh();
    setMeshLeaves();
  }
);

const setMesh = () => {
  instanceMeshWoodRef.value.instanceMatrix.setUsage(DynamicDrawUsage);
  instanceMeshWoodRef.value.count = props.bushList.length;
  for (let i = 0; i < props.bushList.length; i++) {
    dummy.position.set(
      props.bushList[i].positionX,
      0.0,
      props.bushList[i].positionZ
    );

    dummy.updateMatrix();
    instanceMeshWoodRef.value.setMatrixAt(i, dummy.matrix);
  }
  instanceMeshWoodRef.value.instanceMatrix.needsUpdate = true;
  instanceMeshWoodRef.value.computeBoundingSphere();
};

const setMeshLeaves = () => {
  instanceMeshLeavesRef.value.instanceMatrix.setUsage(DynamicDrawUsage);
  instanceMeshLeavesRef.value.count = props.bushList.length;
  for (let i = 0; i < props.bushList.length; i++) {
    dummy.position.set(
      props.bushList[i].positionX,
      0.0,
      props.bushList[i].positionZ
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
    ref="instanceMeshWoodRef"
    :args="[modelWood.geometry, modelWood.material, 1000]"
  />
  <TresInstancedMesh
    :castShadow="true"
    :receiveShadow="true"
    ref="instanceMeshLeavesRef"
    :args="[modelLeaves.geometry, null, 1000]"
  >
    <CustomShaderMaterial v-bind="materialProps" />
  </TresInstancedMesh>
</template>
