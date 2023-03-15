import { Assets, Consts } from "../../consts";
import { Log } from "../../service/logwithstamp";

export class Moji {

    private scene: Phaser.Scene;
    private call: Phaser.GameObjects.Image;
    private result: Phaser.GameObjects.Image;
    private callTween: Phaser.Tweens.Tween | null;
    private resultTween: Phaser.Tweens.Tween | null;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        //コール用
        this.call = scene.add.image(0, 0, Assets.Graphic.Moji.KEY, Assets.Graphic.Moji.Frames.JAN);
        this.call.setVisible(false);
        this.call.setDepth(Consts.Moji.DEPTH);
        //結果用
        this.result = scene.add.image(0, 0, Assets.Graphic.Moji.KEY, Assets.Graphic.Moji.Frames.JAN);
        this.result.setVisible(false);
        this.result.setDepth(Consts.Moji.DEPTH);
        this.callTween = null;
        this.resultTween = null;
    }

    draw(type: number): void {

        switch (type) {
            case Consts.Moji.Type.JAN:
            case Consts.Moji.Type.AI:
            case Consts.Moji.Type.KEN:
            case Consts.Moji.Type.KODE:
            case Consts.Moji.Type.PON:
            case Consts.Moji.Type.SHO: {
                this._callSetup(type);
                this._setupTweenSuit(type);
                break;
            }

            case Consts.Moji.Type.WIN: {
                this._resultSetup(type);
                this._setupTweenWin();
                break;
            }
            case Consts.Moji.Type.LOSE: {
                this._resultSetup(type);
                this._setupTweenLose();
                break;
            }
            case Consts.Moji.Type.DRAW: {
                this._resultSetup(type);
                this._setupTweenDraw();
                break;
            }
        }

    }


    private _callSetup(type: number): void {
        const frame = this._getFrame(type);
        const position = this._getPosition(type);
        const angle = this._getAngle(type);

        this.call.setFrame(frame);
        this.call.setPosition(position.x, position.y);
        this.call.setRotation(Phaser.Math.DegToRad(angle));
        this.call.setAlpha(1);
        this.call.setScale(1);
        this.call.setVisible(false);
    }

    private _resultSetup(type: number): void {
        const frame = this._getFrame(type);
        const position = this._getPosition(type);
        const angle = this._getAngle(type);

        this.result.setFrame(frame);
        this.result.setPosition(position.x, position.y);
        this.result.setRotation(Phaser.Math.DegToRad(angle));
        this.result.setAlpha(1);
        this.result.setScale(1);
        this.result.setVisible(false);
    }

    private _getFrame(type: number): string {
        switch (type) {
            case Consts.Moji.Type.JAN: return Assets.Graphic.Moji.Frames.JAN;
            case Consts.Moji.Type.AI: return Assets.Graphic.Moji.Frames.AI;
            case Consts.Moji.Type.KEN: return Assets.Graphic.Moji.Frames.KEN;
            case Consts.Moji.Type.KODE: return Assets.Graphic.Moji.Frames.KODE;
            case Consts.Moji.Type.PON: return Assets.Graphic.Moji.Frames.PON;
            case Consts.Moji.Type.SHO: return Assets.Graphic.Moji.Frames.SHO;
            case Consts.Moji.Type.WIN: return Assets.Graphic.Moji.Frames.KATI;
            case Consts.Moji.Type.LOSE: return Assets.Graphic.Moji.Frames.MAKE;
            case Consts.Moji.Type.DRAW: return Assets.Graphic.Moji.Frames.AIKO;
            default: return '';
        }
    }

    private _getPosition(type: number): { x: number, y: number } {
        switch (type) {
            case Consts.Moji.Type.JAN: return { x: 200, y: 125 };
            case Consts.Moji.Type.AI: return { x: 200, y: 125 };
            case Consts.Moji.Type.KEN: return { x: 600, y: 125 };
            case Consts.Moji.Type.KODE: return { x: 600, y: 125 };
            case Consts.Moji.Type.PON: return { x: 400, y: 100 };
            case Consts.Moji.Type.SHO: return { x: 400, y: 100 };
            case Consts.Moji.Type.WIN: return { x: 400, y: 300 };
            case Consts.Moji.Type.LOSE: return { x: 400, y: 300 };
            case Consts.Moji.Type.DRAW: return { x: 400, y: 300 };
            default: return { x: 0, y: 0 };
        }
    }

    private _getAngle(type: number): number {
        switch (type) {
            case Consts.Moji.Type.JAN: return -30;
            case Consts.Moji.Type.AI: return -30;
            case Consts.Moji.Type.KEN: return 30;
            case Consts.Moji.Type.KODE: return 30;
            case Consts.Moji.Type.PON: return 0;
            case Consts.Moji.Type.SHO: return 0;
            case Consts.Moji.Type.WIN: return 0;
            case Consts.Moji.Type.LOSE: return 0;
            case Consts.Moji.Type.DRAW: return 0;
            default: return 0;
        }
    }

    private _setupTweenSuit(type: number): void {
        if (this.callTween != null) {
            this.callTween.remove();
        }
        Log.put(`type:${type}`, 'Moji._setupTweenSuit');

        let start_scale = 0.4;
        let end_scale = 0.8;
        if (type === Consts.Moji.Type.PON || type === Consts.Moji.Type.SHO) {
            end_scale = 0.96;
        }

        this.callTween = this.scene.tweens.add({
            targets: this.call,
            duration: 250,
            props: {
                scale: { from: start_scale, to: end_scale },
            },
            onStart: () => {
                this.call.setVisible(true);
                this.call.setScale(start_scale);
            },
            onComplete: () => {
                this.callTween = this.scene.tweens.add({
                    targets: this.call,
                    duration: 100,
                    props: {
                        alpha: { from: 1, to: 0 },
                    },
                    onComplete: () => {
                        this.call.setVisible(false);
                    }
                });
            },
            completeDelay: 200,
        })
    }

    private _setupTweenWin(): void {
        if (this.resultTween != null) {
            this.resultTween.remove();
        }

        const start_scale = 1.2;
        const end_scale = 1.0;

        this.resultTween = this.scene.tweens.add({
            targets: this.result,
            duration: 500,
            props: {
                scale: { from: start_scale, to: end_scale },
            },
            onStart: () => {
                this.result.setVisible(true);
                this.result.setScale(start_scale);
            },
            onComplete: () => {
                this.resultTween = this.scene.tweens.add({
                    targets: this.result,
                    duration: 500,
                    props: {
                        alpha: { from: 1, to: 0 },
                    },
                    onComplete: () => {
                        this.result.setVisible(false);
                    }
                });
            }
        })
    }

    private _setupTweenLose(): void {
        if (this.resultTween != null) {
            this.resultTween.remove();
        }

        const position = this._getPosition(Consts.Moji.Type.LOSE);
        const start_y = position.y;
        const end_y = position.y + 20;

        this.resultTween = this.scene.tweens.add({
            targets: this.result,
            duration: 500,
            props: {
                alpha: { from: 0.5, to: 1 },
                y: { from: start_y, to: end_y },
            },
            onStart: () => {
                this.result.setVisible(true);
                this.result.setPosition(position.x, position.y);
            },
            onComplete: () => {
                this.resultTween = this.scene.tweens.add({
                    targets: this.result,
                    duration: 500,
                    props: {
                        alpha: { from: 1, to: 0 },
                    },
                    onComplete: () => {
                        this.result.setVisible(false);
                    }
                });
            }
        })
    }

    private _setupTweenDraw(): void {
        if (this.resultTween != null) {
            this.resultTween.remove();
        }

        const position = this._getPosition(Consts.Moji.Type.LOSE);
        const start_y = position.y;
        const end_y = position.y;

        this.resultTween = this.scene.tweens.add({
            targets: this.result,
            duration: 500,
            props: {
                y: { from: start_y, to: end_y },
            },
            onStart: () => {
                this.result.setVisible(true);
                this.result.setPosition(position.x, position.y);
            },
            onComplete: () => {
                this.resultTween = this.scene.tweens.add({
                    targets: this.result,
                    duration: 500,
                    props: {
                        alpha: { from: 1, to: 0 },
                    },
                    onComplete: () => {
                        this.result.setVisible(false);
                    }
                });
            }
        })
    }


}