import { AssetContainer, GUID, LoadAssetContainerAsync, Mesh, RandomGUID, TransformNode, type ISceneLoaderProgressEvent, type Scene } from "@babylonjs/core";

export class ModelsManager {
    public static readonly allowed_extensions = [".glb", ".ply", ".splat", ".spz", ".fbx", ".stl", ".obj"];
    readonly renderingGroupId = 1;
    readonly root = new TransformNode("root-models");

    private readonly store = new Map<string, {
        container: AssetContainer;
        root: Mesh;
    }>();

    /**
     *
     */
    constructor(private scene: Scene) {
        this.root._scene = this.scene;
    }

    async loadModel(files: FileList, progresses: Array<{ name: string, onProgress: (event: ISceneLoaderProgressEvent) => void }>) {

        const tasks = new Array<Promise<AssetContainer>>();

        for (let i = 0; i < files.length; i++) {
            const file = files[i]!;
            const fileName = file.name;

            if (ModelsManager.allowed_extensions.some(ext => fileName.endsWith(ext))) {
                progresses.push({
                    name: fileName,
                    onProgress:e=>{
                        
                    }
                })

                LoadAssetContainerAsync(file, this.scene, {
                    onProgress: (event) => {

                    }
                });
            }
        }

        const containers = await Promise.all(tasks);

        containers.forEach(container => {
            const itemRoot = container.createRootMesh();
            itemRoot.id = RandomGUID();
            itemRoot.name = itemRoot.id;
            itemRoot.parent = this.root;
            itemRoot.renderingGroupId = this.renderingGroupId;
            container.meshes.forEach(mesh => {
                mesh.renderingGroupId = this.renderingGroupId;
            });

            this.store.set(itemRoot.id, {
                container,
                root: itemRoot
            });

            container.addAllToScene();
        });

    }
}