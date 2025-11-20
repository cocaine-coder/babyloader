<template>
  <NCard size="small" style="border-radius: 0">
    <div class="content">
      <div
        class="logo"
        style="line-height: 0; display: flex; align-items: center; gap: 10px"
      >
        <NIcon size="32" :color="themeVars.primaryColor">
          <SvgLogo></SvgLogo>
        </NIcon>

        <span style="font-size: larger; font-weight: 600">BabyLoader</span>
      </div>

      <div class="menu"></div>

      <div class="suffix">
        <NButton text @click="handleToggleDebugger">
          <template #icon>
            <NIcon>
              <SvgDebug></SvgDebug>
            </NIcon>
          </template>
        </NButton>
      </div>
    </div>
  </NCard>
</template>

<script setup lang="ts">
import { NButton, NCard, NIcon, useThemeVars } from "naive-ui";
import SvgLogo from "./svg/SvgLogo.vue";
import SvgDebug from "./svg/SvgDebug.vue";
import { DI } from "../di";

const themeVars = useThemeVars();
const appContext = DI.get("app-context");

function handleToggleDebugger() {
  const scene = appContext.value?.scene;
  if (scene) {
    if (scene.debugLayer.isVisible()) scene.debugLayer.hide();
    else scene.debugLayer.show({ overlay: true });
  }
}
</script>

<style scoped>
.content {
  display: flex;
}

.menu {
  flex: 1;
}

.suffix {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
