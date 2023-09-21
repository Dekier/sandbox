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
  GLSL3,
} from "three";
const { camera, renderer, scene } = useTresContext();
import vertexShader from "@/src/shaders/vertexx.glsl";
import fragmentShader from "@/src/shaders/fragmentt.glsl";

const modelSea: Ref<TresObject | null> = ref(null);
const water = ref();

var params = {
  foamColor: 0xffffff,
  waterColor: 0x0069c2,
  threshold: 0.1,
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
    value: 0.5,
  },
  tDudv: {
    value: null,
  },
  tDepth: {
    value: null,
  },
  cameraNear: {
    value: 0,
  },
  cameraFar: {
    value: 0,
  },
  resolution: {
    value: new Vector2(),
  },
  foamColor: {
    value: new Color(),
  },
  waterColor: {
    value: new Color(),
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
waterMaterial.uniforms.cameraFar.value = 10000;
waterMaterial.uniforms.resolution.value.set(
  window.innerWidth * pixelRatio,
  window.innerHeight * pixelRatio
);
waterMaterial.uniforms.tDudv.value = dudvMap;
waterMaterial.uniforms.tDepth.value = renderTarget.texture;

const { onLoop, resume } = useRenderLoop();
resume();
onLoop(({ _delta, elapsed }) => {
  if (water.value) {
    water.value.visible = false;
    scene.value.overrideMaterial = depthMaterial;

    renderer.value.setRenderTarget(renderTarget);
    renderer.value.render(scene.value, camera.value);
    renderer.value.setRenderTarget(null);

    scene.value.overrideMaterial = null;
    water.value.visible = true;

    water.value.material.uniforms.threshold.value = 0.2;
    water.value.material.uniforms.time.value = elapsed;
    water.value.material.uniforms.foamColor.value.set(params.foamColor);
    water.value.material.uniforms.waterColor.value.set(params.waterColor);

    renderer.value.render(scene.value, camera.value);
  }
});
watch(modelSea, (model) => {
  model?.value.traverse((child: any) => {
    if (child.isMesh) {
      water.value = child;
      child.material = waterMaterial;
      child.receiveShadow = true;
    }
  });
});
</script>

<template>
  <Suspense>
    <GLTFModel path="/models/sea.glb" ref="modelSea" :position-y="0" />
  </Suspense>
</template>
