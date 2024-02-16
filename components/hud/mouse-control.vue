<script setup lang="ts">
const { $gsap } = useNuxtApp();
const storeGeneral = useGeneralStore();
const characterStore = useCharacterStore();
const storeControl = useControlsStore();
const { isStartedGame, isActiveMenuGame, isMouseLocked } =
  storeToRefs(storeGeneral);
const storeHud = useHudStore();
const menuInGameStore = useMenuInGameStore();
const { tabType } = storeToRefs(menuInGameStore);

const element = document.body;
watch(isActiveMenuGame, (value) => {
  if (!value) {
    startGame();
  }
  //   const element = document.body;
  //   if (element.requestPointerLock || element.mozRequestPointerLock) {
  //     element.requestPointerLock =
  //       element.requestPointerLock || element.mozRequestPointerLock;
  //     if (!isMouseLocked.value) {
  //       element.requestPointerLock();
  //     }
  //   }
});

document.addEventListener("pointerlockchange", (event) => {
  storeGeneral.setIsMouseLocked(
    document.pointerLockElement === document.body ||
      document.mozPointerLockElement === document.body
  );
  if (
    !isMouseLocked.value &&
    !isActiveMenuGame.value &&
    tabType.value !== "island"
  ) {
    storeGeneral.setIsActiveMenuGame(true);
  }
});
document.addEventListener("mozpointerlockchange", () => {
  if (tabType.value !== "island") {
    storeGeneral.setIsMouseLocked(
      document.pointerLockElement === document.body ||
        document.mozPointerLockElement === document.body
    );
  }
});

const startGame = () => {
  if (element.requestPointerLock || element.mozRequestPointerLock) {
    element.requestPointerLock =
      element.requestPointerLock || element.mozRequestPointerLock;
    if (!isMouseLocked.value) {
      const promise = element.requestPointerLock();
      promise
        .then(() => {})
        .catch((error) => {
          startGame();
        });
    }
  }
};
element.addEventListener("pointerlockerror", (event) => {
  console.error("Error while trying to lock the pointer:", event);
});
document.body.addEventListener("keyup", (e) => {
  const key = e.code.replace("Key", "").toLowerCase();

  if (key === "m" && tabType.value !== "island" && !isActiveMenuGame.value) {
    document.exitPointerLock();
    menuInGameStore.setTabType("island");
  } else if (
    key === "m" &&
    tabType.value === "island" &&
    !isActiveMenuGame.value
  ) {
    element.requestPointerLock();
    menuInGameStore.setTabType("");
  }

  if (key === "escape" && tabType.value === "island") {
    element.requestPointerLock();
    menuInGameStore.setTabType("");
  }
});
</script>

<!-- <template>
</template> -->
