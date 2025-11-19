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
    <canvas ref="canvasRef" style="width: 100%; height: 100%;"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import {
  Engine,
  Scene,
  Color4,
  LoadAssetContainerAsync,
  ArcRotateCamera,
} from "@babylonjs/core";
import "@babylonjs/loaders";
import "@babylonjs/inspector";
import emitter from "../eventbus";

const canvasRef = ref<HTMLCanvasElement | null>(null);
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
    camera.pinchDeltaPercentage = 0.05;
    camera.wheelDeltaPercentage = 0.05;
    camera.upperRadiusLimit = 500;
    camera.lowerRadiusLimit = 0.2;
    camera.panningInertia = 0;
    scene.registerBeforeRender(() => {
      camera.panningSensibility = 1000 / camera.radius; // 根据相机距离动态计算
    });

    emitter.on('update_camera',e=>{
      camera.alpha = e.alpha;
      camera.beta = e.beta;
    });

    camera.onViewMatrixChangedObservable.add(() => {
      emitter.emit("camera_change", { alpha: camera.alpha, beta: camera.beta });
    });

    engine.runRenderLoop(() => {
      scene.render();
    });

    window.addEventListener("resize", onWindowResize);

    emitter.emit("scene_loaded", { engine, scene });
    emitter.on("import_model", async (model) => {
      const assetContainer = await LoadAssetContainerAsync(model, scene, {
        onProgress: (e) => {
          emitter.emit("import_model_progress", e);
        },
      });

      assetContainer.addAllToScene();
    });

    emitter.on("toggle_debugger", () => {
      if (scene.debugLayer.isVisible()) scene.debugLayer.hide();
      else scene.debugLayer.show({ overlay: true });
    });
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", onWindowResize);
  engine?.dispose();
});
</script>

<style scoped></style>
