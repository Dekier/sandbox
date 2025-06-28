<script setup lang="ts">
const { getSrcItem } = useEquipmentUtils();
const storeEquipmentGround = useEquipmentStore();
const {
  equipmentItemsHandList,
  equipmentItemsBackpackList,
  equipmentItemsList,
  itemMaxCountList,
} = storeToRefs(storeEquipmentGround);
const isActive = ref(1);
const activeItem = ref();

const startDrag = (event, item) => {
  event.dataTransfer.dropEffect = "move";
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("itemID", item.id);
};

const onDrop = (event, list) => {
  let newId = null;
  if (event.srcElement.id) {
    newId = event.srcElement.id;
  }
  if (event.srcElement.offsetParent.id) {
    newId = event.srcElement.offsetParent.id;
  }
  const itemID = event.dataTransfer.getData("itemID");
  activeItem.value = parseInt(newId);
  storeEquipmentGround.updatePositionItem({
    newListId: list,
    itemID: itemID,
    newId: newId,
  });
  hoverElemntId.value = null;
};
let hoverElemntId = ref();
const setHoverElement = (id: number) => {
  if (id !== hoverElemntId.value) {
    hoverElemntId.value = id;
  }
};
const hideHoverElement = () => {
  if (hoverElemntId.value) {
    hoverElemntId.value = null;
  }
};

const getMaxCount = (title: string) => {
  return itemMaxCountList.value.find((data) => data.title === title)?.maxCount;
};

onBeforeUnmount(() => {
  activeItem.value = 0;
});
</script>

<template>
  <div class="Equipment__main-container">
    <div class="Equipment__left-container">
      <div
        class="Equipment__list-container"
        @drop="onDrop($event, 2)"
        @dragenter.prevent
        @dragover.prevent
        @dragleave="hideHoverElement"
      >
        <div
          v-for="data in equipmentItemsBackpackList"
          class="Equipment__element-container"
          :class="{
            'Equipment__element-container--selected': activeItem === data.id,
          }"
          :key="data.id"
          draggable="true"
          @dragstart="startDrag($event, data)"
          @dragover="setHoverElement(data.id)"
          @click="activeItem = data.id"
        >
          <div
            class="Equipment__element-hover"
            :class="{
              'Equipment__element-hover--active': data.id === hoverElemntId,
            }"
          ></div>
          <img
            class="Equipment__element-background"
            src="/image/backgrounds/background-rect.png"
          />
          <div class="Equipment__element-content" :id="data.id">
            <div
              v-if="data.count"
              class="Equipment__count"
              :class="{ 'Equipment__count--active': data.id === isActive }"
            >
              {{ data.count }} / {{ getMaxCount(data.title) }}
            </div>
            <img
              v-if="data.title"
              class="Equipment__image"
              :class="{ 'Equipment__image--active': data.id === isActive }"
              :src="getSrcItem(data.title)"
            />
          </div>
        </div>
      </div>
      <div class="Equipment__line" />
      <div
        class="Equipment__list-container"
        @drop="onDrop($event, 1)"
        @dragenter.prevent
        @dragover.prevent
        @dragleave="hideHoverElement"
      >
        <div
          v-for="data in equipmentItemsHandList"
          class="Equipment__element-container"
          :class="{
            'Equipment__element-container--selected': activeItem === data.id,
          }"
          :key="data.id"
          draggable="true"
          @dragstart="startDrag($event, data)"
          @dragover="setHoverElement(data.id)"
          @click="activeItem = data.id"
        >
          <div
            class="Equipment__element-hover"
            :class="{
              'Equipment__element-hover--active': data.id === hoverElemntId,
            }"
          ></div>
          <img
            class="Equipment__element-background"
            src="/image/backgrounds/background-rect.png"
          />
          <div class="Equipment__element-content" :id="data.id">
            <div
              v-if="data.count"
              class="Equipment__count"
              :class="{ 'Equipment__count--active': data.id === isActive }"
            >
              {{ data.count }} / {{ getMaxCount(data.title) }}
            </div>
            <img
              v-if="data.title"
              class="Equipment__image"
              :class="{ 'Equipment__image--active': data.id === isActive }"
              :src="getSrcItem(data.title)"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="Equipment__right-container">
      <HudMenuEquipmentDescriptions
        :active-item-title="
          activeItem ? equipmentItemsList[activeItem - 1].title : ''
        "
      />
    </div>
  </div>
</template>
<style lang="scss">
@import "equipment";
</style>
