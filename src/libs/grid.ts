import { Color3, CreateGreasedLine, GreasedLineBaseMesh, GreasedLineMesh, GreasedLineRibbonMesh, GroundMesh, MeshBuilder, TransformNode, Vector3, type Scene } from "@babylonjs/core";
import { GridMaterial } from "@babylonjs/materials";

export class GridAxisManager {
    private readonly ground: GroundMesh;
    private readonly axises: ReadonlyArray<GreasedLineBaseMesh | GreasedLineMesh | GreasedLineRibbonMesh>;

    /**
     *
     */
    constructor(private scene: Scene, root?: TransformNode) {
        this.ground = this.initGrid(root);
        this.axises = this.initAxis(root);
        this.axises[1]!.visibility = 0;
    }

    initGrid(root?: TransformNode) {
        const grid = new GridMaterial("grid", this.scene);
        grid.mainColor = new Color3(0.59, 0.59, 0.59);
        grid.lineColor = Color3.White();
        grid.opacity = 0.98;
        grid.majorUnitFrequency = 10;
        grid.minorUnitVisibility = 0.4;
        grid.backFaceCulling = false;

        const ground = MeshBuilder.CreateGround("ground", { width: 10000, height: 10000, subdivisions: 1 }, this.scene);
        ground.material = grid;
        ground.renderingGroupId = 0;
        if (root) ground.parent = root;

        return ground;
    }

    initAxis(root?: TransformNode) {
        const width = 0.1;
        const extra = width / 2;
        const axis = new TransformNode("axis", this.scene);
        if (root)
            axis.parent = root;

        return [
            { name: "axis-x", color: Color3.FromHexString("#ff3333"), rotation: new Vector3(Math.PI / 2, 0, 0), points: [[5000, 0, 0, extra, 0, 0], [-extra, 0, 0, - 5000, 0, 0]] },
            { name: "axis-y", color: Color3.FromHexString("#44ff44"), rotation: new Vector3(0, Math.PI / 2, 0), points: [[0, 5000, 0, 0, extra, 0], [0, -extra, 0, 0, -5000, 0]], },
            { name: "axis-z", color: Color3.FromHexString("#3333ff"), rotation: new Vector3(0, 0, 0), points: [[0, 0, 5000, 0, 0, extra], [0, 0, -extra, 0, 0, -5000]], },
            { name: "axis-0", color: Color3.FromHexString("#ffffff"), rotation: new Vector3(Math.PI / 2, 0, 0), points: [[extra, 0, 0, -extra, 0, 0]], }
        ]
            .map(x => {
                const line = CreateGreasedLine(x.name, {
                    points: x.points,
                    ribbonOptions: {},
                }, {
                    color: x.color,
                    width: width,
                }, this.scene)
                line.rotation = x.rotation;
                line.renderingGroupId = 1;
                line.parent = axis;

                return line;
            });
    }
}