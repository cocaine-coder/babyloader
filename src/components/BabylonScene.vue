<template>
  <div
    style="
      height: 100vh;
      width: 100%;
      position: relative;
      overflow-y: auto;
      scrollbar-width: none;
    "
  >
    <ViewportGizmo v-if="cameraRef" :camera="cameraRef"></ViewportGizmo>
    <canvas ref="canvasRef" style="width: 100%; height: 100%"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef } from "vue";
import { Engine, Scene, Color4, ArcRotateCamera } from "@babylonjs/core";
import "@babylonjs/loaders";
import "@babylonjs/inspector";
import ViewportGizmo from "./ViewportGizmo.vue";

const props = defineProps<{
  onLoaded?(engine: Engine, scene: Scene, camera: ArcRotateCamera): void;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const cameraRef = shallowRef<ArcRotateCamera>();
let engine: Engine | undefined;
const onWindowResize = () => {
  engine?.resize();
};

onMounted(() => {
  if (canvasRef.value) {
    engine = new Engine(canvasRef.value, true, {}, true);
    const scene = new Scene(engine, {});
    scene.clearColor = Color4.FromHexString("#666666");
    scene.createDefaultCameraOrLight(true, true, true);

    const camera = scene.activeCamera as ArcRotateCamera;
    camera.radius = 10;
    camera.beta = (Math.PI * 2) / 5;
    camera.alpha = Math.PI / 4;
    camera.pinchDeltaPercentage = 0.05;
    camera.wheelDeltaPercentage = 0.05;
    camera.upperRadiusLimit = 500;
    camera.lowerRadiusLimit = 0.2;
    camera.panningInertia = 0;
    scene.registerBeforeRender(() => {
      camera.panningSensibility = 1000 / camera.radius; // 根据相机距离动态计算
    });

    engine.runRenderLoop(() => {
      scene.render();
    });

    window.addEventListener("resize", onWindowResize);

    props.onLoaded?.(engine, scene, camera);
    cameraRef.value = camera;
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", onWindowResize);
  engine?.dispose();
});
</script>

<style scoped></style>
