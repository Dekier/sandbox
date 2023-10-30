<script setup lang="ts">
import { PCFSoftShadowMap, SRGBColorSpace, ACESFilmicToneMapping } from "three";

const title = ref("Marcin Dekier");
const description = ref("Marcin Dekier Sandbox (Portfolio)");
useHead({
  title,
  meta: [
    {
      name: "description",
      content: description,
    },
  ],
});
const characterStore = useCharacterStore();
const { positionCharacter } = storeToRefs(characterStore);

const { isMobile } = useDevice();
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
</script>

<template>
  <HudGeneral />
  <LoadingScreen />
  <client-only>
    <Joystick v-if="isMobile" />
    <Suspense>
      <ControllerGamepad v-if="positionCharacter" />
    </Suspense>
  </client-only>
  <TresCanvas
    clear-color="#DBC295"
    window-size
    v-bind="gl"
    :antialias="isActiveAntialias"
  >
    <Camera />
    <Light />
    <Suspense>
      <Hause />
    </Suspense>
    <Suspense>
      <HauseName />
    </Suspense>
    <Suspense>
      <Lantern />
    </Suspense>
    <Suspense>
      <Flag />
    </Suspense>
    <Suspense>
      <Ground />
    </Suspense>
    <Suspense>
      <Telescope />
    </Suspense>
    <Suspense>
      <Baner />
    </Suspense>
    <Suspense>
      <ModelsCharacterAll />
    </Suspense>
    <Suspense>
      <ModelsWardrobeAll v-if="positionCharacter" />
    </Suspense>
    <Suspense>
      <ModelsRoads />
    </Suspense>
    <Suspense>
      <ModelsRocks />
    </Suspense>
    <Suspense>
      <ModelsPlatesPlateSmallTree />
    </Suspense>
    <Suspense>
      <ModelsSmallTree v-if="positionCharacter" />
    </Suspense>
    <Suspense>
      <ModelsGrass v-if="positionCharacter" />
    </Suspense>
    <Suspense>
      <ModelsGrass1 v-if="positionCharacter" />
    </Suspense>
    <Suspense>
      <ModelsGrass2 v-if="positionCharacter" />
    </Suspense>
    <!-- <Suspense>
      <ModelsToolBox v-if="positionCharacter" />
    </Suspense>
    <Suspense>
      <ModelsTable v-if="positionCharacter" />
    </Suspense> -->
    <!-- <Suspense>
      <Shaders v-if="positionCharacter" />
    </Suspense> -->
  </TresCanvas>
</template>
