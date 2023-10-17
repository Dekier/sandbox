<template>
  <div id="dynamic" class="Joystick"></div>
</template>

<script setup lang="ts">
const { $nipplejs } = useNuxtApp();
const storeControls = useControlsStore();
onMounted(() => {
  if (process.client) {
    addJoystick();
  }
});
let angle;
const addJoystick = () => {
  const options = {
    zone: document.getElementById("dynamic"),
    size: 120,
    multitouch: true,
    maxNumberOfNipples: 2,
    mode: "static",
    restJoystick: true,
    shape: "circle",
    position: { top: "60px", left: "60px" },
    dynamicPage: true,
  };

  const joyManager = $nipplejs.create(options);

  joyManager["0"].on("move", (evt, data) => {
    const sensitivity = 0.01;
    const deltaX = data.distance * Math.cos(data.angle.radian) * sensitivity;
    const deltaY = data.distance * Math.sin(data.angle.radian) * sensitivity;
    storeControls.setDeltaPosition(deltaX, deltaY);
    angle = Math.atan2(deltaX, -deltaY);
    storeControls.setAngle(angle);
  });

  joyManager["0"].on("end", () => {
    storeControls.setDeltaPosition(0, 0);
  });
};
</script>

<style lang="scss">
@import "joystick";
</style>
