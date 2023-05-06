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
        private color: RgbaDao;
        private value: number;
    
        constructor(_nodeId: string, _color: RgbaDao) {
            this.nodeId = _nodeId;
            this.color = _color;
            this.value = this.roll();
            this.dice = this.graph.getChildrenByName(this.nodeId)[0];
            this.sides = this.graph.getChildrenByName(this.nodeId)[0].getChildren();
            this.dots = this.sides.map(elem => elem.getChildren());
            this.dotsMat = this.dots.map(elem => elem.map(elem => elem.getComponent(ƒ.ComponentMaterial)));
            this.diceMat = this.dice.getComponent(ƒ.ComponentMaterial);
            this.dice.mtxLocal.translation = new ƒ.Vector3((Math.random() * 8) - 4, (Math.random() * 5) + 3, (Math.random() * 8) - 4);
            this.dice.mtxLocal.rotation = new ƒ.Vector3(Math.random() * 360,(Math.random() * 360),(Math.random() * 360));
            this.diceMat.clrPrimary = new ƒ.Color(this.convertDiceColor(this.color.r), this.convertDiceColor(this.color.g), this.convertDiceColor(this.color.b), this.color.a);
            if (_nodeId == "Dice_0" || _nodeId == "Dice_1" || _nodeId == "Dice_8" || _nodeId == "Dice_9" || _nodeId == "Dice_10" || _nodeId == "Dice_11") {
                this.dotsMat.map(dots => dots.map(dot => { console.log(dot), dot.clrPrimary = new ƒ.Color(0, 0, 0, 1) }));
            } else {
                this.dotsMat.map(dots => dots.map(dot => { console.log(dot), dot.clrPrimary = new ƒ.Color(1, 1, 1, 1) }));
            }
        }


        public roll(): number {
            this.value = Math.floor((Math.random() * 6) + 1);
            return this.value;
        }
        
        private convertDiceColor(_value: number): number {
            let value: number;
            value = (_value / 2.55) / 100;
            return value;
        }
    }

}