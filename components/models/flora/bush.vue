<script setup lang="ts">
import {
  TextureLoader,
  Color,
  DoubleSide,
  MeshLambertMaterial,
  InstancedMesh,
  Object3D,
  Matrix4,
} from "three";
import { useGLTF } from "@tresjs/cientos";
const props = defineProps({
  bushData: {
    type: Array,
    required: true,
  },
});
const storeGeneral = useGeneralStore();
const controlsStore = useControlsStore();
const characterStore = useCharacterStore();
const { isMovingCharacter } = storeToRefs(controlsStore);
const { positionCharacter } = storeToRefs(characterStore);
const { colorTrees } = storeToRefs(storeGeneral);
const { bendModel, calculateDistance } = useUtils();

const {
  scene: modelScene,
  nodes,
  animations,
} = await useGLTF("/models/bush.glb", {
  draco: true,
});
const { actions } = useAnimations(animations, modelScene);
actions.bush.play();
const modelLeaves = nodes.leaves1;
const modelWood = nodes.wood1;
modelWood.castShadow = true;
modelWood.receiveShadow = true;
console.log(modelLeaves);
const loader = new TextureLoader();
const alphaMap = loader.load("/materials/leaves/leaves.png");

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
const instancesWood = new InstancedMesh(
  modelWood.geometry,
  modelWood.material,
  props.bushData.length
);

instancesWood.castShadow = true;
instancesWood.receiveShadow = true;

let dummyLeaves = new Object3D();
const instancesLeaves = new InstancedMesh(
  modelLeaves.geometry,
  modelLeaves.material,
  props.bushData.length
);
instancesLeaves.castShadow = true;
instancesLeaves.receiveShadow = true;
// Ustawienie morph targetów dla instancji liści (leaves)
instancesLeaves.morphTargetInfluences = modelLeaves.morphTargetInfluences;
instancesLeaves.morphTargetDictionary = modelLeaves.morphTargetDictionary;
const { scene } = useTresContext();

for (let i = 0; i < props.bushData.length; i++) {
  const randomY = Math.random() * 184;
  dummyWood.position.set(
    props.bushData[i].positionX,
    modelWood.position.y,
    props.bushData[i].positionZ
  );
  // dummyWood.rotation.y = randomY;
  dummyWood.updateMatrix();
  dummyLeaves.position.set(
    props.bushData[i].positionX,
    modelLeaves.position.y,
    props.bushData[i].positionZ
  );
  // dummyLeaves.rotation.y = randomY;
  dummyLeaves.updateMatrix();
  instancesWood.setMatrixAt(i, dummyWood.matrix);
  instancesLeaves.setMatrixAt(i, dummyLeaves.matrix);
}
scene.value.add(instancesWood);
scene.value.add(instancesLeaves);

const { onBeforeLoop } = useRenderLoop();
let mat4Wood = new Matrix4();
let mat4Leaves = new Matrix4();
const currentDistance = ref(0);
onBeforeLoop(() => {
  for (let i = 0; i < props.bushData.length; i++) {
    instancesWood.getMatrixAt(i, mat4Wood);
    mat4Wood.decompose(
      dummyWood.position,
      dummyWood.quaternion,
      dummyWood.scale
    );

    instancesLeaves.getMatrixAt(i, mat4Leaves);
    mat4Leaves.decompose(
      dummyLeaves.position,
      dummyLeaves.quaternion,
      dummyLeaves.scale
    );

    currentDistance.value = calculateDistance(dummyWood.position);
    if (currentDistance.value < 4) {
      const { x, z } = bendModel(dummyWood.position);
      dummyWood.rotation.x = lerp(dummyWood.rotation.x, x, 0.04);
      dummyWood.rotation.z = lerp(dummyWood.rotation.z, z, 0.04);
      dummyWood.updateMatrix();
      instancesWood.setMatrixAt(i, dummyWood.matrix);
      instancesWood.instanceMatrix.needsUpdate = true;

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
</script>

<!-- <template>
  <primitive :object="modelLeaves" />
  <primitive :object="modelWood" />
</template> -->
