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
} from "three";
const { camera, renderer, scene } = useTresContext();
import vertexShader from "@/src/shaders/sea/vertex2.glsl";
import fragmentShader from "@/src/shaders/sea/fragment2.glsl";

const water = ref();

let uniforms = {
  uTime: { value: 0 },

  uBigWavesElevation: { value: 0.5 },
  uBigWavesFrequency: { value: new Vector2(0.1, 0.05) },
  uBigWavesSpeed: { value: 0.75 },

  uSmallWavesElevation: { value: 0.3 },
  uSmallWavesFrequency: { value: 0.5 },
  uSmallWavesSpeed: { value: 0.05 },
  uSmallIterations: { value: 2 },

  uDepthColor: { value: new Color("#368baf") },
  uSurfaceColor: { value: new Color("#4097bc") },
  uColorOffset: { value: 0.18 },
  uColorMultiplier: { value: 2.5 },
};

var waterMaterial = new ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  transparent: true,
});

const { onLoop, resume } = useRenderLoop();
resume();
const geometry = new PlaneGeometry(500, 500, 800, 800);
const seaModel = new Mesh(geometry, waterMaterial);
onLoop(({ _delta, elapsed }) => {
  waterMaterial.uniforms.uTime.value = elapsed;
});

seaModel.rotation.x = -Math.PI / 2;
seaModel.position.y = -1.0;
scene.value.add(seaModel);
</script>

<!-- <template>
  <Suspense>
    <GLTFModel path="/models/sea.glb" ref="modelSea" :position-y="0" />
  </Suspense>
</template> -->
