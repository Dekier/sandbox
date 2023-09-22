<script setup lang="ts">
// import { Environment } from "@tresjs/cientos";
import { PCFSoftShadowMap, SRGBColorSpace, ACESFilmicToneMapping } from "three";
import { useControls, TresLeches } from "@tresjs/leches";
const { $gsap } = useNuxtApp();

const isActiveOrbitControl = ref(false);
const { isMobile } = useDevice();
const gl = {
  // alfa: false,
  shadows: true,
  physicallyCorrectLights: true,
  gammaFactor: 2.2,
  antialias: isMobile ? false : true,
  outputColorSpace: SRGBColorSpace,
  toneMapping: ACESFilmicToneMapping,
  toneMappingExposure: 2.4,
  shadowMap: { enabled: true, type: PCFSoftShadowMap },
  // powerPreference: "high-performance",
};

useControls("fpsgraph");
</script>

<template>
  <!-- <LoadingScreen />
  <TresLeches /> -->
  <TresCanvas clear-color="#E0D6BE" window-size ref="renderer" v-bind="gl">
    <camera />
    <!-- <Suspense>
      <Environment files="hdrs/hdr2.hdr" :background="true" />
    </Suspense> -->

    <!-- <Suspense>
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
      <HauseName />
    </Suspense>
    <Suspense>
      <Telescope />
    </Suspense>
    <Suspense>
      <Ground />
    </Suspense>
    <Suspense>
      <Baner />
    </Suspense> -->
    <Suspense>
      <Lantern />
    </Suspense>
    <Light />
    <!-- <PostProcessing /> -->
  </TresCanvas>
</template>
