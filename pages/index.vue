<script setup lang="ts">
import { Environment } from "@tresjs/cientos";
import {
  PCFSoftShadowMap,
  CameraHelper,
  SRGBColorSpace,
  ACESFilmicToneMapping,
} from "three";
const blobRef: Ref<TresObject | null> = ref(null);
// const sky = new Sky();
// sky.scale.setScalar(10000);

// scene.value.add(helper);
// scene.add(sky);
const { pane } = useTweakPane();

const gl = {
  shadows: true,
  physicallyCorrectLights: true,
  outputColorSpace: SRGBColorSpace,
  toneMapping: ACESFilmicToneMapping,
  toneMappingExposure: 3,
  shadowMap: { enabled: true, type: PCFSoftShadowMap },
};
</script>

<template>
  <!-- <TresPerspectiveCamera :position="[11, 11, 11]" />
    <OrbitControls />
    <TresMesh ref="blobRef" :position="[0, 4, 0]">
      <TresSphereGeometry :args="[2, 32, 32]" />
      <TresShaderMaterial
        ref="materialRef"
        :vertex-shader="vertexShader"
        :fragment-shader="fragmentShader"
        :uniforms="uniforms"
      />
    </TresMesh>
    <TresMesh :rotation="[-Math.PI / 2, 0, 0]">
      <TresPlaneGeometry :args="[10, 10, 10, 10]" />
      <TresMeshBasicMaterial color="#444" />
    </TresMesh> -->
  <TresCanvas
    clear-color="#dbccb4"
    window-size
    preset="realistic"
    ref="renderer"
    v-bind="gl"
    antialias
  >
    <TresPerspectiveCamera
      :position="[25, 30, 30]"
      :fov="70"
      :aspect="1"
      :near="0.1"
      :far="10000"
    />
    <!-- <Stars /> -->
    <!-- <Suspense>
      <Environment files="hdrs/hdr2.hdr" :background="true" />
    </Suspense> -->
    <OrbitControls />
    <!-- <Suspense>
      <Seaa />
    </Suspense> -->
    <Suspense>
      <Flag />
    </Suspense>
    <Suspense>
      <Hause />
    </Suspense>
    <Suspense>
      <HauseBottom />
    </Suspense>
    <Suspense>
      <HauseBoxes />
    </Suspense>
    <Suspense>
      <Telescope />
    </Suspense>
    <Suspense>
      <Ground />
    </Suspense>
    <Light />
  </TresCanvas>
</template>
