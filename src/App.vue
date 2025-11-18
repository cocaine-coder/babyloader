<script setup lang="ts">
import { NConfigProvider, darkTheme } from 'naive-ui';
import BabylonScene from './components/BabylonScene.vue';
import Nav from './components/Nav.vue';

darkTheme.common.cardColor = "#272a2c";
</script>

<template>
  <NConfigProvider :theme="darkTheme" style="display: flex; flex-direction: column;height: 100vh;">
    <Nav></Nav>
    <BabylonScene></BabylonScene>
  </NConfigProvider>
</template>

<style scoped></style>
