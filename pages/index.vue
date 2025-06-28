<script setup lang="ts">
import { PCFSoftShadowMap, SRGBColorSpace, ACESFilmicToneMapping } from "three";
const storeControl = useControlsStore();
const storeGeneral = useGeneralStore();
const { isStartedGame, settingsAntialias } = storeToRefs(storeGeneral);
const title = ref("Marcin Dekier");
import { useControls, TresLeches, Perf } from "@tresjs/leches";
// import { StatsGl, Stats } from "@tresjs/cientos";

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

const gl = {
  alfa: true,
  shadows: true,
  physicallyCorrectLights: false,
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

const tresCanvasKey = ref("sdjkfbskjdfs");
</script>

<template>
  <canvas id="drawing-canvas" height="200" width="200" />

  <client-only>
    <HudGeneral />
    <TresLeches />
  </client-only>
  <div :key="tresCanvasKey">
    <TresCanvas
      :class="{ 'hide-cursor': isStartedGame }"
      clear-color="#80CBF8"
      window-size
      v-bind="gl"
      :antialias="settingsAntialias"
    >
      <Resolution />
      <!-- <Stats /> -->
      <!-- <StatsGl /> -->
      <Perf />
      <Camera />

      <Light v-if="positionCharacter" />
      <Suspense>
        <ModelsFloraMain v-if="positionCharacter" />
      </Suspense>
      <Suspense>
        <ModelsSeaMain v-if="positionCharacter" />
      </Suspense>
      <Suspense>
        <ModelsCharacterAll />
      </Suspense>
    </TresCanvas>
  </div>
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
