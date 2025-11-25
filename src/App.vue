<script setup lang="ts">
import BabylonScene from "./components/BabylonScene.vue";
import Nav from "./components/Nav.vue";
import { NConfigProvider, darkTheme } from "naive-ui";

import { shallowRef } from "vue";
import {
  MeshBuilder,
  type ArcRotateCamera,
  type Engine,
  type Scene,
} from "@babylonjs/core";
import { GridAxisManager } from "./libs";
import { DI, type TAppContext } from "./di";

const ctx = shallowRef<TAppContext>();

DI.add("app-context", ctx as any);

function handleSceneLoaded(
  engine: Engine,
  scene: Scene,
  camera: ArcRotateCamera
) {
  ctx.value = {
    scene,
    engine,
    camera,
    gridAxisManager: new GridAxisManager(scene),
  };

  const box = MeshBuilder.CreateBox("box", {}, scene);
  box.renderingGroupId = 1;
  box.position.y = 1;
  box.position.z = 2;
  box.position.x = 1;
}
</script>

<template>
  <NConfigProvider
    :theme="darkTheme"
    :theme-overrides="{ common: { cardColor: '#272a2c' } }"
    style="display: flex; flex-direction: column; height: 100vh"
  >
    <Nav></Nav>
    <BabylonScene @loaded="handleSceneLoaded"></BabylonScene>
  </NConfigProvider>
</template>

<style scoped></style>
