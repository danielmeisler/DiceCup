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
        private sendDice: SendDiceDao[] = [];
        private getDice: SendDiceDao = {value: 0, rotation: new ƒ.Vector3(0,0,0), translation: new ƒ.Vector3(0,0,0)};
        
        private arenaTranslation: ƒ.Vector3 = new ƒ.Vector3((Math.random() * 6) - 3, Math.random() * 5 + 3, (Math.random() * 4) - 1.5);
        private arenaRotation: ƒ.Vector3 = new ƒ.Vector3(Math.random() * 360,(Math.random() * 360),(Math.random() * 360));
        private bigDice: number = 0.3;
        private smallDice: number = 0.265;

        public color: DiceColor;
        public value: number;
    
        constructor(_colorRGBA: RgbaDao, _color: DiceColor, _rollDiceMode?: number, _hostDice?: FudgeNet.Message) {
            this.color = _color;
            this.initDice(_colorRGBA, _rollDiceMode, _hostDice);
        }

        public roll(): number {
            this.value = Math.floor((Math.random() * 6) + 1);
            return this.value;
        }

        private async initDice(_colorRGBA: RgbaDao, _rollDiceMode?: number, _hostDice?: FudgeNet.Message): Promise<void> {
            this.diceGraph = <ƒ.Graph>ƒ.Project.resources["Graph|2023-05-10T12:08:54.682Z|33820"];
            this.diceInst = await ƒ.Project.createGraphInstance(this.diceGraph);
            this.diceMat = this.diceInst.getComponent(ƒ.ComponentMaterial);
            this.diceRig = this.diceInst.getComponent(ƒ.ComponentRigidbody);
            this.dots = this.diceInst.getChildren();
            this.dotsMat = this.dots.map(dot => dot.getComponent(ƒ.ComponentMaterial));

            let corners: ƒ.Node[] = [];
            for (let i = 1, j = 0; i <=4 ; i++, j++) {
                corners[j] = this.diceInst.getChildrenByName("Corner_" + i)[0];
            }
            corners.map(corner => corner.getComponent(ƒ.ComponentRigidbody).addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, this.handleDiceCollision));

            // this.diceRig.addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, this.handleDiceCollision);

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

            this.scaleDices(_colorRGBA);
            this.rollDices(_rollDiceMode);
            this.colorDices(_colorRGBA);

            this.diceNode.addChild(this.diceInst);
        }

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
        
        public async validateDices(): Promise<void> {
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

        public transparentDices(): void {
            let tempDices: ƒ.Node[] = this.diceNode.getChildren();
            let tempMat: ƒ.ComponentMaterial[] = tempDices.map(dice => dice.getComponent(ƒ.ComponentMaterial));
            let tempDots: ƒ.Node[][] = tempDices.map(dice => dice.getChildren());
            let tempDotsMat: ƒ.ComponentMaterial[][] = tempDots.map(dot => dot.map(dot => dot.getComponent(ƒ.ComponentMaterial)));

            tempMat.map(dice => dice.clrPrimary.a = 0.2);
            tempDotsMat.map(dot => dot.map(dot => dot.clrPrimary.a = 0.2));
        }

        private async rollDices(_mode: number): Promise<void> {
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

        private async translateDice(_node: ƒ.Node): Promise<void> {
            let tempVec: ƒ.Vector3 = new ƒ.Vector3((Math.random() * 6) - 3, _node.mtxLocal.scaling.x + 0.01, (Math.random() * 4) - 1.5);
            if (usedTranslations.map(vec => ƒ.Vector3.DIFFERENCE(vec, tempVec).magnitude).some(diff => diff < this.smallDice)) {
                this.translateDice(_node);
            } else {
                usedTranslations.push(tempVec);
                _node.mtxLocal.translation = tempVec;

            }
            this.clearUsedArrays()
        }

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

        private async scaleDices(_colorRGBA: RgbaDao): Promise<void> {
            this.diceMat.clrPrimary = new ƒ.Color(this.convertDiceColor(_colorRGBA.r), this.convertDiceColor(_colorRGBA.g), this.convertDiceColor(_colorRGBA.b), _colorRGBA.a);
            if (_colorRGBA.id == DiceColor.white || _colorRGBA.id == DiceColor.green || _colorRGBA.id == DiceColor.yellow) {
                this.diceInst.mtxLocal.scaling = new ƒ.Vector3(this.smallDice, this.smallDice, this.smallDice);
            } else {
                this.diceInst.mtxLocal.scaling = new ƒ.Vector3(this.bigDice, this.bigDice, this.bigDice);
            }
        }

        private async colorDices(_colorRGBA: RgbaDao): Promise<void> {
            let diceColors: RgbaDao[] = await loadDiceColors();
            
            this.diceMat.clrPrimary = new ƒ.Color(this.convertDiceColor(_colorRGBA.r), this.convertDiceColor(_colorRGBA.g), this.convertDiceColor(_colorRGBA.b), _colorRGBA.a);
            if (_colorRGBA.id == DiceColor.white || _colorRGBA.id == DiceColor.green || _colorRGBA.id == DiceColor.yellow) {
                this.dotsMat.map(dot => { dot.clrPrimary = new ƒ.Color(this.convertDiceColor(diceColors[6].r), this.convertDiceColor(diceColors[6].g), this.convertDiceColor(diceColors[6].b), diceColors[6].a) });
            } else {
                this.dotsMat.map(dot => { dot.clrPrimary = new ƒ.Color(this.convertDiceColor(diceColors[7].r), this.convertDiceColor(diceColors[7].g), this.convertDiceColor(diceColors[7].b), diceColors[7].a) });
            }
        }
        
        private convertDiceColor(_value: number): number {
            let value: number;
            value = (_value / 2.55) / 100;
            return value;
        }

        private handleDiceCollision(_event: ƒ.EventPhysics): void {
            // let collisionNode: ƒ.Node = _event.cmpRigidbody.node;
            let soundArray: string[] = ["Audio|2023-05-15T13:12:43.528Z|46162", "Audio|2023-05-15T14:58:38.658Z|39413", "Audio|2023-05-15T14:58:49.349Z|84065", "Audio|2023-05-15T14:59:11.270Z|83758", "Audio|2023-05-15T14:59:11.270Z|83758"];
            playSFX(soundArray[Math.floor(Math.random() * soundArray.length)]);
        }

        private async clearUsedArrays(): Promise<void> {
            if (usedTranslations.length == dices.length && usedRotations.length == dices.length) {
                await this.sendDiceToServer();
                usedTranslations = [];
                usedRotations = [];
            }
        }
    }

}