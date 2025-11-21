import { Color3, CreateGreasedLine, GreasedLineBaseMesh, GreasedLineMesh, GreasedLineRibbonMesh, GroundMesh, MeshBuilder, TransformNode, Vector3, type Scene } from "@babylonjs/core";
import { GridMaterial } from "@babylonjs/materials";

export class GridAxisManager {
    private readonly root : TransformNode;
    private readonly ground: GroundMesh;
    private readonly axises: ReadonlyArray<GreasedLineBaseMesh | GreasedLineMesh | GreasedLineRibbonMesh>;
    private isInAxis = false;

    private get axisX() {
        return this.axises[0]!;
    }

    private get axisY() {
        return this.axises[1]!;
    }

    private get axisZ() {
        return this.axises[2]!;
    }

    private get axis0() {
        return this.axises[3]!;
    }

    /**
     *
     */
    constructor(private scene: Scene) {
        this.root = new TransformNode("root-grid-axis", this.scene);
        this.ground = this.initGrid(this.root);
        this.axises = this.initAxis(this.root);
        this.axises[1]!.visibility = 0;
    }

    private initGrid(root?: TransformNode) {
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

    private initAxis(root?: TransformNode) {
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

    setEnable(val: boolean){
        this.root.setEnabled(val);
    }

    freezeInAxis(axis: "X" | "Y" | "Z", _direction: -1 | 1) {
        this.isInAxis = true;

        // 设置ground
        this.ground.rotation =
            axis === 'X' ? new Vector3(0, 0, Math.PI / 2) :
                axis === 'Z' ? new Vector3(Math.PI / 2) :
                    new Vector3(0, 0, 0);


        if (axis === 'X') {
            this.axisY.rotation = new Vector3(0, Math.PI / 2, 0);
            this.axisZ.rotation = new Vector3(0, 0, Math.PI / 2);
            this.axis0.rotation = new Vector3(0, Math.PI / 2, 0);

            this.axisX.visibility = 0;
            this.axisY.visibility = 1;
            this.axisZ.visibility = 1;
        }
        else if (axis === "Y") {
            this.axisX.rotation = new Vector3(Math.PI / 2, 0, 0);
            this.axisZ.rotation = new Vector3(0, 0, 0);
            this.axis0.rotation = new Vector3(Math.PI / 2, 0, 0);

            this.axisX.visibility = 1;
            this.axisY.visibility = 0;
            this.axisZ.visibility = 1;
        } else {
            this.axisX.rotation = new Vector3(0, 0, 0);
            this.axisY.rotation = new Vector3(0, 0, 0);
            this.axis0.rotation = new Vector3(0, 0, 0);

            this.axisX.visibility = 1
            this.axisY.visibility = 1;
            this.axisZ.visibility = 0;
        }
    }

    unfreezeInAxis() {
        if (!this.isInAxis) return;
        this.isInAxis = false;

        // 设置ground
        this.ground.rotation = new Vector3(0, 0, 0);

        // 修改轴向
        this.axisY.visibility = 0;
        this.axisX.rotation = new Vector3(Math.PI / 2, 0, 0);
        this.axisY.rotation = new Vector3(0, Math.PI / 2, 0);
        this.axisZ.rotation = new Vector3(0, 0, 0);
        this.axis0.rotation = new Vector3(Math.PI / 2, 0, 0);

        this.axisX.visibility = 1;
        this.axisY.visibility = 0;
        this.axisZ.visibility = 1;
    }
}