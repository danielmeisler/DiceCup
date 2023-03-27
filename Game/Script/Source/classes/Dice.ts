namespace DiceCup{
    export class Dice {

        public color: DiceColor;
        public value: number;
    
        constructor(_color: DiceColor) {
          this.color = _color;
          this.value = this.roll();
        }

        public roll(): number {
            return Math.floor((Math.random() * 6) + 1);
        }
    }

}