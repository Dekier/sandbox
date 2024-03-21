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
import vertexShader from "@/src/shaders/sea/vertex.glsl";
import fragmentShader from "@/src/shaders/sea/fragment.glsl";

const modelSea: Ref<TresObject | null> = ref(null);
const water = ref();

var params = {
  foamColor: 0xffffff,
  waterColor: 0x0069c2,
  threshold: 0.01,
};
const canvasElement = document.querySelectorAll("canvas")[0];

const pixelRatio = renderer.value.getPixelRatio();
const renderTarget = new WebGLRenderTarget(
  window.innerWidth * pixelRatio,
  window.innerHeight * pixelRatio
);

renderTarget.texture.minFilter = NearestFilter;
renderTarget.texture.magFilter = NearestFilter;
renderTarget.texture.generateMipmaps = false;
renderTarget.stencilBuffer = false;

const depthMaterial = new MeshDepthMaterial();
depthMaterial.depthPacking = RGBADepthPacking;
depthMaterial.blending = NoBlending;
var dudvMap = new TextureLoader().load("/shader/shader.png");
dudvMap.wrapS = dudvMap.wrapT = RepeatWrapping;

let uniforms = {
  time: {
    value: 0,
  },
  threshold: {
    value: params.threshold,
  },
  tDudv: {
    value: null,
  },
  tDepth: {
    value: null,
  },
  cameraNear: {
    value: camera.value.near,
  },
  cameraFar: {
    value: camera.value.far,
  },
  resolution: {
    value: new Vector2(),
  },
  foamColor: {
    value: new Color(params.foamColor),
  },
  waterColor: {
    value: new Color(params.waterColor),
  },
};

var waterMaterial = new ShaderMaterial({
  defines: {
    DEPTH_PACKING: 1,
    ORTHOGRAPHIC_CAMERA: 0,
  },
  uniforms: UniformsUtils.merge([UniformsLib["fog"], uniforms]),
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  fog: true,
});

waterMaterial.uniforms.cameraNear.value = 0.1;
waterMaterial.uniforms.cameraFar.value = 300;
waterMaterial.uniforms.resolution.value.set(
  window.innerWidth,
  window.innerHeight
);
waterMaterial.uniforms.tDudv.value = dudvMap;
waterMaterial.uniforms.tDepth.value = renderTarget.texture;

const { onLoop, resume } = useRenderLoop();
resume();
const geometry = new PlaneGeometry(300, 300, 1, 1);
const seaModel = new Mesh(geometry, waterMaterial);
onLoop(({ _delta, elapsed }) => {
  if (seaModel) {
    seaModel.visible = false;
    scene.value.overrideMaterial = depthMaterial;

    renderer.value.setRenderTarget(renderTarget);
    renderer.value.render(scene.value, camera.value);
    renderer.value.setRenderTarget(null);

    scene.value.overrideMaterial = null;
    seaModel.visible = true;

    // seaModel.material.uniforms.threshold.value = 0.5;
    waterMaterial.uniforms.time.value = elapsed;

    renderer.value.render(scene.value, camera.value);
  }
});
// watch(modelSea, (model) => {
//   model?.value.traverse((child: any) => {
//     if (child.isMesh) {
//       water.value = child;
//       child.material = waterMaterial;
//       child.receiveShadow = true;
//     }
//   });
// });

seaModel.receiveShadow = true;
seaModel.rotation.x = -Math.PI / 2;
seaModel.position.y = -1.6;
seaModel.material.opacity = 0.2;

seaModel.material.transparent = true;
scene.value.add(seaModel);
</script>

<!-- <template>
  <Suspense>
    <GLTFModel path="/models/sea.glb" ref="modelSea" :position-y="0" />
  </Suspense>
</template> -->
