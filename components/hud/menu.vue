<script setup lang="ts">
const storeGeneral = useGeneralStore();
const { isActiveMenuGame } = storeToRefs(storeGeneral);
const startGame = () => {
  storeGeneral.setIsActiveMenuGame(false);
  setTimeout(() => {
    storeGeneral.setIsActiveBlockAnimation(false);
  }, 100);
  // storeGeneral.setIsStartedGame(true);
  isActiveSettings.value = false;
};

const isActiveSettings = ref(false);
</script>

<template>
  <div
    id="button-start-game"
    v-if="isActiveMenuGame"
    class="Menu__main-container"
  >
    <div class="Menu__center-container">
      <img
        src="/image/backgrounds/background-menu-one-side.png"
        class="Menu__background-left"
      />
      <div class="Menu__background"></div>
      <img
        src="/image/backgrounds/background-menu-one-side.png"
        class="Menu__background-right"
      />
      <div class="Menu__left-container">
        <div>"LOGO"</div>
        <div class="Menu__buttons-container">
          <button type="button" class="Menu__button" @click="startGame">
            PLAY
          </button>
          <button
            type="button"
            class="Menu__button"
            @click="isActiveSettings = !isActiveSettings"
          >
            SETTINGS
          </button>
        </div>
        <div class="Menu__text">v 0.01</div>
      </div>
      <div v-if="isActiveSettings" class="Menu__right-container">
        <HudSettings />
      </div>
    </div>
  </div>
</template>
<style lang="scss">
@import "menu";
</style>
