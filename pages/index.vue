<script setup lang="ts">
import { PCFSoftShadowMap, SRGBColorSpace, ACESFilmicToneMapping } from "three";
const storeControl = useControlsStore();
const { escape } = storeToRefs(storeControl);
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
  alfa: true,
  shadows: true,
  physicallyCorrectLights: true,
  gammaFactor: 2.2,
  gammaOutput: true,
  outputColorSpace: SRGBColorSpace,
  toneMapping: ACESFilmicToneMapping,
  toneMappingExposure: 2.2,
  shadowMap: { enabled: true, type: PCFSoftShadowMap },
  powerPreference: "high-performance",
  stencil: false,
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
    :class="{ 'hide-cursor': escape }"
    clear-color="#80CBF8"
    window-size
    v-bind="gl"
    :antialias="isActiveAntialias"
  >
    <Camera />
    <Light />
    <!-- <Suspense>
      <Rapier />
    </Suspense> -->
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
    <!-- <Suspense>
      <Ground2 />
    </Suspense> -->

    <!-- <Suspense>
      <Telescope />
    </Suspense> -->
    <Suspense>
      <Baner />
    </Suspense>
    <!-- <Suspense>
      <Rabbit />
    </Suspense> -->
    <!-- <Suspense>
      <ModelsRoads />
    </Suspense> -->
    <Suspense>
      <Ground2 />
    </Suspense>
    <!-- <Suspense>
      <Sky />
    </Suspense> -->
    <!-- <Suspense>
      <Elo />
    </Suspense> -->
    <Suspense>
      <ModelsCharacterAll />
    </Suspense>
    <Suspense>
      <ModelsWardrobeAll v-if="positionCharacter" />
    </Suspense>
    <!-- <Suspense>
      <ModelsRocks />
    </Suspense> -->
    <!-- <Suspense>
      <ModelsPlatesPlateSmallTree />
    </Suspense> -->
    <!-- <Suspense>
      <ModelsSmallTree v-if="positionCharacter" />
    </Suspense> -->
    <!-- <Suspense>
      <ModelsGrass v-if="positionCharacter" />
    </Suspense> -->
    <!-- <Suspense>
      <ModelsGrass1 v-if="positionCharacter" />
    </Suspense>
    <Suspense>
      <ModelsGrass2 v-if="positionCharacter" />
    </Suspense> -->
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

<style lang="scss">
.hide-cursor {
  cursor: none;
}
</style>
