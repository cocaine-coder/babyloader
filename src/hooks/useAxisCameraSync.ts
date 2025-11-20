import { Camera, type ArcRotateCamera } from "@babylonjs/core";
import { shallowRef } from "vue";
import { DI } from "../di";
import { Utils } from "../libs";

export type TAxisTransform = {
    axisType: "X" | "Y" | "Z";
    direction: -1 | 1;
    translate: { x: number; y: number };
};

export function useAxisCameraSync(camera: ArcRotateCamera, axisSize: number = 40) {
    const appContext = DI.get("app-context");
    const axises = shallowRef<TAxisTransform[]>(calcAxises(camera.alpha, camera.beta));
    let isInAxisSetting = false;

    camera.onViewMatrixChangedObservable.add(() => {
        const alpha = camera.alpha;
        const beta = camera.beta;
        axises.value = calcAxises(alpha, beta);

        // 处于平行于某个轴
        if (Utils.cameraInAxis(camera)) {
            if (isInAxisSetting) {
                const canvas = appContext.value!.engine.getRenderingCanvas()!;
                const ratio = canvas.clientHeight / canvas.clientWidth;
                const radius = camera.radius;

                camera.orthoLeft = - Math.abs(radius);
                camera.orthoRight = Math.abs(radius);
                camera.orthoTop = Math.abs(radius) * ratio;
                camera.orthoBottom = -Math.abs(radius) * ratio;
                camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
            }
        } else {
            if (isInAxisSetting) {
                appContext.value?.gridAxisManager.unfreezeInAxis();

                if (camera.mode === Camera.ORTHOGRAPHIC_CAMERA)
                    camera.mode = Camera.PERSPECTIVE_CAMERA;

                isInAxisSetting = false;
            }
        }
    });

    function handleAxisChange(type: TAxisTransform["axisType"], direction: -1 | 1) {
        switch (type) {
            case "X":
                camera.beta = Math.PI / 2;
                camera.alpha = direction > 0 ? 0 : Math.PI;
                break;
            case "Z":
                camera.beta = Math.PI / 2;
                camera.alpha = direction > 0 ? Math.PI / 2 : -Math.PI / 2;
                break;
            case "Y":
                camera.alpha = 0;
                camera.beta = direction > 0 ? 0 : Math.PI;
                break;
        }

        isInAxisSetting = true;
        appContext.value?.gridAxisManager.freezeInAxis(type, direction);
    }

    function calcAxises(alpha: number, beta: number) {

        const x_x = axisSize * Math.sin(-alpha);
        const z_x = axisSize * Math.sin(alpha + Math.PI / 2);
        const y_x = 0;

        const x_y = axisSize * Math.cos(beta) * Math.cos(-alpha);
        const z_y = -axisSize * Math.cos(beta) * Math.cos(alpha + Math.PI / 2);
        const y_y = -axisSize * Math.sin(beta);

        const result = new Array<TAxisTransform>();

        const x0: TAxisTransform = {
            axisType: "X",
            direction: 1,
            translate: {
                x: x_x,
                y: x_y,
            },
        };
        const x1: TAxisTransform = {
            axisType: "X",
            direction: -1,
            translate: {
                x: -x_x,
                y: -x_y,
            },
        };
        const y0: TAxisTransform = {
            axisType: "Y",
            direction: 1,
            translate: {
                x: y_x,
                y: y_y,
            },
        };
        const y1: TAxisTransform = {
            axisType: "Y",
            direction: -1,
            translate: {
                x: -y_x,
                y: -y_y,
            },
        };
        const z0: TAxisTransform = {
            axisType: "Z",
            direction: 1,
            translate: {
                x: z_x,
                y: z_y,
            },
        };
        const z1: TAxisTransform = {
            axisType: "Z",
            direction: -1,
            translate: {
                x: -z_x,
                y: -z_y,
            },
        };

        result.push(beta < Math.PI / 2 ? y1 : y0);
        const sinAlpha = Math.sin(alpha);
        const cosAlpha = Math.cos(alpha);

        const otherY = result[0] === y0 ? y1 : y0;

        if (cosAlpha >= Math.cos(Math.PI / 4)) {
            // X 在最前面
            result.push(x1);
            result.push(z1);
            result.push(z0);
            result.push(x0);
        } else if (cosAlpha <= -Math.cos(Math.PI / 4)) {
            // 负X 在最前面
            result.push(x0);
            result.push(z0);
            result.push(z1);
            result.push(x1);
        } else if (sinAlpha >= Math.cos(Math.PI / 4)) {
            // Z 在最前面
            result.push(z1);
            result.push(x1);
            result.push(x0);
            result.push(z0);
        } else {
            // 负Z 在最前面
            result.push(z0);
            result.push(x0);
            result.push(x1);
            result.push(z1);
        }

        if (Math.abs(beta - Math.PI / 2) >= (Math.PI * 2) / 5) result.push(otherY);
        else result.splice(result.length - 1, 0, otherY);

        return result;
    }

    return { axises, handleAxisChange };
}