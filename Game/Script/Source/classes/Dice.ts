namespace DiceCup{
    import ƒ = FudgeCore;
    export class Dice {

        private graph: ƒ.Node = viewport.getBranch();
        private dice: ƒ.Node;
        private sides: ƒ.Node[];
        private dots: ƒ.Node[][];
        private diceMat: ƒ.ComponentMaterial;
        private dotsMat: ƒ.ComponentMaterial[][];

        private nodeId: string;
        public color: DiceColor;
        public value: number;
    
        constructor(_nodeId: string, _colorRGBA: RgbaDao, _color: DiceColor) {
            this.nodeId = _nodeId;
            this.color = _color;
            this.value = this.roll();

            this.dice = this.graph.getChildrenByName(this.nodeId)[0];
            console.log(this.dice);
            this.sides = this.graph.getChildrenByName(this.nodeId)[0].getChildren();
            this.dots = this.sides.map(elem => elem.getChildren());
            this.dotsMat = this.dots.map(elem => elem.map(elem => elem.getComponent(ƒ.ComponentMaterial)));
            this.diceMat = this.dice.getComponent(ƒ.ComponentMaterial);

            // this.dice.mtxLocal.translation = new ƒ.Vector3((Math.random() * 0.2) - 0.1, (Math.random() * 1) + 1, (Math.random() * 0.2) - 0.1);
            // this.dice.mtxLocal.rotation = new ƒ.Vector3(Math.random() * 360,(Math.random() * 360),(Math.random() * 360));
            this.translateDice(this.dice);
            this.rotateDice(this.dice);

            this.diceMat.clrPrimary = new ƒ.Color(this.convertDiceColor(_colorRGBA.r), this.convertDiceColor(_colorRGBA.g), this.convertDiceColor(_colorRGBA.b), _colorRGBA.a);
            if (_nodeId == "Dice_0" || _nodeId == "Dice_1" || _nodeId == "Dice_8" || _nodeId == "Dice_9" || _nodeId == "Dice_10" || _nodeId == "Dice_11") {
                this.dotsMat.map(dots => dots.map(dot => { dot.clrPrimary = new ƒ.Color(0, 0, 0, 1) }));
            } else {
                this.dotsMat.map(dots => dots.map(dot => { dot.clrPrimary = new ƒ.Color(1, 1, 1, 1) }));
            }
        }


        public roll(): number {
            this.value = Math.floor((Math.random() * 6) + 1);
            return this.value;
        }

        private translateDice(_node: ƒ.Node): void {
            _node.mtxLocal.translation = new ƒ.Vector3((Math.random() * 8) - 4, 1, (Math.random() * 8) - 4);
            console.log(_node.mtxLocal.translation.y);
            if (_node.mtxLocal.translation.y > 1) {
                this.translateDice(_node);
            }
        }

        private rotateDice(_node: ƒ.Node): void {
            let randomRotate: number = Math.random() * 360;
            switch (this.value) {
                case 1:
                    _node.mtxLocal.rotation = new ƒ.Vector3(-90,randomRotate,0);
                    break;
                case 2:
                    _node.mtxLocal.rotation = new ƒ.Vector3(0,randomRotate,0);
                    break;
                case 3:
                    _node.mtxLocal.rotation = new ƒ.Vector3(randomRotate,0,-90);
                    break;
                case 4:
                    _node.mtxLocal.rotation = new ƒ.Vector3(randomRotate,0,90);
                    break;
                case 5:
                    _node.mtxLocal.rotation = new ƒ.Vector3(180,randomRotate,0);
                    break;
                case 6:
                    _node.mtxLocal.rotation = new ƒ.Vector3(90,randomRotate,0);
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