namespace DiceCup{
    import ƒ = FudgeCore;

    export class TimerBar {

        private time: number;
        private percentage: number;
        private id: string;
        private timerID: number;

        constructor(_id: string, _time: number) {
            this.id = _id;
            this.time = _time;
            this.timerID = ƒ.Time.game.setTimer(1000, this.time, (_event: ƒ.EventTimer) => {this.getTimerPercentage(_event.count - 1)});
        }

        public resetTimer(): void {
            ƒ.Time.game.deleteTimer(this.timerID);
            document.getElementById(this.id).style.width = "100%";
        }

        private getTimerPercentage(_count: number): void {
            document.getElementById(this.id).style.transition = "width 1s linear";
            this.percentage = (_count * 100) / this.time;
            document.getElementById(this.id).style.width = this.percentage + "%";
            if (document.getElementById(this.id).style.width == "0%") {
                ƒ.Time.game.setTimer(1000, 1, () => document.getElementById(this.id).style.width = "100%");
            }
        }
        
    }
}