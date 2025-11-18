<template>
    <div style="height: 100vh;width: 100%;position: relative;overflow-y: auto;scrollbar-width: none;">
        <canvas ref="canvasRef" style="width: 100%;height: 100%;"></canvas>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { Engine, Scene, Color4, LoadAssetContainerAsync } from "@babylonjs/core";
import '@babylonjs/loaders';
import "@babylonjs/inspector";
import emitter from "../eventbus";

const canvasRef = ref<HTMLCanvasElement | null>(null);
let engine: Engine | undefined;

const onWindowResize = () => {
    engine?.resize();
}

onMounted(() => {
    if (canvasRef.value) {
        engine = new Engine(canvasRef.value, true, {}, true);
        const scene = new Scene(engine, {});
        scene.clearColor = Color4.FromHexString("#666666");
        scene.createDefaultCameraOrLight(true, true, true);

        engine.runRenderLoop(() => {
            scene.render();
        });

        window.addEventListener("resize", onWindowResize);

        emitter.emit("scene_loaded", { engine, scene });
        emitter.on("import_model", async model => {
            const assetContainer = await LoadAssetContainerAsync(model, scene, {
                onProgress: e => {
                    emitter.emit("import_model_progress", e);
                }
            });

            assetContainer.addAllToScene();
        });

        emitter.on("toggle_debugger", () => {
            if (scene.debugLayer.isVisible())
                scene.debugLayer.hide();
            else
                scene.debugLayer.show({ "overlay": true });
        });
    }
});

onUnmounted(() => {
    window.removeEventListener("resize", onWindowResize);
    engine?.dispose();
});
</script>

<style scoped></style>