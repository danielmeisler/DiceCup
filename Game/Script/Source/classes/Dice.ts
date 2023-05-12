namespace DiceCup{
    import ƒ = FudgeCore;
    export class Dice {

        private graph: ƒ.Node = viewport.getBranch();
        private diceNode: ƒ.Node = this.graph.getChildrenByName("Dices")[0];
        private diceGraph: ƒ.Graph;
        private diceInst: ƒ.GraphInstance;
        private diceMat: ƒ.ComponentMaterial;
        private diceRig: ƒ.ComponentRigidbody;
        private dots: ƒ.Node[];
        private dotsMat: ƒ.ComponentMaterial[];
        
        private arenaTranslation: ƒ.Vector3 = new ƒ.Vector3((Math.random() * 6) - 3, Math.random() * 5 + 3, (Math.random() * 4) - 1.5);
        private arenaRotation: ƒ.Vector3 = new ƒ.Vector3(Math.random() * 360,(Math.random() * 360),(Math.random() * 360));
        private arenaScale: ƒ.Vector3 = new ƒ.Vector3(0.3,0.3,0.3);

        public color: DiceColor;
        public value: number;
    
        constructor(_colorRGBA: RgbaDao, _color: DiceColor, _rollDiceMode?: number) {
            this.color = _color;
            this.value = this.roll();
            this.initDice(_colorRGBA, _rollDiceMode);
        }

        public roll(): number {
            this.value = Math.floor((Math.random() * 6) + 1);
            return this.value;
        }

        private async initDice(_colorRGBA: RgbaDao, _rollDiceMode?: number): Promise<void> {
            this.diceGraph = <ƒ.Graph>ƒ.Project.resources["Graph|2023-05-10T12:08:54.682Z|33820"];
            this.diceInst = await ƒ.Project.createGraphInstance(this.diceGraph);
            this.diceMat = this.diceInst.getComponent(ƒ.ComponentMaterial);
            this.diceRig = this.diceInst.getComponent(ƒ.ComponentRigidbody);
            this.dots = this.diceInst.getChildren();
            this.dotsMat = this.dots.map(dot => dot.getComponent(ƒ.ComponentMaterial));

            this.diceInst.mtxLocal.scaling = this.arenaScale;
            this.rollDices(_rollDiceMode);
            this.colorDices(_colorRGBA);

            this.diceNode.addChild(this.diceInst);
        }
        
        public validateDices(): void {
            this.diceMat.clrPrimary = new ƒ.Color(this.convertDiceColor(224), this.convertDiceColor(187), this.convertDiceColor(0), 1);
            this.dotsMat.map(dot => { dot.clrPrimary = new ƒ.Color(0, 0, 0, 1) });
        }

        public transparentDices(): void {
            let tempDices: ƒ.Node[] = this.diceNode.getChildren();
            let tempMat: ƒ.ComponentMaterial[] = tempDices.map(dice => dice.getComponent(ƒ.ComponentMaterial));
            let tempDots: ƒ.Node[][] = tempDices.map(dice => dice.getChildren());
            let tempDotsMat: ƒ.ComponentMaterial[][] = tempDots.map(dot => dot.map(dot => dot.getComponent(ƒ.ComponentMaterial)));

            tempMat.map(dice => dice.clrPrimary.a = 0.2);
            tempDotsMat.map(dot => dot.map(dot => dot.clrPrimary.a = 0.2));
        }

        private rollDices(_mode: number): void {
            this.diceRig.activate(false);
            switch (_mode) {
                case 0:
                    this.diceInst.mtxLocal.translation = this.arenaTranslation;
                    this.diceInst.mtxLocal.rotation = this.arenaRotation;
                    break;
                case 1:
                    this.rotateDice(this.diceInst);
                    this.translateDice(this.diceInst);
                    break;
                case 2:
                    this.diceInst.mtxLocal.translation = new ƒ.Vector3((Math.random() * 2) - 1, Math.random() * 3 + 3, (Math.random() * 2) - 1);
                    this.diceInst.mtxLocal.rotation = this.arenaRotation;
                    break;
                default:
                    break;
            }
            this.diceRig.activate(true);
        }

        private translateDice(_node: ƒ.Node): void {
            _node.mtxLocal.translation = new ƒ.Vector3((Math.random() * 6) - 3, _node.mtxLocal.scaling.x + 0.01, (Math.random() * 4) - 1.5);
        }

        private rotateDice(_node: ƒ.Node): void {
            let randomRotate: number = Math.random() * 360;
            switch (this.value) {
                case 1:
                    _node.mtxLocal.rotateY(randomRotate);
                    break;
                case 2:
                    _node.mtxLocal.rotateY(randomRotate);
                    _node.mtxLocal.rotateX(90);
                    break;
                case 3:
                    _node.mtxLocal.rotateY(randomRotate);
                    _node.mtxLocal.rotateZ(90);
                    break;
                case 4:
                    _node.mtxLocal.rotateY(randomRotate);
                    _node.mtxLocal.rotateZ(-90);
                    break;
                case 5:
                    _node.mtxLocal.rotateY(randomRotate);
                    _node.mtxLocal.rotateX(-90);
                    break;
                case 6:
                    _node.mtxLocal.rotateY(randomRotate);
                    _node.mtxLocal.rotateX(180);
                    break;
                default:
                    break;
            }
        }

        private async colorDices(_colorRGBA: RgbaDao): Promise<void> {
            let diceColors: RgbaDao[] = await loadDiceColors();
            
            this.diceMat.clrPrimary = new ƒ.Color(this.convertDiceColor(_colorRGBA.r), this.convertDiceColor(_colorRGBA.g), this.convertDiceColor(_colorRGBA.b), _colorRGBA.a);
            if (_colorRGBA.name == DiceColor.white || _colorRGBA.name == DiceColor.green || _colorRGBA.name == DiceColor.yellow) {
                this.dotsMat.map(dot => { dot.clrPrimary = new ƒ.Color(this.convertDiceColor(diceColors[diceColors.length - 2].r), this.convertDiceColor(diceColors[diceColors.length - 2].g), diceColors[diceColors.length - 2].b, diceColors[diceColors.length - 2].a) });
            } else {
                this.dotsMat.map(dot => { dot.clrPrimary = new ƒ.Color(this.convertDiceColor(diceColors[diceColors.length - 1].r), this.convertDiceColor(diceColors[diceColors.length - 1].g), diceColors[diceColors.length - 1].b, diceColors[diceColors.length - 1].a) });
            }
        }
        
        private convertDiceColor(_value: number): number {
            let value: number;
            value = (_value / 2.55) / 100;
            return value;
        }
    }

}