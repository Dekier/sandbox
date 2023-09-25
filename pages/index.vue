<script setup lang="ts">
import { ref, onMounted } from "vue";
// import { Environment } from "@tresjs/cientos";
import { PCFSoftShadowMap, SRGBColorSpace, ACESFilmicToneMapping } from "three";
// import { TresLeches, useControls } from "@tresjs/leches";
// import { useGeneralStore } from "~/stores/general";
// const generalStore = useGeneralStore();

// const title = ref("Marcin Dekier");
// const description = ref("Marcin Dekier Sandbox (Portfolio)");
// useHead({
//   title,
//   meta: [
//     {
//       name: "description",
//       content: description,
//     },
//   ],
// });

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
onMounted(() => {
  isActiveAntialias.value = !navigator.userAgentData.mobile;
  // generalStore.setIsMobile(navigator.userAgentData.mobile);
});

// useControls("fpsgraph");
</script>

<template>
  <HudGeneral />
  <!-- <LoadingScreen /> -->
  <!-- <dev-only> -->
  <!-- <TresLeches /> -->
  <!-- </dev-only> -->
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

      <!-- 
      <Suspense>
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
      <Suspense>
        <Flag />
      </Suspense>
      <Suspense>
        <Ground />
      </Suspense>
    </TresCanvas>
  </client-only>
</template>
