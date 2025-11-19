import { Color3, CreateGreasedLine, MeshBuilder, TransformNode, Vector3, type Scene } from "@babylonjs/core";
import { GridMaterial } from "@babylonjs/materials";

export function generateGrid(scene: Scene) {
    const root = new TransformNode("auxiliary", scene);

    const grid = new GridMaterial("grid", scene);
    grid.mainColor = new Color3(0.59, 0.59, 0.59);
    grid.lineColor = Color3.White();
    grid.opacity = 0.98;
    grid.majorUnitFrequency = 10;
    grid.minorUnitVisibility = 0.4;
    grid.backFaceCulling = false;

    const ground = MeshBuilder.CreateGround("ground", { width: 10000, height: 10000, subdivisions: 1 }, scene);
    ground.material = grid;
    ground.renderingGroupId = 0;
    ground.parent = root;

    const axis = createXZAxis(scene);
    axis.parent = root;

    return { ground, axis }
}

function createXZAxis(scene: Scene) {
    const width = 0.1;
    const extra = width / 2;

    const axis = new TransformNode("axis", scene);

    [
        { name: "x-axis", points: [[5000, 0, 0, extra, 0, 0], [-extra, 0, 0, - 5000, 0, 0]], color: Color3.FromHexString("#ff3333"), rotation: new Vector3(Math.PI / 2, 0, 0) },
        { name: "z-axis", points: [[0, 0, 5000, 0, 0, extra], [0, 0, -extra, 0, 0, -5000]], color: Color3.FromHexString("#3333ff"), rotation: new Vector3(0, 0, Math.PI / 2) },
        { name: "0-base", points: [[extra, 0, 0, -extra, 0, 0]], color: Color3.White(), rotation: new Vector3(Math.PI / 2, 0, 0) }]
        .forEach(x => {
            const line = CreateGreasedLine(x.name, {
                points: x.points,
                ribbonOptions: {
                    directions: Vector3.DownReadOnly,
                },
            }, {
                color: x.color,
                width: width,
            }, scene)
            line.rotation = x.rotation;
            line.renderingGroupId = 1;
            line.parent = axis;
        });

    return axis;
}