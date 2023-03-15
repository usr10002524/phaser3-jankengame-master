import { Assets, Consts } from "../consts";
import { SceneMain } from "../scene/scene-main";
import { Behavior } from "../service/behavior";
import { Log } from "../service/logwithstamp";

export class JankenDraw extends Behavior {

    private scene: SceneMain;
    private timer: Phaser.Time.TimerEvent | null;
    private isEnd: boolean;

    constructor(scene: SceneMain) {
        super('JankenDraw');
        this.scene = scene;
        this.timer = null;
        this.isEnd = false;
    }

    //extends Behavior
    initialize(): void {
        //「まけ」表示
        const moji = this.scene.getMoji();
        if (moji != null) {
            moji.draw(Consts.Moji.Type.DRAW);
        }

        //ちょっと間を開けてから終了
        if (this.timer != null) {
            this.timer.remove();
        }
        this.timer = this.scene.time.addEvent({
            delay: 1000,
            callback: this._onEnd,
            callbackScope: this,
        });
    }

    update(): void {
    }

    finalize(): void {
        if (this.timer != null) {
            this.timer.remove();
        }
    }

    isFinished(): boolean {
        return this.isEnd;
    }


    private _onEnd(): void {
        this.isEnd = true;
    }
}