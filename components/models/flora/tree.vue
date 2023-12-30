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
} from "three";
import { Precipitation } from "@tresjs/cientos";
import { useGLTF } from "@tresjs/cientos";
const storeGeneral = useGeneralStore();
const { colorTrees } = storeToRefs(storeGeneral);
const { scene } = useTresContext();

const {
  scene: modelScene,
  nodes,
  animations,
} = await useGLTF("/models/tree.glb", { draco: true });
const { actions } = useAnimations(animations, modelScene);
actions.leaves2.play();
const modelTree = nodes.treeAnim2;
const modelLeaves = nodes.leavesAnim2;

const props = defineProps({
  treesData: {
    type: Array,
    required: true,
  },
});

const loader = new TextureLoader();
const alphaMap = loader.load("/materials/leaves/leaves.png");

const leavesMaterial = new MeshLambertMaterial({
  color: new Color(colorTrees.value),
  alphaMap: alphaMap,
  alphaTest: 0.3,
  side: DoubleSide,
});

const treeMaterial = new MeshLambertMaterial({
  color: modelTree.material.color,
  side: DoubleSide,
});

let dummy = new Object3D();
const instancedMesh = new InstancedMesh(
  modelTree.geometry,
  treeMaterial,
  props.treesData.length
);

let dummyLeaves = new Object3D();
const instancedMeshLeaves = new InstancedMesh(
  modelLeaves.geometry,
  leavesMaterial,
  props.treesData.length
);
instancedMeshLeaves.morphTargetInfluences = modelLeaves.morphTargetInfluences;
instancedMeshLeaves.morphTargetDictionary = modelLeaves.morphTargetDictionary;
for (let i = 0; i < props.treesData.length; i++) {
  dummy.position.set(
    props.treesData[i].positionX,
    modelTree.position.y,
    props.treesData[i].positionZ
  );
  dummyLeaves.position.set(
    props.treesData[i].positionX,
    modelLeaves.position.y,
    props.treesData[i].positionZ
  );
  const randomRotationY = Math.random() * 184;
  // dummy.scale.y = props.treesData[i].scale;
  dummy.scale.x = props.treesData[i].scale;
  dummy.scale.z = props.treesData[i].scale;
  dummy.rotation.y = randomRotationY;
  dummy.updateMatrix();

  // dummyLeaves.scale.y =  props.treesData[i].scale;
  dummyLeaves.scale.x = props.treesData[i].scale;
  dummyLeaves.scale.z = props.treesData[i].scale;
  dummy.rotation.y = randomRotationY;
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
const drawingContext = drawingCanvas?.getContext("2d");

// const snowflakeMap = loader.load("/materials/leaves/leaf.png");
</script>
<!-- <template>
  <Suspense v-for="data in positions" :key="data.x + data.z">
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
  </Suspense>
</template> -->
