<script setup lang="ts">
import { NConfigProvider, darkTheme } from "naive-ui";
import BabylonScene from "./components/BabylonScene.vue";
import Nav from "./components/Nav.vue";
import emitter from "./eventbus";
import { generateGrid } from "./libs";
import { MeshBuilder } from "@babylonjs/core";
import ViewportGizmo from "./components/ViewportGizmo.vue";

darkTheme.common.cardColor = "#272a2c";

emitter.on("scene_loaded",e=>{
  generateGrid(e.scene);
  const box = MeshBuilder.CreateBox("box", {}, e.scene);
  box.position.x = 1;
  box.position.z = 2;
  box.position.y = 0.5;
  box.renderingGroupId = 2;
});
</script>

<template>
  <NConfigProvider
    :theme="darkTheme"
    style="display: flex; flex-direction: column; height: 100vh"
  >
    <Nav></Nav>
    <BabylonScene></BabylonScene>

    <ViewportGizmo style="position: absolute;top: 100px;right: 0;"></ViewportGizmo>
  </NConfigProvider>
</template>

<style scoped></style>
