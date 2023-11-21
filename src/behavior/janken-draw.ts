import { Assets, Consts } from "../consts";
import { SceneMain } from "../scene/scene-main";
import { Behavior } from "../service/behavior";
import { Log } from "../service/logwithstamp";

/**
 * 引き分け表示
 */
export class JankenDraw extends Behavior {

    private scene: SceneMain;
    private timer: Phaser.Time.TimerEvent | null;
    private isEnd: boolean;

    /**
     * コンストラクタ
     * @param scene シーン
     */
    constructor(scene: SceneMain) {
        super('JankenDraw');
        this.scene = scene;
        this.timer = null;
        this.isEnd = false;
    }

    //extends Behavior
    /**
     * 初期化
     */
    initialize(): void {
        //「あいこ」表示
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

    /**
     * 更新処理
     */
    update(): void {
    }

    /**
     * 終了処理
     */
    finalize(): void {
        if (this.timer != null) {
            this.timer.remove();
        }
    }

    /**
     * 表示が終了したかチェックする
     * @returns 表示が終了した場合は true 、そうでない場合は false を返す。
     */
    isFinished(): boolean {
        return this.isEnd;
    }

    // 終了時の処理
    private _onEnd(): void {
        this.isEnd = true;
    }
}