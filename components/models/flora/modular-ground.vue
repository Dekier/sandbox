<script setup lang="ts">
import { MeshLambertMaterial, InstancedMesh, Object3D } from "three";
import { useGLTF } from "@tresjs/cientos";
const { nodes } = await useGLTF("/models/ground.glb", { draco: true });

const storeModularGround = useModularGroundStore();
const { activeModularList } = storeToRefs(storeModularGround);
const { newSetModel } = useModelSettings();
const { scene } = useTresContext();

import { useModelSettings } from "~/composables/useModel";
const { setModel } = useModelSettings();
// const model = nodes.test002;
// newSetModel(model);
console.log(nodes);

console.log(activeModularList.value);
const groundZeroList = [];
const groundBottomList = [];
const groundLeftList = [];
const groundRightList = [];
const groundTopList = [];

activeModularList.value.forEach((element) => {
  const isLeftActive = activeModularList.value.find(
    (data) => data.index === element.index - 1
  );
  const isRightActive = activeModularList.value.find(
    (data) => data.index === element.index + 1
  );

  const isTopActive = activeModularList.value.find(
    (data) => data.index === element.index - 10
  );
  const isBottomActive = activeModularList.value.find(
    (data) => data.index === element.index + 10
  );
  if (isLeftActive && isRightActive && isTopActive && isBottomActive) {
    groundZeroList.push(element);
  }

  if (isLeftActive && isRightActive && isTopActive && !isBottomActive) {
    groundBottomList.push({ ...element, side: "bottom" });
  }

  if (!isLeftActive && isRightActive && isTopActive && isBottomActive) {
    groundLeftList.push({ ...element, side: "left" });
  }

  if (isLeftActive && !isRightActive && isTopActive && isBottomActive) {
    groundRightList.push({ ...element, side: "right" });
  }

  if (isLeftActive && isRightActive && !isTopActive && isBottomActive) {
    groundTopList.push({ ...element, side: "top" });
  }
});
const listGroundOneSide = [
  ...groundBottomList,
  ...groundLeftList,
  ...groundRightList,
  ...groundTopList,
];
// model.position.y = -1.5;

let instancedMeshGroundOneSide = new InstancedMesh(
  nodes.groundLeft.geometry,
  nodes.groundLeft.material,
  listGroundOneSide.length
);
instancedMeshGroundOneSide.castShadow = true;
instancedMeshGroundOneSide.receiveShadow = true;

let instancedMeshGroundLeftBottom = new InstancedMesh(
  nodes.groundLeftBottom.geometry,
  nodes.groundLeftBottom.material,
  1
);
instancedMeshGroundLeftBottom.castShadow = true;
instancedMeshGroundLeftBottom.receiveShadow = true;

let instancedMeshGroundLeftBottomTop = new InstancedMesh(
  nodes.groundLeftBottomTop.geometry,
  nodes.groundLeftBottomTop.material,
  1
);
instancedMeshGroundLeftBottomTop.castShadow = true;
instancedMeshGroundLeftBottomTop.receiveShadow = true;

let instancedMeshGroundZero = new InstancedMesh(
  nodes.groundZero.geometry,
  nodes.groundZero.material,
  groundZeroList.length
);
instancedMeshGroundZero.castShadow = true;
instancedMeshGroundZero.receiveShadow = true;

let dummyZero = new Object3D();
for (let i = 0; i < groundZeroList.length; i++) {
  dummyZero.position.set(
    groundZeroList[i].positionX,
    0.0,
    groundZeroList[i].positionZ
  );

  dummyZero.updateMatrix();
  instancedMeshGroundZero.setMatrixAt(i, dummyZero.matrix);
}
scene.value.add(instancedMeshGroundZero);

let dummyOneSide = new Object3D();
for (let i = 0; i < listGroundOneSide.length; i++) {
  dummyOneSide.position.set(
    listGroundOneSide[i].positionX,
    -1.0,
    listGroundOneSide[i].positionZ
  );
  if (listGroundOneSide[i].side === "bottom") {
    dummyOneSide.rotation.y = -Math.PI;
  } else if (listGroundOneSide[i].side === "top") {
    dummyOneSide.rotation.y = 0;
  } else if (listGroundOneSide[i].side === "left") {
    dummyOneSide.rotation.y = Math.PI / 2;
  } else if (listGroundOneSide[i].side === "right") {
    dummyOneSide.rotation.y = -Math.PI / 2;
  }
  dummyOneSide.updateMatrix();
  instancedMeshGroundOneSide.setMatrixAt(i, dummyOneSide.matrix);
}
scene.value.add(instancedMeshGroundOneSide);
</script>

<template>
  <primitive :object="model" />
</template>
