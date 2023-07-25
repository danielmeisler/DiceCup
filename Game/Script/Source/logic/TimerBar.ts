namespace DiceCup{
    import ƒ = FudgeCore;

    export class TimerBar {

        // -- Variable declaration --

        // The given time the timer is starting
        private time: number;
        // To shrink the given div percentual
        private percentage: number;
        // The div id which is used as a visible timer
        private elementID: string;
        // The timer id to start and reset the timer
        private timerID: number;

        // Constructor to create a simple visual timer bar
        constructor(_id: string, _time: number) {
            this.elementID = _id;
            this.time = _time;
            this.timerID = ƒ.Time.game.setTimer(1000, this.time, (_event: ƒ.EventTimer) => {this.getTimerPercentage(_event.count - 1)});
        }

        // Resets the timer if wanted before the timer is ending by himself
        public resetTimer(): void {
            ƒ.Time.game.deleteTimer(this.timerID);
            document.getElementById(this.elementID).style.width = "100%";
        }

        // Shrinks the visual timer bar (html element)
        private getTimerPercentage(_count: number): void {
            document.getElementById(this.elementID).style.transition = "width 1s linear";
            this.percentage = (_count * 100) / this.time;
            document.getElementById(this.elementID).style.width = this.percentage + "%";
            if (document.getElementById(this.elementID).style.width == "0%") {
                ƒ.Time.game.setTimer(1000, 1, () => document.getElementById(this.elementID).style.width = "100%");
            }
        }
        
    }
}