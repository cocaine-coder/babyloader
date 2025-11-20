import type { ArcRotateCamera } from "@babylonjs/core";

export namespace Utils {
    export function cameraInAxis(camera: ArcRotateCamera) {
        const { alpha, beta } = camera;
        const sinAlpha = Math.sin(alpha);
        const sinBeta = Math.sin(beta);

        return (numberEquals(Math.abs(sinAlpha), 1) || numberEquals(Math.abs(sinAlpha), 0)) &&
            (numberEquals(Math.abs(sinBeta), 1) || numberEquals(Math.abs(sinBeta), 0.01))
    }

    function numberEquals(a: number, b: number, epsilon: number = 0.000001) {
        return Math.abs(a - b) < epsilon;
    }
}