import { LoadAssetContainerAsync, type Scene } from "@babylonjs/core";

export class ModelsManager {
    public static readonly allowed_extensions = [".glb", ".ply", ".splat", ".spz", ".fbx", ".stl"];

    /**
     *
     */
    constructor(private scene: Scene) {

    }

    async loadModel(files: FileList) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            await LoadAssetContainerAsync(file!, this.scene)
        }
    }
}