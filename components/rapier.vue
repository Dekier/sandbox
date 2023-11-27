<script setup lang="ts">
import {
  MeshStandardMaterial,
  CapsuleGeometry,
  Mesh,
  BoxGeometry,
  Quaternion,
  PlaneGeometry,
  Euler,
  CylinderGeometry,
  SphereGeometry,
  ConeGeometry,
  MeshPhongMaterial,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import RAPIER, { RigidBody } from "@dimforge/rapier3d";
import { CharacterControls } from "../components/utils/characterControls";
const { onLoop } = useRenderLoop();
const characterStore = useCharacterStore();
const { positionCharacterLookAt, characterModel } = storeToRefs(characterStore);

const { scene, camera, renderer } = useTresContext();

// Use the RAPIER module here.
let gravity = { x: 0.0, y: -9.81, z: 0.0 };
let world = new RAPIER.World(gravity);

const boxSize = { hx: 1.6, hy: 0.3, hz: 0.3 };
// Tworzenie fizyki dla płaskiej powierzchni w Rapier.js
// const planeRigidBodyDesc = RAPIER.RigidBodyDesc.newStatic();
// const planeColliderDesc = RAPIER.ColliderDesc.cuboid(100.0, 0.0001, 100.0);
// const planeRigidBodyHandle = world.createRigidBody(planeRigidBodyDesc);
// const planeCollider = world.createCollider(
//   planeColliderDesc,
//   planeRigidBodyHandle
// );

// const geometryFloor = new PlaneGeometry(100, 100);
// const materialFloor = new MeshStandardMaterial({ color: 0x00ffff });
// const threeMeshFloor = new Mesh(geometryFloor, materialFloor);
// threeMeshFloor.receiveShadow = true;
// threeMeshFloor.castShadow = true;
// threeMeshFloor.rotation.x = -Math.PI / 2;
// threeMeshFloor.position.y = 0;
// scene.value.add(threeMeshFloor);

// END FLOOR

// Tworzenie ściany
const wallSize = { hx: 1, hy: 2, hz: 0.1 }; // Rozmiary ściany
const wallGeometry = new BoxGeometry(
  wallSize.hx * 2,
  wallSize.hy * 2,
  wallSize.hz * 2
);
const wallMaterial = new MeshStandardMaterial({ color: 0xff0000 });
const wallMesh = new Mesh(wallGeometry, wallMaterial);
wallMesh.position.set(0, wallSize.hy, -5); // Ustawienie pozycji ściany
scene.value.add(wallMesh);

// Dodanie Collidera dla ściany
const wallBodyType = RAPIER.RigidBodyDesc.fixed().setTranslation(
  0,
  wallSize.hy,
  -5
);
const wallRigidBody = world.createRigidBody(wallBodyType);
const wallColliderType = RAPIER.ColliderDesc.cuboid(
  wallSize.hx,
  wallSize.hy,
  wallSize.hz
);
world.createCollider(wallColliderType, wallRigidBody);

// START BOX
const numBoxes = 3;
const { nodes } = await useGLTF("/models/rock.glb", { draco: true });
const model = nodes.stone;
console.log(model);
const bodys: { rigid: RigidBody; mesh: Mesh }[] = [];

for (let i = 0; i < numBoxes; i++) {
  const geometry = new BoxGeometry(
    boxSize.hx * 2,
    boxSize.hy * 2,
    boxSize.hz * 2
  );
  const material = new MeshStandardMaterial({ color: 0x00ff00 });
  const threeMesh = new Mesh(geometry, material);
  threeMesh.receiveShadow = true;
  threeMesh.castShadow = true;

  const randomX = Math.random() * 20;
  const randomY = Math.random() * 20;
  const randomZ = Math.random() * 20;
  if (i === 0) {
    setTimeout(() => {
      scene.value.add(threeMesh);
      const bodyType = RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 4.0, 0);
      const rigidBody = world.createRigidBody(bodyType);

      const colliderType = RAPIER.ColliderDesc.cuboid(
        boxSize.hx,
        boxSize.hy,
        boxSize.hz
      ).setMass(100.1);
      world.createCollider(colliderType, rigidBody);

      bodys.push({ rigid: rigidBody, mesh: model });
    }, 3000);
  } else {
    threeMesh.position.set(randomX, randomY, randomZ);
    scene.value.add(threeMesh);
    const bodyType = RAPIER.RigidBodyDesc.fixed().setTranslation(
      randomX,
      0.3,
      randomZ
    );
    const rigidBody = world.createRigidBody(bodyType);
    const colliderType = RAPIER.ColliderDesc.cuboid(
      boxSize.hx,
      boxSize.hy,
      boxSize.hz
    );
    world.createCollider(colliderType, rigidBody);
    bodys.push({ rigid: rigidBody, mesh: threeMesh });
  }
}
// END BOX

let characterControls: CharacterControls | null = null;
let dynamicCollider: RAPIER.ColliderDesc | null = null;
watch(characterModel, () => {
  let bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(
    0,
    3,
    0
  );
  let rigidBody = world.createRigidBody(bodyDesc);
  dynamicCollider = RAPIER.ColliderDesc.capsule(2.2, 0.7);
  world.createCollider(dynamicCollider, rigidBody);

  if (camera.value) {
    const orbitControls = new OrbitControls(
      camera.value,
      renderer.value.domElement
    );
    orbitControls.enableDamping = true;
    orbitControls.enablePan = true;
    orbitControls.minDistance = 5;
    orbitControls.maxDistance = 20;
    // orbitControls.maxPolarAngle = Math.PI / 2 - 0.05; // prevent camera below ground
    // orbitControls.minPolarAngle = Math.PI / 4; // prevent top down view
    // orbitControls.target =
    orbitControls.update();

    characterControls = new CharacterControls(
      characterModel.value,
      orbitControls,
      camera.value,
      "Idle",
      new RAPIER.Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: -1, z: 0 }),
      rigidBody
    );
  }
});
const keysPressed: any = {};

document.addEventListener(
  "keydown",
  (event) => {
    keysPressed[event.key.toLowerCase()] = true;
  },
  false
);
document.addEventListener(
  "keyup",
  (event) => {
    keysPressed[event.key.toLowerCase()] = false;
  },
  false
);

onLoop(({ delta, elapsed }) => {
  world.step();

  bodys.forEach((body) => {
    let position = body.rigid.translation();
    let rotation = body.rigid.rotation();

    body.mesh.position.x = position.x;
    body.mesh.position.y = position.y;
    body.mesh.position.z = position.z;

    body.mesh.setRotationFromQuaternion(
      new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w)
    );
  });
  if (characterControls) {
    characterControls.update(world, delta, keysPressed);
  }
});

const generateTerrain = (
  nsubdivs: number,
  scale: { x: number; y: number; z: number }
) => {
  let heights: number[] = [];

  // three plane
  const threeFloor = new Mesh(
    new PlaneGeometry(scale.x, scale.z, nsubdivs, nsubdivs),
    new MeshStandardMaterial({ color: 0x0000ff })
  );
  threeFloor.rotateX(-Math.PI / 2);
  threeFloor.receiveShadow = true;
  threeFloor.castShadow = true;
  scene.value.add(threeFloor);

  // add height data to plane
  const vertices = threeFloor.geometry.attributes.position.array;
  const dx = scale.x / nsubdivs;
  const dy = scale.z / nsubdivs;
  // store height data in map column-row map
  const columsRows = new Map();
  for (let i = 0; i < vertices.length; i += 3) {
    // translate into colum / row indices
    let row = Math.floor(Math.abs((vertices as any)[i] + scale.x / 2) / dx);
    let column = Math.floor(
      Math.abs((vertices as any)[i + 1] - scale.z / 2) / dy
    );
    // generate height for this column & row
    const randomHeight = Math.random();
    (vertices as any)[i + 2] = scale.y * randomHeight;
    // store height
    if (!columsRows.get(column)) {
      columsRows.set(column, new Map());
    }
    columsRows.get(column).set(row, randomHeight);
  }
  threeFloor.geometry.computeVertexNormals();

  // store height data into column-major-order matrix array
  for (let i = 0; i <= nsubdivs; ++i) {
    for (let j = 0; j <= nsubdivs; ++j) {
      heights.push(columsRows.get(j).get(i));
    }
  }

  let groundBodyDesc = RAPIER.RigidBodyDesc.fixed();
  let groundBody = world.createRigidBody(groundBodyDesc);
  let groundCollider = RAPIER.ColliderDesc.heightfield(
    nsubdivs,
    nsubdivs,
    new Float32Array(heights),
    scale
  );
  world.createCollider(groundCollider, groundBody);
};

let nsubdivs = 1;
// 0.0 to jest wysokość
let scale = new RAPIER.Vector3(70.0, 0.0, 70.0);
generateTerrain(nsubdivs, scale);
</script>

<template>
  <primitive :object="model" />
</template>
