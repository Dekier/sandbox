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
const { drawDots } = useCanvas();
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

const positions = [
  { x: -30, z: 10 },
  { x: -62, z: 56 },
  { x: -57, z: -53 },
  { x: 18, z: 53 },
  { x: -20, z: 65 },
  { x: 30, z: -30 },
  { x: 10, z: -50 },
  { x: 60, z: 3 },
];

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
  positions.length
);

let dummyLeaves = new Object3D();
const instancedMeshLeaves = new InstancedMesh(
  modelLeaves.geometry,
  leavesMaterial,
  positions.length
);
instancedMeshLeaves.morphTargetInfluences = modelLeaves.morphTargetInfluences;
instancedMeshLeaves.morphTargetDictionary = modelLeaves.morphTargetDictionary;
for (let i = 0; i < positions.length; i++) {
  const randomScale = Math.random() * 1.0;
  dummy.position.set(
    positions[i].x,
    modelTree.position.y * randomScale,
    positions[i].z
  );
  dummyLeaves.position.set(
    positions[i].x,
    modelLeaves.position.y * randomScale,
    positions[i].z
  );
  const randomRotationY = Math.random() * 184;
  // dummy.scale.y = 0.6 + randomScale;
  // dummy.scale.x = 0.6 + randomScale;
  // dummy.scale.z = 0.6 + randomScale;
  dummy.rotation.y = randomRotationY;
  dummy.updateMatrix();

  // dummyLeaves.scale.y = 0.6 + randomScale;
  // dummyLeaves.scale.x = 0.6 + randomScale;
  // dummyLeaves.scale.z = 0.6 + randomScale;
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
drawDots(positions, drawingContext);
const snowflakeMap = loader.load("/materials/leaves/leaf.png");
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
