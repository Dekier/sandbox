<script setup lang="ts">
import { Mesh, Vector2, Vector3, PlaneGeometry, ShaderMaterial } from "three";
import { Sky, Lensflare } from "@tresjs/cientos";

const { scene, renderer, camera } = useTresContext();

const storeControl = useControlsStore();
const characterStore = useCharacterStore();
const { positionCharacter } = storeToRefs(characterStore);

import skyVertexSource from "@/src/shaders/vertex-sky.glsl";
import skyFragmentSource from "@/src/shaders/fragment-sky.glsl";

// const { onLoop, resume } = useRenderLoop();

//Sun
//Height over horizon in range [0, PI/2.0]
const elevation = 0.08;
//Rotation around Y axis in range [0, 2*PI]
const azimuth = -1.0;
const fogFade = 0.009;
const FOV = 45;
const backgroundMaterial = new ShaderMaterial({
  uniforms: {
    sunDirection: {
      value: new Vector3(
        Math.sin(azimuth),
        Math.sin(elevation),
        Math.cos(azimuth)
      ),
    },
    cameraPos: { value: camera.value.position },
    resolution: {
      value: new Vector2(window.innerWidth, window.innerHeight),
    },
    fogFade: { value: fogFade },
    fov: { value: FOV },
  },
  vertexShader: skyVertexSource,
  fragmentShader: skyFragmentSource,
});

backgroundMaterial.depthWrite = false;
const backgroundGeometry = new PlaneGeometry(45000, 45000, 1, 1);
const background = new Mesh(backgroundGeometry, backgroundMaterial);

onMounted(async () => {
  await nextTick();
  scene.value.add(background);
});

const sunPosition = ref([]);

watch(positionCharacter, () => {
  sunPosition.value = [
    positionCharacter.value.x + -100,
    60,
    positionCharacter.value.z + 87,
  ];
});
const { onLoop } = useRenderLoop();
onLoop(({ _delta, elapsed }) => {
  if (positionCharacter.value) {
    sunPosition.value = [
      positionCharacter.value.x + -142,
      65,
      positionCharacter.value.z + 90,
    ];
  }
});
</script>

<!-- <template>
  <TresPointLight v-if="positionCharacter" :intensity="0">
    <Lensflare
      :position="sunPosition"
      :elements="[{ color: 'red' }, { color: 'yellow' }]"
      :seed="8193"
    />
  </TresPointLight>
</template> -->
