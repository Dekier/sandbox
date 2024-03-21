<script setup lang="ts">
import {
  Vector2,
  Color,
  ShaderMaterial,
  WebGLRenderTarget,
  NearestFilter,
  UnsignedShortType,
  DepthTexture,
  MeshDepthMaterial,
  RGBADepthPacking,
  NoBlending,
  TextureLoader,
  RepeatWrapping,
  UniformsUtils,
  UniformsLib,
  ClampToEdgeWrapping,
  PlaneGeometry,
  Mesh,
  GLSL3,
  PerspectiveCamera,
  MeshStandardMaterial,
  Vector3,
} from "three";
const { scene } = useTresContext();
const storeControl = useControlsStore();
const characterStore = useCharacterStore();
const { characterModel, positionCharacter } = storeToRefs(characterStore);
import vertexShader from "@/src/shaders/sea/vertex2.glsl";
import fragmentShader from "@/src/shaders/sea/fragment2.glsl";

const water = ref();
const uniforms = {
  uTime: { value: 0 },
  uCharacterPosition: { value: new Vector3(0, 0, 0) },

  uBigWavesElevation: { value: 0.5 },
  uBigWavesFrequency: { value: new Vector2(0.1, 0.05) },
  uBigWavesSpeed: { value: 0.75 },

  uSmallWavesElevation: { value: 0.3 },
  uSmallWavesFrequency: { value: 0.5 },
  uSmallWavesSpeed: { value: 0.2 },
  uSmallIterations: { value: 2 },

  uDepthColor: { value: new Color("#368baf") },
  uSurfaceColor: { value: new Color("#4097bc") },
  uColorOffset: { value: 0.18 },
  uColorMultiplier: { value: 2.5 },
};

const waterMaterial = new ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  transparent: true,
});

const { onLoop, resume } = useRenderLoop();
resume();
const geometry = new PlaneGeometry(400, 400, 100, 100);
const seaModel = new Mesh(geometry, waterMaterial);
onLoop(({ _delta, elapsed }) => {
  waterMaterial.uniforms.uTime.value = elapsed;
  if (positionCharacter.value) {
    waterMaterial.uniforms.uCharacterPosition.value = positionCharacter.value;
  }
  // if (storeControl.isMovingCharacter) {
  //   seaModel.position.x = characterModel.value.position.x;
  //   seaModel.position.z = characterModel.value.position.z;
  // }
});

seaModel.rotation.x = -Math.PI / 2;
seaModel.position.y = -1.0;
scene.value.add(seaModel);

// const materialProps = {
//   baseMaterial: MeshStandardMaterial,
//   color: 0x00ffff,
//   wireframe: false,
//   vertexShader,
//   fragmentShader,
//   uniforms: {
//     uTime: { value: 0 },

//     uBigWavesElevation: { value: 0.5 },
//     uBigWavesFrequency: { value: new Vector2(0.1, 0.05) },
//     uBigWavesSpeed: { value: 0.75 },

//     uSmallWavesElevation: { value: 0.3 },
//     uSmallWavesFrequency: { value: 0.5 },
//     uSmallWavesSpeed: { value: 0.05 },
//     uSmallIterations: { value: 2 },

//     uDepthColor: { value: new Color("#368baf") },
//     uSurfaceColor: { value: new Color("#4097bc") },
//     uColorOffset: { value: 0.18 },
//     uColorMultiplier: { value: 2.5 },
//   }
// }
//   const { onLoop } = useRenderLoop()
//   onMounted(async () => {
//   await nextTick()

//   onLoop((_delta, elapsed) => {
//     materialProps.uniforms.uTime.value = elapsed
//   })
// })
</script>

<!-- <template> -->
<!-- <TresMesh>
      <TresTorusKnotGeometry :args="[1, 0.3, 512, 32]" />
      <CustomShaderMaterial v-bind="materialProps" />
    </TresMesh> -->
<!-- <TresMesh  :position="[0, -1.0, 0]" :rotation="[-Math.PI / 2,0,0]">
        <TresPlaneGeometry :args="[500, 500, 800, 800]"></TresPlaneGeometry>
       <CustomShaderMaterial v-bind="materialProps" />
    </TresMesh>
  </template>
   -->
