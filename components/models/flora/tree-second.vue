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
  Quaternion,
} from "three";
import { Precipitation } from "@tresjs/cientos";
import { useGLTF } from "@tresjs/cientos";
const props = defineProps({
  treesData: {
    type: Array,
    required: true,
  },
});
const storeGeneral = useGeneralStore();
const storeControl = useControlsStore();
const characterStore = useCharacterStore();
const { isMovingCharacter } = storeToRefs(storeControl);
const { positionCharacter } = storeToRefs(characterStore);
const { checkDistance } = useUtils();
const { colorTrees } = storeToRefs(storeGeneral);
const { scene } = useTresContext();

const {
  scene: modelScene,
  nodes,
  animations,
} = await useGLTF("/models/tree2.glb", { draco: true });
const { actions } = useAnimations(animations, modelScene);
actions.leaves1.play();
const modelTree = nodes.treeAnim;
const modelLeaves = nodes.leavesAnim;
// const cutList = [nodes.cut1, nodes.cut2, nodes.cut3, nodes.cut4, nodes.cut5];
const indexActive = ref<number | null>(null);

const loader = new TextureLoader();
const alphaMap = loader.load("/materials/leaves/leaves.png");

const leavesMaterial = new MeshLambertMaterial({
  color: new Color(colorTrees.value),
  alphaMap: alphaMap,
  alphaTest: 0.3,
  side: DoubleSide,
});

const treeMaterial = new MeshLambertMaterial({
  color: modelTree.material?.color,
  side: DoubleSide,
});

let dummy = new Object3D();
const instancedMesh = new InstancedMesh(
  modelTree.geometry,
  treeMaterial,
  props.treesData.length
);
// let dummyCut1 = new Object3D();
// let instancedMeshCut1 = new InstancedMesh(
//   cutList[0].geometry,
//   treeMaterial,
//   props.treesData.length
// );
// let dummyCut2 = new Object3D();
// let instancedMeshCut2 = new InstancedMesh(
//   cutList[1].geometry,
//   treeMaterial,
//   props.treesData.length
// );
// let dummyCut3 = new Object3D();
// let instancedMeshCut3 = new InstancedMesh(
//   cutList[2].geometry,
//   treeMaterial,
//   props.treesData.length
// );

// let dummyCut4 = new Object3D();
// let instancedMeshCut4 = new InstancedMesh(
//   cutList[3].geometry,
//   treeMaterial,
//   props.treesData.length
// );

// let dummyCut5 = new Object3D();
// let instancedMeshCut5 = new InstancedMesh(
//   cutList[4].geometry,
//   treeMaterial,
//   props.treesData.length
// );

let dummyLeaves = new Object3D();
const instancedMeshLeaves = new InstancedMesh(
  modelLeaves.geometry,
  leavesMaterial,
  props.treesData.length
);

instancedMeshLeaves.morphTargetInfluences = modelLeaves.morphTargetInfluences;
instancedMeshLeaves.morphTargetDictionary = modelLeaves.morphTargetDictionary;

// const setInstacedMeshCut1 = () => {
//   scene.value.remove(instancedMeshCut1);
//   const newArray = props.treesData.filter((element) => element.cutStep === 1);
//   instancedMeshCut1 = new InstancedMesh(
//     cutList[0].geometry,
//     treeMaterial,
//     newArray.length
//   );
//   for (let i = 0; i < newArray.length; i++) {
//     dummyCut1.position.set(
//       newArray[i].positionX,
//       cutList[0].position.y * newArray[i].scale,
//       newArray[i].positionZ
//     );

//     dummyCut1.scale.y = newArray[i].scale;
//     dummyCut1.scale.x = newArray[i].scale;
//     dummyCut1.scale.z = newArray[i].scale;
//     dummyCut1.rotation.y = newArray[i].rotationY;
//     dummyCut1.updateMatrix();
//     instancedMeshCut1.setMatrixAt(i, dummyCut1.matrix);
//   }

//   instancedMeshCut1.castShadow = true;
//   instancedMeshCut1.receiveShadow = true;
//   scene.value.add(instancedMeshCut1);
// };
// setInstacedMeshCut1();
// const setInstacedMeshCut2 = () => {
//   scene.value.remove(instancedMeshCut2);
//   const newArray = props.treesData.filter((element) => element.cutStep === 2);
//   instancedMeshCut2 = new InstancedMesh(
//     cutList[1].geometry,
//     treeMaterial,
//     newArray.length
//   );
//   for (let i = 0; i < newArray.length; i++) {
//     dummyCut2.position.set(
//       newArray[i].positionX,
//       cutList[0].position.y * newArray[i].scale,
//       newArray[i].positionZ
//     );

//     dummyCut2.scale.y = newArray[i].scale;
//     dummyCut2.scale.x = newArray[i].scale;
//     dummyCut2.scale.z = newArray[i].scale;
//     dummyCut2.rotation.y = newArray[i].rotationY;
//     dummyCut2.updateMatrix();
//     instancedMeshCut2.setMatrixAt(i, dummyCut2.matrix);
//   }

//   instancedMeshCut2.castShadow = true;
//   instancedMeshCut2.receiveShadow = true;
//   scene.value.add(instancedMeshCut2);
// };
// const setInstacedMeshCut3 = () => {
//   scene.value.remove(instancedMeshCut3);
//   const newArray = props.treesData.filter((element) => element.cutStep === 3);
//   instancedMeshCut3 = new InstancedMesh(
//     cutList[2].geometry,
//     treeMaterial,
//     newArray.length
//   );
//   for (let i = 0; i < newArray.length; i++) {
//     dummyCut3.position.set(
//       newArray[i].positionX,
//       cutList[0].position.y * newArray[i].scale,
//       newArray[i].positionZ
//     );

//     dummyCut3.scale.y = newArray[i].scale;
//     dummyCut3.scale.x = newArray[i].scale;
//     dummyCut3.scale.z = newArray[i].scale;
//     dummyCut3.rotation.y = newArray[i].rotationY;
//     dummyCut3.updateMatrix();
//     instancedMeshCut3.setMatrixAt(i, dummyCut3.matrix);
//   }

//   instancedMeshCut3.castShadow = true;
//   instancedMeshCut3.receiveShadow = true;
//   scene.value.add(instancedMeshCut3);
// };
// const setInstacedMeshCut4 = () => {
//   scene.value.remove(instancedMeshCut4);
//   const newArray = props.treesData.filter((element) => element.cutStep === 4);
//   instancedMeshCut4 = new InstancedMesh(
//     cutList[3].geometry,
//     treeMaterial,
//     newArray.length
//   );
//   for (let i = 0; i < newArray.length; i++) {
//     dummyCut4.position.set(
//       newArray[i].positionX,
//       cutList[0].position.y * newArray[i].scale,
//       newArray[i].positionZ
//     );

//     dummyCut4.scale.y = newArray[i].scale;
//     dummyCut4.scale.x = newArray[i].scale;
//     dummyCut4.scale.z = newArray[i].scale;
//     dummyCut4.rotation.y = newArray[i].rotationY;
//     dummyCut4.updateMatrix();
//     instancedMeshCut4.setMatrixAt(i, dummyCut4.matrix);
//   }

//   instancedMeshCut4.castShadow = true;
//   instancedMeshCut4.receiveShadow = true;
//   scene.value.add(instancedMeshCut4);
// };
// const setInstacedMeshCut5 = () => {
//   scene.value.remove(instancedMeshCut5);
//   const newArray = props.treesData.filter((element) => element.cutStep === 5);
//   instancedMeshCut5 = new InstancedMesh(
//     cutList[4].geometry,
//     treeMaterial,
//     newArray.length
//   );
//   for (let i = 0; i < newArray.length; i++) {
//     dummyCut5.position.set(
//       newArray[i].positionX,
//       cutList[0].position.y * newArray[i].scale,
//       newArray[i].positionZ
//     );

//     dummyCut5.scale.y = newArray[i].scale;
//     dummyCut5.scale.x = newArray[i].scale;
//     dummyCut5.scale.z = newArray[i].scale;
//     dummyCut5.rotation.y = newArray[i].rotationY;
//     dummyCut5.updateMatrix();
//     instancedMeshCut5.setMatrixAt(i, dummyCut5.matrix);
//   }

//   instancedMeshCut5.castShadow = true;
//   instancedMeshCut5.receiveShadow = true;
//   scene.value.add(instancedMeshCut5);
// };
for (let i = 0; i < props.treesData.length; i++) {
  dummy.position.set(
    props.treesData[i].positionX,
    modelTree.position.y * props.treesData[i].scale,
    props.treesData[i].positionZ
  );

  dummyLeaves.position.set(
    props.treesData[i].positionX,
    modelLeaves.position.y * props.treesData[i].scale,
    props.treesData[i].positionZ
  );

  // dummy.scale.y = props.treesData[i].scale;
  dummy.scale.x = props.treesData[i].scale;
  dummy.scale.z = props.treesData[i].scale;
  dummy.rotation.y = props.treesData[i].rotationY;
  dummy.updateMatrix();

  // dummyLeaves.scale.y = props.treesData[i].scale;
  dummyLeaves.scale.x = props.treesData[i].scale;
  dummyLeaves.scale.z = props.treesData[i].scale;
  dummyLeaves.rotation.y = props.treesData[i].rotationY;
  dummyLeaves.updateMatrix();

  instancedMesh.setMatrixAt(i, dummy.matrix);
  instancedMeshLeaves.setMatrixAt(i, dummyLeaves.matrix);
}

instancedMesh.castShadow = true;
instancedMesh.receiveShadow = true;
instancedMeshLeaves.castShadow = true;
instancedMeshLeaves.receiveShadow = true;

scene.value.add(instancedMesh);
scene.value.add(instancedMeshLeaves);

watch(colorTrees, (value) => {
  leavesMaterial.color = new Color(value);
});

const drawingCanvas = document.getElementById("drawing-canvas");
const drawStartPos = new Vector2();
const drawContext = drawingCanvas?.getContext("2d");

const { onLoop } = useRenderLoop();

onLoop(() => {
  if (isMovingCharacter.value) {
    if (indexActive.value) {
      indexActive.value = null;
    }
    const instanceMatrix = new Matrix4();
    for (let i = 0; i < props.treesData.length; i++) {
      instancedMesh.getMatrixAt(i, instanceMatrix);

      // Pobierz pozycję instancji
      const instancePosition = new Vector3();
      instanceMatrix.decompose(
        instancePosition,
        new Quaternion(),
        new Vector3()
      );

      if (instancePosition.distanceTo(positionCharacter.value) < 5) {
        // console.log("Indeks instancji:", i);
        indexActive.value = i;
        break;
      }
    }
  }
});

document.addEventListener("mousedown", (event) => {
  // Sprawdź, czy naciśnięty został lewy przycisk myszy (button === 0)
  // if (indexActive.value !== null) {
  //   switch (props.treesData[indexActive.value].cutStep) {
  //     case 1:
  //       props.treesData[indexActive.value].cutStep = 2;
  //       setInstacedMeshCut1();
  //       setInstacedMeshCut2();
  //       break;
  //     case 2:
  //       props.treesData[indexActive.value].cutStep = 3;
  //       setInstacedMeshCut2();
  //       setInstacedMeshCut3();
  //       break;
  //     case 3:
  //       props.treesData[indexActive.value].cutStep = 4;
  //       setInstacedMeshCut3();
  //       setInstacedMeshCut4();
  //       break;
  //     case 4:
  //       props.treesData[indexActive.value].cutStep = 5;
  //       setInstacedMeshCut4();
  //       setInstacedMeshCut5();
  //       break;
  //     default:
  //       break;
  //   }
  // }
  // Tutaj umieść kod obsługujący naciśnięcie lewego przycisku myszy
});
// const snowflakeMap = loader.load("/materials/leaves/leaf.png");
</script>
<!-- <template> -->
<!-- <Suspense v-for="data in positions" :key="data.x + data.z">
    <Precipitation
      :color="colorTrees"
      :alpha-map="snowflakeMap"
      :position="[data.x, 5, data.z]"
      :area="[15, 10, 15]"
      :count="10"
      :speed="0.1"
      :size="0.7"
      :opacity="1"
      :randomness="1"
    />
  </Suspense> -->
<!-- <primitive :object="instancedMesh" /> -->
<!-- <primitive :object="dummyCut1" /> -->
<!-- <primitive :object="instancedMeshLeaves" /> -->
<!-- </template> -->
