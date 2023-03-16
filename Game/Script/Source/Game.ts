namespace DiceCup {
    import ƒ = FudgeCore;

    export async function init() {
        await ƒ.Project.loadResourcesFromHTML();
        let graphId/* : string */ = document.head.querySelector("meta[autoView]").getAttribute("autoView")
        //let graph/* : ƒ.Graph */ = ƒ.Project.resources[graphId];
        let cmpCamera/* : ƒ.ComponentCamera */ = new ƒ.ComponentCamera();
        let canvas/* : HTMLCanvasElement */ = document.querySelector("canvas");
        let viewport/* : ƒ.Viewport */ = new ƒ.Viewport();
        let resource: ƒ.SerializableResource = ƒ.Project.resources[graphId];
        this.root = <ƒ.Graph>resource;
        viewport.initialize("Viewport", this.root, cmpCamera, canvas);

    }

    export function initGame(): void {
        dices = [];

        let gameDiv: HTMLDivElement = document.createElement("div");
        gameDiv.id = "rollingDiv";
        document.getElementById("game").appendChild(gameDiv);
    
        for (let i: number = 0; i < 6; i++) {
            dices.push(new Dice(i));
            dices.push(new Dice(i));
        }
    
        for (let i: number = 0; i < 12; i++) {
            let diceDiv: HTMLDivElement = document.createElement("div");
            diceDiv.classList.add("diceDiv");
            diceDiv.id = "diceContainer" + i;
            diceDiv.innerHTML = dices[i].value.toString();
            diceDiv.style.background = DiceColor[dices[i].color].toString();
            document.getElementById("rollingDiv").appendChild(diceDiv);
        }
    
        console.log("Augen auf ...");
        ƒ.Time.game.setTimer(3000, 1, () => { gameValidate()  });

    }

    function rollDices(): void {
        dices = [];
        for (let i: number = 0; i < 6; i++) {
        dices.push(new Dice(i));
        dices.push(new Dice(i));
        }
        for (let i: number = 0; i < 12; i++) {
        let diceDiv: HTMLDivElement = document.createElement("div");
        diceDiv.classList.add("diceDiv");
        diceDiv.id = "diceContainer" + i;
        diceDiv.innerHTML = dices[i].value.toString();
        diceDiv.style.background = DiceColor[dices[i].color].toString();
        document.getElementById("rollingDiv").appendChild(diceDiv);
        }
        console.log("Augen auf ...");
        ƒ.Time.game.setTimer(3000, 1, gameValidate);
    }

    function gameValidate(): void {
        for (let i: number = 0; i < 12; i++) 
            document.getElementById("diceContainer" + i).remove();
            document.getElementById("valuation0").classList.add("valuationShow");
            document.getElementById("valuation0").addEventListener("click", handleValidate);
        console.log("Becher drauf!");
        for (let i: number = 0; i < 12; i++) {
            let valuationDiv: HTMLButtonElement = <HTMLButtonElement>document.getElementById("valuation" + i);
            valuationDiv.setAttribute("index", i.toString());
            valuationDiv.classList.add("valuationShow");
            valuationDiv.addEventListener("click", handleValidate);
        }

    }

    function handleValidate(_event: Event): void {
        new Valuation(parseInt((<HTMLDivElement>_event.currentTarget).getAttribute("index")), dices);
        new Bot(BotDifficulty.easy, dices);
        this.disabled = true;
        this.style.backgroundColor = "black";
        this.style.color = "gray";
        this.classList.remove("valuationShow");
        this.classList.add("valuationHidden");
        console.log("Total: " + highscore);
        rollDices();
    }
}