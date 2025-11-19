import type { Engine, ISceneLoaderProgressEvent, Scene } from '@babylonjs/core';
import mitt from 'mitt';

const emitter = mitt<{
    /**
     * 引擎初始化完成
     */
    scene_loaded: { engine: Engine, scene: Scene }

    /**
     * 导入模型
     */
    import_model: string | File | ArrayBufferView

    /**
     * 模型导入进度变化
     */
    import_model_progress: ISceneLoaderProgressEvent

    /**
     * 显示/隐藏调试器
     */
    toggle_debugger: void
    /**
     * 外部主动更新相机
     */
    update_camera: { alpha: number, beta: number }

    /**
     * 相机发生变化后的响应
     */
    camera_change: { alpha: number, beta: number }
}>();

export default emitter;