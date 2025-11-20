import { ArcRotateCamera, Engine, Scene } from "@babylonjs/core"
import { provide, inject, type ShallowRef } from "vue"
import type { GridAxisManager } from "./libs";

export type TAppContext = {
    scene: Scene;
    engine: Engine;
    camera: ArcRotateCamera;
    gridAxisManager: GridAxisManager;
};

type TDITypes = {
    "app-context": ShallowRef<TAppContext | undefined>
}

export const DI = {
    add<TKey extends keyof TDITypes>(key: TKey, value: TDITypes[TKey]) {
        provide(key, value as any);
    },

    get<TKey extends keyof TDITypes>(key: TKey): TDITypes[TKey] {
        return inject(key) as any;
    }
}