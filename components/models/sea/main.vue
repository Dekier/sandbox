<script setup lang="ts">
const seaStore = useSeaStore();
const { bigRocksList } = storeToRefs(seaStore);
const storeModularGround = useModularGroundStore();
const { seaModularList } = storeToRefs(storeModularGround);
seaStore.setSeaLists(seaModularList.value);
</script>

<template>
  <Suspense>
    <ModelsSeaWater />
  </Suspense>
</template>
