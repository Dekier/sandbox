<script setup lang="ts">
import { useCharacterStore } from "~/stores/character";
const storeCharacter = useCharacterStore();

import { useHudStore } from "~/stores/hud";
const storeHud = useHudStore();
</script>

<template>
  <div v-if="storeHud.isActiveCharacterCamera" class="Controls__main-container">
    <div class="Controls__row-center">
      <div
        class="Controls__label"
        :class="{ 'Controls__label--active': storeCharacter.keys.w }"
      >
        W
      </div>
    </div>
    <div class="Controls__row-center">
      <div
        class="Controls__label"
        :class="{ 'Controls__label--active': storeCharacter.keys.a }"
      >
        A
      </div>
      <div
        class="Controls__label"
        :class="{ 'Controls__label--active': storeCharacter.keys.s }"
      >
        S
      </div>
      <div
        class="Controls__label"
        :class="{ 'Controls__label--active': storeCharacter.keys.d }"
      >
        D
      </div>
    </div>
    <div class="Controls__row">
      <div
        class="Controls__label-big"
        :class="{
          'Controls__label-big--active': storeCharacter.keys.shiftleft,
        }"
      >
        SHIFT
      </div>
      <p class="Controls__text">SPRINT</p>
    </div>
    <div class="Controls__row">
      <div
        class="Controls__label-big"
        :class="{ 'Controls__label-big--active': storeCharacter.keys.space }"
      >
        SPACE
      </div>
      <p class="Controls__text">JUMP</p>
    </div>
  </div>
</template>
<style lang="scss">
@import "controls";
</style>
