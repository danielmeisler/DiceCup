namespace DiceCup{
    import ƒ = FudgeCore;
    export class Dice {

        // -- Variable declaration --

        // Color of this dice
        public color: DiceColor;
        // Value of this dice
        public value: number;

        // Nodes, Graphs and Components of the seperate parts of the dice model
        private graph: ƒ.Node = viewport.getBranch();
        private diceNode: ƒ.Node = this.graph.getChildrenByName("Dices")[0];
        private diceGraph: ƒ.Graph;
        private diceInst: ƒ.GraphInstance;
        private diceMat: ƒ.ComponentMaterial;
        private diceRig: ƒ.ComponentRigidbody;
        private dots: ƒ.Node[];
        private dotsMat: ƒ.ComponentMaterial[];

        // Multiplayer: Host sends dice and Guests get dice
        private sendDice: SendDiceDao[] = [];
        private getDice: SendDiceDao = {value: 0, rotation: new ƒ.Vector3(0,0,0), translation: new ƒ.Vector3(0,0,0)};
        
        // Random translation and rotation to throw in the background of the main menu
        private arenaWidth: number = 3;
        private arenaHeigth: number = 2;
        private arenaTranslation: ƒ.Vector3 = new ƒ.Vector3((Math.random() * this.arenaWidth) - this.arenaWidth / 2, Math.random() * 5 + 3, (Math.random() * this.arenaHeigth) - this.arenaHeigth / 2);
        private arenaRotation: ƒ.Vector3 = new ƒ.Vector3(Math.random() * 360,(Math.random() * 360),(Math.random() * 360));

        // Dice sizes
        private bigDice: number = 0.12;
        private smallDice: number = 0.1;

        // Distance between multiple dice so that they can't be inside each other and flicker or glitch
        private diceDistance: number = 0.1;
    
        // Constructor to initialize a new dice
        constructor(_colorRGBA: RgbaDao, _color: DiceColor, _rollDiceMode?: number, _hostDice?: FudgeNet.Message) {
            this.color = _color;
            this.initDice(_colorRGBA, _rollDiceMode, _hostDice);
        }

        // Rolls a random dice number between 1 to 6
        public roll(): number {
            this.value = Math.floor((Math.random() * 6) + 1);
            return this.value;
        }

        // Initialize Dice and its components
        private async initDice(_colorRGBA: RgbaDao, _rollDiceMode?: number, _hostDice?: FudgeNet.Message): Promise<void> {
            this.diceGraph = <ƒ.Graph>ƒ.Project.resources["Graph|2023-05-10T12:08:54.682Z|33820"];
            this.diceInst = await ƒ.Project.createGraphInstance(this.diceGraph);
            this.diceMat = this.diceInst.getComponent(ƒ.ComponentMaterial);
            this.diceRig = this.diceInst.getComponent(ƒ.ComponentRigidbody);
            this.dots = this.diceInst.getChildren();
            this.dotsMat = this.dots.map(dot => dot.getComponent(ƒ.ComponentMaterial));

            // Handles sound collision detection
            this.diceRig.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, this.handleDiceCollision);

            // let corners: ƒ.Node[] = [];
            // for (let i = 1, j = 0; i <=4 ; i++, j++) {
            //     corners[j] = this.diceInst.getChildrenByName("Corner_" + i)[0];
            // }
            // corners.map(corner => corner.getComponent(ƒ.ComponentRigidbody).addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, this.handleDiceCollision));

            // this.diceRig.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, this.handleDiceCollision);

            // Singleplayer: Rolls the dice
            // Multiplayer: Gets the dice translation, rotation and value from the host
            if (_rollDiceMode == 3) {
                this.getDice.translation.x = (<any>(<any>_hostDice).translation).data[0];
                this.getDice.translation.y = (<any>(<any>_hostDice).translation).data[1];
                this.getDice.translation.z = (<any>(<any>_hostDice).translation).data[2];

                this.getDice.rotation.x = (<any>(<any>_hostDice).rotation).data[0];
                this.getDice.rotation.y = (<any>(<any>_hostDice).rotation).data[1];
                this.getDice.rotation.z = (<any>(<any>_hostDice).rotation).data[2];

                this.getDice.value = (<any>_hostDice).value;
                this.value = this.getDice.value;
            } else {
                this.value = this.roll();
            }

            // Scales, rolls and gives the dice the right color
            this.scaleDice(_colorRGBA);
            this.rollDice(_rollDiceMode);
            this.colorDice(_colorRGBA);

            this.diceNode.addChild(this.diceInst);
        }
        
        // Validates the dice in different modes.
        // Mode 0: The dice get a gold color with black dots
        // Mode 1: Nothing changes, the dice keeps its own colors
        public async validateDice(): Promise<void> {
            let validateMode: number = 1;
            switch (validateMode) {
                case 0:
                    let diceColors: RgbaDao[] = await loadDiceColors();
                    this.diceMat.clrPrimary = new ƒ.Color(this.convertDiceColor(diceColors[8].r), this.convertDiceColor(diceColors[8].g), this.convertDiceColor(diceColors[8].b), diceColors[8].a);
                    this.dotsMat.map(dot => { dot.clrPrimary = new ƒ.Color(this.convertDiceColor(diceColors[9].r), this.convertDiceColor(diceColors[9].g), this.convertDiceColor(diceColors[9].b), diceColors[9].a) });
                    break;
                case 1:
                    this.diceMat.clrPrimary.a = 1;
                    this.dotsMat.map(dot => { dot.clrPrimary.a = 1});
                    break;
                default:
                    break;
            }
        }

        // All dice get transparent to not interfere with the visible validation 
        // Because they were not used in the validation they stay transparent and the used ones will get color in validateDice()
        public transparentDice(): void {
            let tempDices: ƒ.Node[] = this.diceNode.getChildren();
            let tempMat: ƒ.ComponentMaterial[] = tempDices.map(dice => dice.getComponent(ƒ.ComponentMaterial));
            let tempDots: ƒ.Node[][] = tempDices.map(dice => dice.getChildren());
            let tempDotsMat: ƒ.ComponentMaterial[][] = tempDots.map(dot => dot.map(dot => dot.getComponent(ƒ.ComponentMaterial)));

            tempMat.map(dice => dice.clrPrimary.a = 0.2);
            tempDotsMat.map(dot => dot.map(dot => dot.clrPrimary.a = 0.2));
        }

        // Rolls the physical 3d model dice
        // Sets the translation and rotation in every used mode
        private async rollDice(_mode: number): Promise<void> {
            this.diceRig.activate(false);
            switch (_mode) {
                case 0:
                    this.diceInst.mtxLocal.translation = this.arenaTranslation;
                    this.diceInst.mtxLocal.rotation = this.arenaRotation;
                    break;
                case 1:
                    await this.rotateDice(this.diceInst);
                    await this.translateDice(this.diceInst);
                    break;
                case 2:
                    this.diceInst.mtxLocal.translation = new ƒ.Vector3((Math.random() * 2) - 1, Math.random() * 3 + 3, (Math.random() * 2) - 1);
                    this.diceInst.mtxLocal.rotation = this.arenaRotation;
                    break;
                case 3:
                    this.diceInst.mtxLocal.rotation = this.getDice.rotation;
                    this.diceInst.mtxLocal.translation = this.getDice.translation;
                    break;
                default:
                    break;
            }
            this.diceRig.activate(true);
        }

        // Places the dice and checks if there is already a dice placed or not
        private async translateDice(_node: ƒ.Node): Promise<void> {
            let tempVec: ƒ.Vector3 = new ƒ.Vector3((Math.random() * this.arenaWidth) - this.arenaWidth / 2, _node.mtxLocal.scaling.x + 0.1, (Math.random() * this.arenaHeigth) - this.arenaHeigth / 2);
            if (usedTranslations.map(vec => ƒ.Vector3.DIFFERENCE(vec, tempVec).magnitude).some(diff => diff < this.bigDice + this.diceDistance)) {
                this.translateDice(_node);
            } else {
                usedTranslations.push(tempVec);
                _node.mtxLocal.translation = tempVec;

            }
            this.clearUsedArrays()
        }

        // Rotates the dice model in 90 degrees in specific axes to get the rolled value visible on the dice model too
        // In order for this to always work, each dice model must look in the same direction with its dice numbers
        // The Y Axis rotates random to get different angles
        private async rotateDice(_node: ƒ.Node): Promise<void> {
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

            usedRotations.push(_node.mtxLocal.rotation);
            this.clearUsedArrays();
        }

        // Scales the dice into small and big dices like in the original game depending which color the dice have
        private async scaleDice(_colorRGBA: RgbaDao): Promise<void> {
            this.diceMat.clrPrimary = new ƒ.Color(this.convertDiceColor(_colorRGBA.r), this.convertDiceColor(_colorRGBA.g), this.convertDiceColor(_colorRGBA.b), _colorRGBA.a);
            if (_colorRGBA.id == DiceColor.white || _colorRGBA.id == DiceColor.green || _colorRGBA.id == DiceColor.yellow) {
                this.diceInst.mtxLocal.scaling = new ƒ.Vector3(this.smallDice, this.smallDice, this.smallDice);
            } else {
                this.diceInst.mtxLocal.scaling = new ƒ.Vector3(this.bigDice, this.bigDice, this.bigDice);
            }
        }

        // Gives the Dice the correct color for its body and dots
        private async colorDice(_colorRGBA: RgbaDao): Promise<void> {
            let diceColors: RgbaDao[] = await loadDiceColors();
            
            this.diceMat.clrPrimary = new ƒ.Color(this.convertDiceColor(_colorRGBA.r), this.convertDiceColor(_colorRGBA.g), this.convertDiceColor(_colorRGBA.b), _colorRGBA.a);
            if (_colorRGBA.id == DiceColor.white || _colorRGBA.id == DiceColor.green || _colorRGBA.id == DiceColor.yellow) {
                this.dotsMat.map(dot => { dot.clrPrimary = new ƒ.Color(this.convertDiceColor(diceColors[6].r), this.convertDiceColor(diceColors[6].g), this.convertDiceColor(diceColors[6].b), diceColors[6].a) });
            } else {
                this.dotsMat.map(dot => { dot.clrPrimary = new ƒ.Color(this.convertDiceColor(diceColors[7].r), this.convertDiceColor(diceColors[7].g), this.convertDiceColor(diceColors[7].b), diceColors[7].a) });
            }
        }
        
        // Converts rgb colors (0-255) into Fudge color format (0-1)
        private convertDiceColor(_value: number): number {
            let value: number;
            value = (_value / 2.55) / 100;
            return value;
        }

        // Host sends the value, translation and rotation of each dice to the server so all players see the same constellation
        private async sendDiceToServer(): Promise<void> {
            if (playerMode == PlayerMode.multiplayer && host == true) {
                for (let index = 0; index < dices.length; index++) {
                    this.sendDice[index] = {value: 0, rotation: new ƒ.Vector3(0,0,0), translation: new ƒ.Vector3(0,0,0)}
                    this.sendDice[index].value = dices[index].value;
                    this.sendDice[index].translation = usedTranslations[index];
                    this.sendDice[index].rotation = usedRotations[index];
                }
                client.dispatch({ command: FudgeNet.COMMAND.SEND_DICE, route: FudgeNet.ROUTE.SERVER, content: { dice: this.sendDice } });
            }
        }

        // Handles the collision sound when a dice hits another object
        private handleDiceCollision(_event: ƒ.EventPhysics): void {
            let soundArray: string[] = ["Audio|2023-05-15T13:12:43.528Z|46162", "Audio|2023-05-15T14:58:38.658Z|39413", "Audio|2023-05-15T14:58:49.349Z|84065", "Audio|2023-05-15T14:59:11.270Z|83758", "Audio|2023-05-15T14:59:11.270Z|83758"];
            playSFX(soundArray[Math.floor(Math.random() * soundArray.length)]);
        }

        // Clears all used Arrays afters every round
        private async clearUsedArrays(): Promise<void> {
            if (usedTranslations.length == dices.length && usedRotations.length == dices.length) {
                await this.sendDiceToServer();
                usedTranslations = [];
                usedRotations = [];
            }
        }
    }

}