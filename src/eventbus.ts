import type { Engine, ISceneLoaderProgressEvent, Scene } from '@babylonjs/core';
import mitt from 'mitt';

const emitter = mitt<{
    scene_loaded: { engine: Engine, scene: Scene }
    import_model: string | File | ArrayBufferView
    import_model_progress: ISceneLoaderProgressEvent
    toggle_debugger: void
}>();

export default emitter;