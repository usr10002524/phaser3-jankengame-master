import { Consts } from "../consts";
import { Globals } from "../globals";
import { SceneMain } from "../scene/scene-main";
import { Behavior } from "../service/behavior";
import { Log } from "../service/logwithstamp";

/**
 * じゃんけん開始演出
 */
export class JankenStart extends Behavior {

    private scene: SceneMain;
    private timer: Phaser.Time.TimerEvent | null;
    private step: number;
    private demoSuit: number;

    private static Step = {
        INIT: 0,
        INPUT_WAIT: 10,
        DECIDE: 20,
        FINISH: 30,
        FINISH_WAIT: 31,
        END: 100,
    };

    /**
     * コンストラクタ
     * @param scene シーン
     */
    constructor(scene: SceneMain) {
        super('JankenStart');
        this.scene = scene;
        this.timer = null;
        this.step = JankenStart.Step.INIT;
        this.demoSuit = Consts.Janken.Suit.GU;
    }

    //extends Behavior
    /**
     * 初期化処理
     */
    initialize(): void {
        this._updateDemo();
        this.step = JankenStart.Step.INIT;
    }

    /**
     * 更新処理
     */
    update(): void {
        switch (this.step) {
            case JankenStart.Step.INIT: {
                this._stepInit();
                break;
            }
            case JankenStart.Step.INPUT_WAIT: {
                this._stepInputWait();
                break;
            }
            case JankenStart.Step.FINISH: {
                this._stepFinish();
                break;
            }
            case JankenStart.Step.FINISH_WAIT: {
                //tweenの終了トリガーで、JankenStart.Step.ENDに遷移する
                break;
            }
            case JankenStart.Step.END: {
                break;
            }
        }
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
        return (this.step === JankenStart.Step.END)
    }

    // 初期化ステップ
    private _stepInit(): void {
        const panels = this.scene.getPanels();
        if (panels == null) {
            Log.put('panels == null', 'JankenStart._stepInit');
            this.step = JankenStart.Step.END;
            return;
        }

        panels.setStart();
        this.step = JankenStart.Step.INPUT_WAIT;
    }

    // 入力まちステップ
    private _stepInputWait(): void {
        const panels = this.scene.getPanels();
        if (panels == null) {
            Log.put('panels == null', 'JankenStart._stepInputWait');
            this.step = JankenStart.Step.END;
            return;
        }

        //スタートボタンが押されるのを待つ
        const medal = Globals.get().getMedal();
        if (medal > 0) {
            //ここは無限待ち
            if (panels.isTouch(Consts.Panels.Type.START)) {
                //以降のタッチは無効
                panels.disableTouch();
                //メダルを減らす
                Globals.get().addMedal(-1);
                this.step = JankenStart.Step.FINISH;
            }
        }
    }

    // 終了ステップ
    private _stepFinish(): void {
        const panels = this.scene.getPanels();
        if (panels != null) {
            const panel = panels.getImage(Consts.Panels.Type.START);
            if (panel != null) {
                this.scene.tweens.add({
                    targets: panel,
                    duration: 100,
                    props: {
                        alpha: { from: 1, to: 0 },
                    },
                    onComplete: () => {
                        this._onEnd();
                    }
                });
                this.step = JankenStart.Step.FINISH_WAIT;
                return;
            }
        }

        //ここまで来るのはtweenを発動できなかった場合
        //手動でステップを変える。
        this._onEnd();
    }

    // デモ更新
    private _updateDemo(): void {
        const roulette = this.scene.getRoulette();
        if (roulette != null) {
            roulette.lampSet(this.demoSuit, true);
        }

        //次に出す手
        switch (this.demoSuit) {
            case Consts.Janken.Suit.GU: this.demoSuit = Consts.Janken.Suit.CHOKI; break;
            case Consts.Janken.Suit.CHOKI: this.demoSuit = Consts.Janken.Suit.PA; break;
            case Consts.Janken.Suit.PA: this.demoSuit = Consts.Janken.Suit.GU; break;
        }

        //次の呼び出しタイマーを設定
        {
            if (this.timer != null) {
                this.timer.remove();
            }

            this.timer = this.scene.time.addEvent({
                delay: 1000,
                callback: this._updateDemo,
                callbackScope: this,
            });
        }
    }

    // 終了時の処理
    private _onEnd(): void {
        this.step = JankenStart.Step.END;
    }
}