<script setup lang="ts">
// import { Environment } from "@tresjs/cientos";
import { PCFSoftShadowMap, SRGBColorSpace, ACESFilmicToneMapping } from "three";

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
    <!-- <Suspense>
      <Environment files="hdrs/hdr2.hdr" :background="true" />
    </Suspense> -->
    <OrbitControls />
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
    <!-- <PostProcessing /> -->
  </TresCanvas>
</template>
