<script setup lang="ts">
import {
  DoubleSide,
  Object3D,
  InstancedMesh,
  BoxGeometry,
  PlaneGeometry,
  MeshLambertMaterial,
  BufferGeometry,
  BufferAttribute,
  Points,
  PointsMaterial,
  Mesh,
  TextureLoader,
  Color,
} from "three";

const props = defineProps({
  positions: {
    type: Object,
    required: true,
  },
});
const downloadedModels = useDownloadedModels();
const { smallStick } = storeToRefs(downloadedModels);
const storeGeneral = useGeneralStore();
const { colorTrees } = storeToRefs(storeGeneral);
const elements = [];
const smallStickModel = { ...smallStick.value.smallStick };
const smallStick2Model = { ...smallStick.value.smallStick2 };

const { onLoop } = useRenderLoop();
onMounted(async () => {
  await nextTick();

  onLoop(({ elapsed }) => {
    if (elements) {
      elements.forEach((element) => {
        const heh = Math.random() * 0.04;
        if (element.position.y > 0) {
          element.position.y -= 0.01;
        } else if (element.position.y < 0.1) {
          element.position.y = Math.random() * 4;
        }
        element.rotation.x += heh;
        element.rotation.y += heh;
      });
    }
  });
});

const { scene } = useTresContext();
const loader = new TextureLoader();
const alphaMap = loader.load("/materials/leaves/one-leaf.png");
const getRandomGeometry = () => {
  const randomOption = Math.random() < 0.7 ? "box2" : "box";

  if (randomOption === "box2") {
    const material = new MeshLambertMaterial({
      color: new Color(colorTrees.value),
      alphaMap: alphaMap,
      alphaTest: 0.3,
      side: DoubleSide,
    });

    return { material, geometry: new PlaneGeometry(0.2, 0.2) };
  } else {
    const randomStick = Math.random() < 0.5 ? "stick2" : "stick";

    return {
      material:
        randomStick === "stick2"
          ? smallStick2Model.material
          : smallStickModel.material,
      geometry:
        randomStick === "stick2"
          ? smallStick2Model.geometry
          : smallStickModel.geometry,
    };
  }
};
for (let i = 0; i < 2; i++) {
  const lol2 = Math.random() * 2;
  const lol3 = Math.random() * 4.5;
  const data = getRandomGeometry();
  const element = new Mesh(data.geometry, data.material);
  element.receiveShadow = true;
  element.castShadow = true;
  element.position.set(
    props.positions.x + lol2,
    lol3,
    props.positions.z + lol2
  );
  element.rotation.set(lol2, lol3, lol2);
  scene.value.add(element);
  elements.push(element);
}
onBeforeUnmount(() => {
  elements.forEach((element) => {
    element.material.dispose();
    element.geometry.dispose();
    scene.value.remove(element);
  });
});
</script>

<!-- <template>
</template> -->
