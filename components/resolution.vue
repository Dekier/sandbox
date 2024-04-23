<script setup lang="ts">
const storeGeneral = useGeneralStore();
const { settingsPixelRatio } = storeToRefs(storeGeneral);
const { renderer } = useTresContext();

watch(settingsPixelRatio, () => {
  renderer.value.setPixelRatio(settingsPixelRatio.value);
});
</script>
