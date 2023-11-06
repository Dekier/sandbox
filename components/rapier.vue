<script setup lang="ts">
import { MeshBasicMaterial, Mesh, BoxGeometry } from "three";
import RAPIER from "@dimforge/rapier3d";

// Use the RAPIER module here.
let gravity = { x: 0.0, y: -9.81, z: 0.0 };
let world = new RAPIER.World(gravity);

// Create the ground
let groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 0.1, 10.0);
world.createCollider(groundColliderDesc);

// Create a dynamic rigid-body.
let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(
  0.0,
  1.0,
  0.0
);
let rigidBody = world.createRigidBody(rigidBodyDesc);

// Create a cuboid collider attached to the dynamic rigidBody.
let colliderDesc = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
let collider = world.createCollider(colliderDesc, rigidBody);

const { scene } = useTresContext();

const geometry = new BoxGeometry(1, 1, 1);
const material = new MeshBasicMaterial({ color: 0x00ff00 });
const cube = new Mesh(geometry, material);
scene.value.add(cube);

const { onLoop } = useRenderLoop();

// Zmienna przechowująca prędkość poruszania się ciała
const movementSpeed = 0.1;

const keyState = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

document.addEventListener("keydown", (event) => {
  if (event.key in keyState) {
    keyState[event.key] = true;
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key in keyState) {
    keyState[event.key] = false;
  }
});

onLoop(({ _delta, elapsed }) => {
  // Wprowadź ruch ciała w odpowiednich kierunkach
  const velocity = new RAPIER.Vector3(0, 0, 0);

  if (keyState.ArrowUp) {
    velocity.z = -movementSpeed;
  }

  if (keyState.ArrowDown) {
    velocity.z = movementSpeed;
  }

  if (keyState.ArrowLeft) {
    velocity.x = -movementSpeed;
  }

  if (keyState.ArrowRight) {
    velocity.x = movementSpeed;
  }

  // Ustaw prędkość liniową ciała
  rigidBody.setLinvel(velocity);

  // Wykonaj symulację
  world.step();

  // Aktualizuj pozycję cube na podstawie pozycji rigidBody
  const position = rigidBody.translation();
  cube.position.set(position.x, position.y, position.z);

  const rotation = cube.rotation;
  const positionVec = new RAPIER.Vector3(position.x, position.y, position.z);
  rigidBody.setTranslation(positionVec);

  const rotationQuat = new RAPIER.Quaternion(
    rotation.x,
    rotation.y,
    rotation.z,
    rotation.w
  );
  rigidBody.setRotation(rotationQuat);
});
</script>

<template></template>
