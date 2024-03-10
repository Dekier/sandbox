<script setup lang="ts">
import { HalfFloatType } from "three";
const { renderer, scene, camera } = useTresContext();
const storeEquipmentGround = useEquipmentStore();
const { isActiveHandItemTitle } = storeToRefs(storeEquipmentGround);
const { newSetModel } = useModelSettings();

const smallAxe = ref();
onMounted(async () => {
  await nextTick();

  smallAxe.value = scene.value.getObjectByName("smallAxe");
  if (smallAxe.value) {
    newSetModel(smallAxe.value);
  }
});

watch(isActiveHandItemTitle, (value) => {
  if (value === "Small axe") {
    smallAxe.value.visible = true;
  } else {
    smallAxe.value.visible = false;
  }
});
</script>
