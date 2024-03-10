<script setup lang="ts">
import { PCFSoftShadowMap, SRGBColorSpace, ACESFilmicToneMapping } from "three";
const storeControl = useControlsStore();
const storeGeneral = useGeneralStore();
const { isStartedGame } = storeToRefs(storeGeneral);
const title = ref("Marcin Dekier");
import { useControls, TresLeches, Perf } from "@tresjs/leches";
import { StatsGl, Stats } from "@tresjs/cientos";

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
const { positionCharacter, positionCharacterLookAt } =
  storeToRefs(characterStore);

// const { isMobile } = useDevice();
const gl = {
  alfa: true,
  shadows: true,
  physicallyCorrectLights: true,
  gammaFactor: 2.2,
  gammaOutput: true,
  outputColorSpace: SRGBColorSpace,
  toneMapping: ACESFilmicToneMapping,
  toneMappingExposure: 2.2,
  shadowMapType: PCFSoftShadowMap,
  powerPreference: "high-performance",
  stencil: false,
};
const { value: color } = useControls({
  grass: storeGeneral.color,
});

// const { value: colorStone } = useControls({
//   stones: storeGeneral.colorStone,
// });
const { value: colorTrees } = useControls({
  trees: storeGeneral.colorTrees,
});
watch(color, (value) => {
  storeGeneral.setColor(value);
});

const { value: colorSand } = useControls({
  sand: storeGeneral.colorSand,
});
watch(colorSand, (value) => {
  storeGeneral.setColorSand(value);
});

watch(colorTrees, (value) => {
  storeGeneral.setColorTrees(value);
});
const isActiveAntialias = ref(false);
isActiveAntialias.value = true;
</script>

<template>
  <canvas id="drawing-canvas" height="200" width="200" />
  <!-- <canvas id="drawing-canvas-moving" height="200" width="200" /> -->
  <!-- <canvas id="drawing-canvas-snow" height="320" width="320" /> -->

  <LoadingScreen />
  <client-only>
    <HudGeneral />
    <TresLeches />
    <!-- <Joystick v-if="isMobile" /> -->
    <!-- <Suspense>
      <ControllerGamepad v-if="positionCharacter" />
    </Suspense> -->
  </client-only>
  <TresCanvas
    :class="{ 'hide-cursor': isStartedGame }"
    clear-color="#80CBF8"
    window-size
    v-bind="gl"
    :antialias="isActiveAntialias"
  >
    <!-- <Stats /> -->
    <!-- <StatsGl /> -->
    <Perf />
    <Camera />

    <!-- <PostProcessing v-if="positionCharacter" /> -->
    <Light v-if="positionCharacter" />
    <!-- <Suspense>
      <Fog />
    </Suspense> -->
    <!-- <Suspense>
      <Sky />
    </Suspense> -->
    <!-- <Space1Main v-if="positionCharacter" /> -->
    <!-- <Suspense>
      <Ground2 v-if="positionCharacter" />
    </Suspense> -->
    <!-- <Suspense>
      <ModelsSnow v-if="positionCharacter" />
    </Suspense> -->
    <!-- <Suspense>
      <Rapier />
    </Suspense> -->
    <!-- <Suspense>
      <Hause v-if="positionCharacter" />
    </Suspense>
    <Suspense>
      <HauseName v-if="positionCharacter" />
    </Suspense>
    <Suspense>
      <Lantern v-if="positionCharacter" />
    </Suspense>
    <Suspense>
      <Flag v-if="positionCharacter" />
    </Suspense>
    <Suspense>
      <Baner v-if="positionCharacter" />
    </Suspense> -->
    <Suspense>
      <ModelsFloraMain v-if="positionCharacter" />
    </Suspense>

    <!-- <Suspense>
      <Telescope />bush
    </Suspense> -->

    <!-- <Suspense>
      <ModelsStones v-if="positionCharacter" />
    </Suspense> -->

    <!-- <Suspense>
      <Rabbit />
    </Suspense> -->
    <Suspense>
      <ModelsCharacterAll />
    </Suspense>
    <!-- <Suspense>
      <ModelsWardrobeAll v-if="positionCharacter" />
    </Suspense> -->
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
      <ModelsToolBox v-if="positionCharacter" />
    </Suspense> -->
    <!-- <Suspense>
      <ModelsTable v-if="positionCharacter" />
    </Suspense> -->
    <!-- <Suspense>
      <Shaders v-if="positionCharacter" />
    </Suspense> -->
  </TresCanvas>
</template>

<style lang="scss">
.hide-cursor {
  // cursor: none;
}

#drawing-canvas,
#drawing-canvas-moving {
  position: absolute;
  background-color: #fff;
  top: 20px;
  left: 0px;
  right: 0px;
  margin: 0 auto;
  z-index: 2;
  opacity: 0;
  cursor: crosshair;
  touch-action: none;
  width: 200px;
  height: 200px;
  transition: width 300ms, height 300ms;
}

#drawing-canvas-moving {
  left: -400px;
}
#drawing-canvas-snow {
  position: absolute;
  background-color: #000000;
  top: 20px;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 3;
  opacity: 1;
  touch-action: none;
  width: 160px;
  height: 160px;
}
</style>
