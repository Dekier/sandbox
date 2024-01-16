<script setup lang="ts">
import { Vector3, Vector2, Spherical, Group } from "three";
const { $gsap } = useNuxtApp();
const storeGeneral = useGeneralStore();
const characterStore = useCharacterStore();
const storeControl = useControlsStore();
const { positionCharacterLookAt, characterModel } = storeToRefs(characterStore);
const { isStartedGame, isActiveMenuGame, isMouseLocked } =
  storeToRefs(storeGeneral);
const storeHud = useHudStore();
const { isActiveFullSizeMap } = storeToRefs(storeHud);

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
    !isActiveFullSizeMap.value
  ) {
    storeGeneral.setIsActiveMenuGame(true);
  }
});
document.addEventListener("mozpointerlockchange", () => {
  if (!isActiveFullSizeMap.value) {
    storeGeneral.setIsMouseLocked(
      document.pointerLockElement === document.body ||
        document.mozPointerLockElement === document.body
    );
  }
});

// document.addEventListener("click", () => {
//   if (isStartedGame.value && !isActiveFullSizeMap.value) {
//     startGame();
//   }
// });

const startGame = () => {
  // Check if Pointer Lock is supportedm
  if (element.requestPointerLock || element.mozRequestPointerLock) {
    element.requestPointerLock =
      element.requestPointerLock || element.mozRequestPointerLock;
    if (!isMouseLocked.value) {
      const promise = element.requestPointerLock();
      promise
        .then(() => console.log("pointer is locked"))
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
  //   if (key === "escape" && !isActiveFullSizeMap.value) {
  //     storeGeneral.setIsMouseLocked(
  //       document.pointerLockElement === document.body ||
  //         document.mozPointerLockElement === document.body
  //     );
  //     // storeGeneral.setIsStartedGame(false);
  //     storeGeneral.setIsActiveMenuGame(true);
  //   }

  // if (key === "escape" && isActiveFullSizeMap.value) {
  //   storeHud.setIsActiveFullSizeMap(false);
  //   // storeGeneral.setIsStartedGame(true);
  //   startGame();
  // }

  if (key === "m" && !isActiveFullSizeMap.value && !isActiveMenuGame.value) {
    document.exitPointerLock();
    storeHud.setIsActiveFullSizeMap(true);
  } else if (
    key === "m" &&
    isActiveFullSizeMap.value &&
    !isActiveMenuGame.value
  ) {
    element.requestPointerLock();
    storeHud.setIsActiveFullSizeMap(false);
  }

  if (key === "escape" && isActiveFullSizeMap.value) {
    element.requestPointerLock();
    storeHud.setIsActiveFullSizeMap(false);
  }
});
</script>

<!-- <template>
</template> -->
