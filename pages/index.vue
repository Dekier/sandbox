<script setup lang="ts">
// import { Environment } from "@tresjs/cientos";
import { PCFSoftShadowMap, SRGBColorSpace, ACESFilmicToneMapping } from "three";
import { TresLeches, useControls } from "@tresjs/leches";
const { isMobile } = useDevice();
import { useHudStore } from "~/stores/hud";
const hudStore = useHudStore();

const gl = {
  alfa: false,
  shadows: true,
  physicallyCorrectLights: true,
  gammaFactor: 2.2,
  outputColorSpace: SRGBColorSpace,
  toneMapping: ACESFilmicToneMapping,
  toneMappingExposure: 2.4,
  shadowMap: { enabled: true, type: PCFSoftShadowMap },
  powerPreference: "high-performance",
};
const isActiveAntialias = ref(false);
isActiveAntialias.value = isMobile ? false : true;

useControls("fpsgraph");
</script>

<template>
  <HudGeneral />
  <LoadingScreen />
  <dev-only>
    <!-- <TresLeches /> -->
  </dev-only>
  <client-only>
    <TresCanvas
      clear-color="#E0D6BE"
      window-size
      ref="renderer"
      v-bind="gl"
      :antialias="isActiveAntialias"
    >
      <camera />
      <!-- <Suspense>
      <Environment files="hdrs/hdr2.hdr" :background="true" />
    </Suspense> -->

      <Suspense>
        <Flag />
      </Suspense>
      <!-- <Suspense>
        <Hause />
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
      </Suspense>
      <Suspense>
        <Lantern />
      </Suspense>
      <Light /> -->
      <!-- <PostProcessing /> -->
    </TresCanvas>
  </client-only>
</template>
