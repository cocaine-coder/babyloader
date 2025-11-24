import { LoadAssetContainerAsync, type Scene } from "@babylonjs/core";
import { MTLFileLoader } from "@babylonjs/loaders";

export class ModelsManager {
    public static readonly allowed_extensions = [".glb", ".ply", ".splat", ".spz", ".fbx", ".stl"];

    /**
     *
     */
    constructor(private scene: Scene) {

    }

    async loadModel(files: FileList) {
    }
}