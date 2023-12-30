<script setup lang="ts">
const characterStore = useCharacterStore();
const { positionCharacter } = storeToRefs(characterStore);
</script>

<template>
  <Suspense>
    <ModelsFloraTree v-if="positionCharacter" />
  </Suspense>
  <!-- <Suspense>
    <ModelsFloraTreeSecond v-if="positionCharacter" />
  </Suspense>
  <Suspense>
    <ModelsFloraBush v-if="positionCharacter" />
  </Suspense>
  <Suspense>
    <ModelsFloraSmallLeaves v-if="positionCharacter" />
  </Suspense>
  <Suspense>
    <ModelsFloraFern v-if="positionCharacter" />
  </Suspense> -->
  <!-- <Suspense>
      <ModelsFloraBushStick v-if="positionCharacter" />
    </Suspense> -->
</template>
