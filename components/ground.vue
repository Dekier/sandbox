<script setup lang="ts">
import {
  MeshBasicMaterial,
  Mesh,
  PlaneGeometry,
  TextureLoader,
  RepeatWrapping,
  Vector2,
  NearestFilter,
  WebGLRenderTarget,
  Vector3,
  Color,
  UniformsLib,
  ShaderMaterial,
  CanvasTexture,
  MeshPhongMaterial,
  Texture,
} from "three";
const props = defineProps({
  positions: {
    type: Object,
    required: true,
  },
  drawingCanvas: {
    type: Object,
    required: true,
  },
});

import vertexShader from "@/src/shaders/ground/vertex.glsl";
import fragmentShader from "@/src/shaders/ground/fragment.glsl";
const storeGeneral = useGeneralStore();
const { color } = storeToRefs(storeGeneral);
const { scene, renderer, camera } = useTresContext();

const loader = new TextureLoader();
const rough = loader.load("/materials/grass/color.webp");
rough.wrapS = RepeatWrapping;
rough.wrapT = RepeatWrapping;
rough.repeat.x = 35;
rough.repeat.y = 35;

const drawStartPos = new Vector2();
const drawingContext = props.drawingCanvas?.getContext("2d");

props.drawingCanvas.addEventListener("pointerup", () => {
  const newAlphaMap = new Texture();
  newAlphaMap.image = drawingContext.getImageData(0, 0, 200, 200);
  newAlphaMap.needsUpdate = true;

  // Ustaw parametry dla tekstury mapy alfy
  newAlphaMap.wrapS = RepeatWrapping;
  newAlphaMap.wrapT = RepeatWrapping;
  groundMaterial.uniforms.alphaMap.value = newAlphaMap;
});

const alphaMap = new Texture();
alphaMap.image = await drawingContext.getImageData(0, 0, 200, 200);
alphaMap.needsUpdate = true;

// Ustaw parametry dla tekstury mapy alfy
alphaMap.wrapS = RepeatWrapping;
alphaMap.wrapT = RepeatWrapping;

const darkerFactor = 0.85;
const darkerFactorRoads = 1.0;
const uniforms = {
  time: {
    value: 0,
  },
  uCharacterPosition: { value: new Vector3(0, 0, 0) },
  roughMap: { value: rough },
  alphaMap: { value: alphaMap },
  hexColor: {
    value: new Vector3(
      new Color(color.value).r / darkerFactor,
      new Color(color.value).g / darkerFactor,
      new Color(color.value).b / darkerFactor
    ),
  },
  hexColorRoads: {
    value: new Vector3(
      new Color(color.value).r / darkerFactorRoads,
      new Color(color.value).g / darkerFactorRoads,
      new Color(color.value).b / darkerFactorRoads
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
const groundGeometry = new PlaneGeometry(201, 201, 1, 1);
groundGeometry.rotateX(-Math.PI / 2);
const mesh = new Mesh(groundGeometry, groundMaterial);
// mesh.position.z = 1;
// mesh.position.x = 1;
mesh.position.z = props.positions.z;
mesh.position.x = props.positions.x;
mesh.receiveShadow = true;

scene.value.add(mesh);

watch(color, (value) => {
  groundMaterial.uniforms.hexColor.value = new Vector3(
    new Color(value).r / darkerFactor,
    new Color(value).g / darkerFactor,
    new Color(value).b / darkerFactor
  );

  groundMaterial.uniforms.hexColorRoads.value = new Vector3(
    new Color(value).r / darkerFactorRoads,
    new Color(value).g / darkerFactorRoads,
    new Color(value).b / darkerFactorRoads
  );
});

// const geometry = new PlaneGeometry(101, 100, 1, 4);
// const lol = new MeshPhongMaterial({
//   color: 0xcccfff,
// });
// const jdshfk = new Mesh(geometry, lol);
// jdshfk.rotation.x = -Math.PI / 2;
// jdshfk.position.y = 0.2;
// jdshfk.castShadow = true;
// jdshfk.receiveShadow = true;
// scene.value.add(jdshfk);
</script>

<!-- <template>
  <Plane ref="planeRef" :args="[161, 161, 1, 1]" :position="[0, 0, 0]">
    <TresMeshToonMaterial color="teal" />
  </Plane>
</template> -->
