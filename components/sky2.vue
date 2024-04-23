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
import vertexShader from "@/src/shaders/clouds/vertex.glsl";
import fragmentShader from "@/src/shaders/clouds/fragment.glsl";

const modelSea: Ref<TresObject | null> = ref(null);
const water = ref();

var params = {
  foamColor: 0xffffff,
  waterColor: 0x0069c2,
  threshold: 0.01,
};

const pixelRatio = renderer.value.getPixelRatio();
const renderTarget = new WebGLRenderTarget(
  window.innerWidth * pixelRatio,
  window.innerHeight * pixelRatio
);

renderTarget.texture.minFilter = NearestFilter;
renderTarget.texture.magFilter = NearestFilter;
renderTarget.texture.generateMipmaps = false;
renderTarget.stencilBuffer = false;

var dudvMap = new TextureLoader().load("/shader/shader.png");
dudvMap.wrapS = dudvMap.wrapT = RepeatWrapping;

let uniforms = {
  time: {
    value: 0,
  },
};

var cloudsMaterial = new ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  fog: true,
  transparent: true,
});

const { onLoop, resume } = useRenderLoop();
resume();
const geometry = new PlaneGeometry(300, 300, 1, 1);
const cloudsModel = new Mesh(geometry, cloudsMaterial);
onLoop(({ _delta, elapsed }) => {
  if (cloudsModel) {
    cloudsMaterial.uniforms.time.value = elapsed;
  }
});

cloudsModel.receiveShadow = true;
// cloudsModel.rotation.x = -Math.PI / 2;
cloudsModel.position.y = 2.6;
cloudsModel.material.opacity = 0.2;

// cloudsModel.material.transparent = true;
scene.value.add(cloudsModel);
</script>
