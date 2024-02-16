<script setup lang="ts">
import {
  MeshLambertMaterial,
  Object3D,
  Color,
  TextureLoader,
  UniformsLib,
  ShaderMaterial,
  Vector3,
} from "three";
import { useGLTF } from "@tresjs/cientos";
const { nodes } = await useGLTF("/models/ground.glb", { draco: true });
const storeGeneral = useGeneralStore();
const { color, colorSand } = storeToRefs(storeGeneral);
const storeModularGround = useModularGroundStore();
const {
  activeModularList,
  groundZeroList,
  groundOneSideList,
  groundCornerList,
  groundTwoSideList,
  groundThreeSideList,
} = storeToRefs(storeModularGround);
const { newSetModel } = useModelSettings();
const { scene } = useTresContext();
import { useModelSettings } from "~/composables/useModel";
const { setModel } = useModelSettings();
import vertexShader from "@/src/shaders/ground/vertex.glsl";
import fragmentShader from "@/src/shaders/ground/fragment.glsl";

storeModularGround.setGroundPiecesListsClear();
storeModularGround.setGroundPiecesLists();
watch(activeModularList, () => {
  storeModularGround.setGroundPiecesListsClear();
  storeModularGround.setGroundPiecesLists();
});
const loader = new TextureLoader();
const rough = loader.load("/materials/grass/color.webp");
const darkerFactor = 2.1;

const uniforms = {
  time: {
    value: 0,
  },
  roughMap: { value: rough },
  hexColor: {
    value: new Vector3(
      new Color(color.value).r / darkerFactor,
      new Color(color.value).g / darkerFactor,
      new Color(color.value).b / darkerFactor
    ),
  },
  ...UniformsLib.lights,
};

const groundMaterial = new ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
  lights: true,
});
const sandMaterial = new MeshLambertMaterial({
  color: new Color(colorSand.value),
});
sandMaterial.castShadow = true;
sandMaterial.receiveShadow = true;

watch(color, (value) => {
  groundMaterial.uniforms.hexColor.value = new Vector3(
    new Color(value).r / darkerFactor,
    new Color(value).g / darkerFactor,
    new Color(value).b / darkerFactor
  );
});

watch(colorSand, (value) => {
  sandMaterial.color = new Color(value);
});

const instanceMeshRef = shallowRef(null);
let dummy = new Object3D();

watch(instanceMeshRef, (value) => {
  if (!value) return;
  for (let i = 0; i < groundZeroList.value.length; i++) {
    dummy.position.set(
      groundZeroList.value[i].positionX,
      0.0,
      groundZeroList.value[i].positionZ
    );

    dummy.updateMatrix();
    value.setMatrixAt(i, dummy.matrix);
  }
});

const instanceMeshOneSideRef = shallowRef(null);
const instanceMeshOneSide2Ref = shallowRef(null);
watch(instanceMeshOneSideRef, (value) => {
  if (!value) return;
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
    value.setMatrixAt(i, dummy.matrix);
    instanceMeshOneSide2Ref.value.setMatrixAt(i, dummy.matrix);
  }
});

const instanceMeshCornerSideRef = shallowRef(null);
const instanceMeshCornerSide2Ref = shallowRef(null);
watch(instanceMeshCornerSideRef, (value) => {
  if (!value) return;
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
    value.setMatrixAt(i, dummy.matrix);
    instanceMeshCornerSide2Ref.value.setMatrixAt(i, dummy.matrix);
  }
});

const instanceMeshTwoSideRef = shallowRef(null);
const instanceMeshTwoSide2Ref = shallowRef(null);
watch(instanceMeshTwoSideRef, (value) => {
  if (!value) return;
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
    value.setMatrixAt(i, dummy.matrix);
    instanceMeshTwoSide2Ref.value.setMatrixAt(i, dummy.matrix);
  }
});

const instanceMeshThreeSideRef = shallowRef(null);
const instanceMeshThreeSide2Ref = shallowRef(null);
watch(instanceMeshThreeSideRef, (value) => {
  if (!value) return;
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
    value.setMatrixAt(i, dummy.matrix);
    instanceMeshThreeSide2Ref.value.setMatrixAt(i, dummy.matrix);
  }
});

let groundThreeSideListKey = 1;
watch(groundThreeSideList, () => {
  groundThreeSideListKey++;
});

let groundTwoSideListKey = 1;
watch(groundTwoSideList, () => {
  groundTwoSideListKey++;
});

let groundCornerListKey = 1;
watch(groundCornerList, () => {
  groundCornerListKey++;
});

let groundOneSideListKey = 1;
watch(groundOneSideList, () => {
  groundOneSideListKey++;
});

let groundZeroListKey = 1;
watch(groundZeroList, () => {
  groundZeroListKey++;
});
</script>

<template>
  <TresInstancedMesh
    v-if="groundZeroList.length"
    :key="'instanceMeshRef' + groundZeroListKey"
    ref="instanceMeshRef"
    :args="[nodes.groundZero.geometry, groundMaterial, groundZeroList.length]"
  />

  <TresInstancedMesh
    v-if="groundOneSideList.length"
    :key="'instanceMeshOneSideRef' + groundTwoSideListKey"
    ref="instanceMeshOneSideRef"
    :args="[nodes.Cube068.geometry, groundMaterial, groundOneSideList.length]"
  />

  <TresInstancedMesh
    v-if="groundOneSideList.length"
    :receiveShadow="true"
    :key="'instanceMeshOneSide2Ref' + groundTwoSideListKey"
    ref="instanceMeshOneSide2Ref"
    :args="[nodes.Cube068_1.geometry, sandMaterial, groundOneSideList.length]"
  />

  <TresInstancedMesh
    v-if="groundCornerList.length"
    :key="'instanceMeshCornerSideRef' + groundCornerListKey"
    ref="instanceMeshCornerSideRef"
    :args="[nodes.Cube069.geometry, groundMaterial, groundCornerList.length]"
  />

  <TresInstancedMesh
    v-if="groundCornerList.length"
    :receiveShadow="true"
    :key="'instanceMeshCornerSide2Ref' + groundCornerListKey"
    ref="instanceMeshCornerSide2Ref"
    :args="[nodes.Cube069_1.geometry, sandMaterial, groundCornerList.length]"
  />

  <TresInstancedMesh
    v-if="groundTwoSideList.length"
    :key="'instanceMeshTwoSideRef' + groundTwoSideListKey"
    ref="instanceMeshTwoSideRef"
    :args="[nodes.Cube074.geometry, groundMaterial, groundTwoSideList.length]"
  />

  <TresInstancedMesh
    v-if="groundTwoSideList.length"
    :receiveShadow="true"
    :key="'instanceMeshTwoSideRef' + '2' + groundTwoSideListKey"
    ref="instanceMeshTwoSide2Ref"
    :args="[nodes.Cube074_1.geometry, sandMaterial, groundTwoSideList.length]"
  />

  <TresInstancedMesh
    v-if="groundThreeSideList.length"
    :key="'instanceMeshThreeSideRef' + groundThreeSideListKey"
    ref="instanceMeshThreeSideRef"
    :args="[nodes.Cube070.geometry, groundMaterial, groundThreeSideList.length]"
  />

  <TresInstancedMesh
    v-if="groundThreeSideList.length"
    :receiveShadow="true"
    :key="'instanceMeshThreeSide2Ref' + groundThreeSideListKey"
    ref="instanceMeshThreeSide2Ref"
    :args="[nodes.Cube070_1.geometry, sandMaterial, groundThreeSideList.length]"
  />
</template>
