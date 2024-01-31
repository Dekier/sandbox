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
} from "three";
import { useGLTF } from "@tresjs/cientos";
const storeGeneral = useGeneralStore();
const controlsStore = useControlsStore();
const { isMovingCharacter } = storeToRefs(controlsStore);
const { $gsap } = useNuxtApp();
const { colorTrees } = storeToRefs(storeGeneral);
const { bendModel, calculateDistance } = useUtils();
const props = defineProps({
  bushStickData: {
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
modelWood.castShadow = true;
modelWood.receiveShadow = true;

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
  props.bushStickData.length
);

instancesWood.castShadow = true;
instancesWood.receiveShadow = true;

let dummyLeaves = new Object3D();
const instancesLeaves = new InstancedMesh(
  modelLeaves.geometry,
  modelLeaves.material,
  props.bushStickData.length
);
instancesLeaves.castShadow = true;
instancesLeaves.receiveShadow = true;
// Ustawienie morph targetów dla instancji liści (leaves)
instancesLeaves.morphTargetInfluences = modelLeaves.morphTargetInfluences;
instancesLeaves.morphTargetDictionary = modelLeaves.morphTargetDictionary;
const { scene } = useTresContext();

for (let i = 0; i < props.bushStickData.length; i++) {
  dummyWood.position.set(
    props.bushStickData[i].positionX,
    modelWood.position.y,
    props.bushStickData[i].positionZ
  );
  // dummyWood.rotation.y = randomY;
  dummyWood.updateMatrix();
  dummyLeaves.position.set(
    props.bushStickData[i].positionX,
    modelLeaves.position.y,
    props.bushStickData[i].positionZ
  );
  // dummyLeaves.rotation.y = randomY;
  dummyLeaves.updateMatrix();
  instancesWood.setMatrixAt(i, dummyWood.matrix);
  instancesLeaves.setMatrixAt(i, dummyLeaves.matrix);
}
scene.value.add(instancesWood);
scene.value.add(instancesLeaves);

const { onBeforeLoop } = useRenderLoop();
let matWood = new Matrix4();
let matLeaves = new Matrix4();
const currentDistance = ref(0);
onBeforeLoop(() => {
  for (let i = 0; i < props.bushStickData.length; i++) {
    instancesWood.getMatrixAt(i, matWood);
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
