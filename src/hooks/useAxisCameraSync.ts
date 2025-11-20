import type { ArcRotateCamera } from "@babylonjs/core";
import { computed, ref, watchEffect } from "vue";
import { DI } from "../di";

export type TAxisTransform = {
    axisType: "X" | "Y" | "Z";
    direction: -1 | 1;
    translate: { x: number; y: number };
};

export function useAxisCameraSync(camera: ArcRotateCamera, axisSize: number = 40) {
    const appContext = DI.get("app-context");
    const alpha = ref(camera.alpha);
    const beta = ref(camera.beta);

    const axises = computed(() => {
        const x_x = axisSize * Math.sin(-alpha.value);
        const z_x = axisSize * Math.sin(alpha.value + Math.PI / 2);
        const y_x = 0;

        const x_y = axisSize * Math.cos(beta.value) * Math.cos(-alpha.value);
        const z_y = -axisSize * Math.cos(beta.value) * Math.cos(alpha.value + Math.PI / 2);
        const y_y = -axisSize * Math.sin(beta.value);

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

        result.push(beta.value < Math.PI / 2 ? y1 : y0);
        const sinAlpha = Math.sin(alpha.value);
        const cosAlpha = Math.cos(alpha.value);

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

        if (Math.abs(beta.value - Math.PI / 2) >= (Math.PI * 2) / 5) result.push(otherY);
        else result.splice(result.length - 1, 0, otherY);

        return result;
    });

    function handleAxisClick(type: TAxisTransform["axisType"], direction: -1 | 1) {
        switch (type) {
            case "X":
                beta.value = Math.PI / 2;
                alpha.value = direction > 0 ? 0 : Math.PI;
                break;
            case "Z":
                beta.value = Math.PI / 2;
                alpha.value = direction > 0 ? Math.PI / 2 : -Math.PI / 2;
                break;
            case "Y":
                alpha.value = 0;
                beta.value = direction > 0 ? 0 : Math.PI;
                break;
        }

        appContext.value?.gridAxisManager.setOrthogonal(type, direction);
    }

    watchEffect(() => {
        camera.alpha = alpha.value;
        camera.beta = beta.value;
    });

    camera.onViewMatrixChangedObservable.add(() => {
        alpha.value = camera.alpha;
        beta.value = camera.beta;
    });

    return { axises, handleAxisClick };
}