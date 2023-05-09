namespace DiceCup{
    import ƒ = FudgeCore;
    export class Dice {

        private graph: ƒ.Node = viewport.getBranch();
        private dice: ƒ.Node;
        private diceMat: ƒ.ComponentMaterial;
        private diceRig: ƒ.ComponentRigidbody;
        private dots: ƒ.Node[];
        private dotsMat: ƒ.ComponentMaterial[];
        private arenaTranslation: ƒ.Vector3 = new ƒ.Vector3((Math.random() * 6) - 3, Math.random() * 5 + 3, (Math.random() * 4) - 1.5);
        private arenaRotation: ƒ.Vector3 = new ƒ.Vector3(Math.random() * 360,(Math.random() * 360),(Math.random() * 360));
        private arenaScale: ƒ.Vector3 = new ƒ.Vector3(0.3,0.3,0.3);

        private nodeId: string;
        public color: DiceColor;
        public value: number;
    
        constructor(_nodeId: string, _colorRGBA: RgbaDao, _color: DiceColor, _rollDiceMode?: number) {
            this.nodeId = _nodeId;
            this.color = _color;
            this.value = this.roll();
            this.dice = this.graph.getChildrenByName(this.nodeId)[0];
            this.diceMat = this.dice.getComponent(ƒ.ComponentMaterial);
            this.diceRig = this.dice.getComponent(ƒ.ComponentRigidbody);
            this.dots = this.graph.getChildrenByName(this.nodeId)[0].getChildren();
            this.dotsMat = this.dots.map(dot => dot.getComponent(ƒ.ComponentMaterial));
            console.log(this.arenaScale)
            this.dice.mtxLocal.scaling = this.arenaScale;
            this.rollDices(_rollDiceMode);
            this.diceMat.clrPrimary = new ƒ.Color(this.convertDiceColor(_colorRGBA.r), this.convertDiceColor(_colorRGBA.g), this.convertDiceColor(_colorRGBA.b), _colorRGBA.a);
            if (_nodeId == "Dice_0" || _nodeId == "Dice_1" || _nodeId == "Dice_8" || _nodeId == "Dice_9" || _nodeId == "Dice_10" || _nodeId == "Dice_11") {
                this.dotsMat.map(dot => { dot.clrPrimary = new ƒ.Color(0.1, 0.1, 0.1, 1) });
            } else {
                this.dotsMat.map(dot => { dot.clrPrimary = new ƒ.Color(0.9, 0.9, 0.9, 1) });
            }
        }

        public roll(): number {
            this.value = Math.floor((Math.random() * 6) + 1);
            return this.value;
        }
        
        public validateDices(): void {
            this.diceMat.clrPrimary = new ƒ.Color(this.convertDiceColor(224), this.convertDiceColor(187), this.convertDiceColor(0), 1);
            this.dotsMat.map(dot => { dot.clrPrimary = new ƒ.Color(0, 0, 0, 1) });
        }

        public transparentDices(): void {
            for (let i = 0; i < 12; i++) {
                let tempDice: ƒ.Node = this.graph.getChildrenByName("Dice_" + i)[0];
                let tempMat: ƒ.ComponentMaterial = tempDice.getComponent(ƒ.ComponentMaterial);
                let tempDots: ƒ.Node[] = this.graph.getChildrenByName("Dice_" + i)[0].getChildren();
                let tempDotsMat = tempDots.map(elem => elem.getComponent(ƒ.ComponentMaterial));

                tempMat.clrPrimary.a = 0.2;
                tempDotsMat.map(dot => { dot.clrPrimary.a = 0.2 });
            }
        }

        private rollDices(_mode: number): void {
            this.diceRig.activate(false);
            switch (_mode) {
                case 0:
                    this.dice.mtxLocal.translation = this.arenaTranslation;
                    this.dice.mtxLocal.rotation = this.arenaRotation;
                    break;
                case 1:
                    this.rotateDice(this.dice);
                    this.translateDice(this.dice);
                    break;
                case 2:
                    this.dice.mtxLocal.translation = new ƒ.Vector3((Math.random() * 2) - 1, Math.random() * 3 + 3, (Math.random() * 2) - 1);
                    this.dice.mtxLocal.rotation = this.arenaRotation;
                    break;
                default:
                    break;
            }
            this.diceRig.activate(true);
        }

        private translateDice(_node: ƒ.Node): void {
            console.log(_node.mtxLocal.scaling.x);
            _node.mtxLocal.translation = new ƒ.Vector3((Math.random() * 6) - 3, 0.35, (Math.random() * 4) - 1.5);
            // console.log(_node.mtxLocal.translation.y);
        }

        private rotateDice(_node: ƒ.Node): void {
            let randomRotate: number = Math.random() * 360;
            switch (this.value) {
                case 1:
                    _node.mtxLocal.rotation = new ƒ.Vector3(0,randomRotate,0);
                    break;
                case 2:
                    _node.mtxLocal.rotation = new ƒ.Vector3(90,randomRotate,0);
                    break;
                case 3:
                    _node.mtxLocal.rotation = new ƒ.Vector3(0,randomRotate,90);
                    break;
                case 4:
                    _node.mtxLocal.rotation = new ƒ.Vector3(randomRotate,0,-90);
                    break;
                case 5:
                    _node.mtxLocal.rotation = new ƒ.Vector3(-90,randomRotate,0);
                    break;
                case 6:
                    _node.mtxLocal.rotation = new ƒ.Vector3(180,randomRotate,0);
                    break;
                default:
                    break;
            }
        }
        
        private convertDiceColor(_value: number): number {
            let value: number;
            value = (_value / 2.55) / 100;
            return value;
        }
    }

}