namespace DiceCup{
    import ƒ = FudgeCore;
    export class Dice {

        private graph: ƒ.Node = viewport.getBranch();
        private dice: ƒ.Node;
        private diceMat: ƒ.ComponentMaterial;
        private diceRigid: ƒ.ComponentRigidbody;

        private nodeId: string;
        private color: RgbaDao;
        private value: number;
        private timeStamp: number = 0;
    
        constructor(_nodeId: string, _color: RgbaDao) {
            this.nodeId = _nodeId;
            this.color = _color;
            this.value = this.roll();
            this.dice = this.graph.getChildrenByName(this.nodeId)[0];
            this.diceRigid = this.dice.getComponent(ƒ.ComponentRigidbody);
            this.diceMat = this.dice.getComponent(ƒ.ComponentMaterial);
            this.dice.mtxLocal.translation = new ƒ.Vector3((Math.random() * 5) - 2.5, Math.random() * 5, (Math.random() * 5) - 2.5);
            this.dice.mtxLocal.rotation = new ƒ.Vector3(Math.random() * 360,(Math.random() * 360),(Math.random() * 360));
            console.log(this.dice.mtxLocal.translation);
            this.diceMat.clrPrimary = new ƒ.Color(this.convertDiceColor(this.color.r), this.convertDiceColor(this.color.g), this.convertDiceColor(this.color.b), this.color.a);
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.randomDiceThrow);
            ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 240);
        }

        public roll(): number {
            // this.randomDiceThrow();
            this.value = Math.floor((Math.random() * 6) + 1);
            return this.value;
        }

        private randomDiceThrow = (_event: Event): void => {

            let deltaTime: number = ƒ.Loop.timeFrameReal;
            this.timeStamp += 1000000 * deltaTime;
            
            // this.dice.mtxLocal.rotation = new ƒ.Vector3(((this.timeStamp * Math.random() * 90 - 45) * Math.PI) / 180, 0, ((this.timeStamp * Math.random() * 90 - 45) * Math.PI) / 180); 
            // this.cmp.mtxPivot.translation =  new ƒ.Vector3(0 ,0 , 0);
            // this.dice.mtxLocal.rotation = new ƒ.Vector3(this.timeStamp, this.timeStamp, 0);
            // // this.cmp.mtxPivot.rotation = new ƒ.Vector3(this.timeStamp, this.timeStamp, 0);
            // console.log(this.timeStamp);
            // this.dice.mtxLocal.rotateY(180 * deltaTime);
            // this.timeStamp += 1 * deltaTime;
            // let currPos: ƒ.Vector3 = this.dice.mtxLocal.rotation;
            // this.dice.mtxLocal.rotation = new ƒ.Vector3(currPos.x,this.sin(this.timeStamp)+0.5,currPos.z);
            // console.log("sin", this.sin(this.timeStamp));
          };
        
        private convertDiceColor(_value: number): number {
            let value: number;
            value = (_value / 2.55) / 100;
            return value;
        }
    }

}