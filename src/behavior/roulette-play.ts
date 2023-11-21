import { Assets, Consts } from "../consts";
import { Globals } from "../globals";
import { Roulette } from "../objects/roulette/roulette";
import { SceneMain } from "../scene/scene-main";
import { Behavior } from "../service/behavior";
import { Log } from "../service/logwithstamp";
import { Lottery } from "../service/lottery";

/**
 * ルーレットプレー中処理
 */
export class RoulettePlay extends Behavior {

    private scene: SceneMain;
    private stopIndex: number;
    private playerSuit: number;
    private roulette: Roulette | null;
    private timer: Phaser.Time.TimerEvent | null;

    private stepCount: number;
    private stepToMiddle: number;
    private stepToLow: number;
    private currentStep: number;

    private lampStat: boolean;
    private isEnd: boolean;

    private static DURATION_HIGH = 125;
    private static DURATION_MIDDLE = 250;
    private static DURATION_LOW = 500;

    /**
     * コンストラクタ
     * @param scene シーン
     * @param stopIndex 停止位置
     * @param playerSuit プレーヤーの手
     */
    constructor(scene: SceneMain, stopIndex: number, playerSuit: number) {
        super('RoulettePlay');

        this.scene = scene;
        this.stopIndex = stopIndex;
        this.playerSuit = playerSuit;
        this.roulette = this.scene.getRoulette();
        this.timer = null;

        this.stepCount = this.stopIndex;
        this.stepToMiddle = this.stepCount;
        this.stepToLow = this.stepCount;
        this.currentStep = 0;

        this.lampStat = false;

        this.isEnd = false;
    }

    /**
     * 初期化処理
     */
    initialize(): void {
        this._setupDirection();
        this._updateRoulette();
        this._panelErase();
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

    /**
     * ルーレット更新処理
     */
    private _updateRoulette(): void {
        const position = this.currentStep % Consts.Cells.Position.POS_MAX;
        if (this.roulette != null) {
            this.roulette.cellAllOff();
            this.roulette.cellOn(position);
        }

        if (this.currentStep === this.stepCount) {
            //点滅させる
            this.scene.tweens.addCounter({
                duration: 100,
                repeat: 4,
                yoyo: true,
                onStart: () => {
                    this.scene.sound.play(Assets.Audio.SE.YAPPY);
                    this.roulette?.cellOff(this.stopIndex);
                },
                onRepeat: () => {
                    this.roulette?.cellOff(this.stopIndex);
                },
                onYoyo: () => {
                    this.roulette?.cellOn(this.stopIndex);
                },
                onComplete: () => {
                    this._onEnd();
                },
                completeDelay: 500,
            })

            return;
        }
        else {
            this.scene.sound.play(Assets.Audio.SE.RSTEP);
        }

        //次の呼び出しタイマーを設定。
        {
            if (this.timer != null) {
                this.timer.remove();
            }

            const duration = this._getDuretion();
            this.timer = this.scene.time.addEvent({
                delay: duration,
                callback: this._updateRoulette,
                callbackScope: this,
            });
        }

        this.currentStep++;
    }

    // 再生速度を取得
    private _getDuretion(): number {
        if (this.currentStep >= this.stepToLow) {
            return RoulettePlay.DURATION_LOW;
        }
        else if (this.currentStep >= this.stepToMiddle) {
            return RoulettePlay.DURATION_MIDDLE;
        }
        else {
            return RoulettePlay.DURATION_HIGH;
        }
    }

    /**
     * 演出のセットアップ
     */
    private _setupDirection(): void {
        //どういう過程で停止位置に止まるかを決める

        const random = Globals.get().getRandom();
        const lottery = new Lottery(random);

        //止まるまでのステップ数
        {
            const weit = [0, 80, 20];   //0周,1周,2周
            const index = lottery.lotteryWeight(weit);

            this.stepCount = this.stopIndex + Consts.Cells.Position.POS_MAX * index;
            Log.put(`[stepCount] step:${this.stepCount}`, 'RoulettePlay._setupDirection');
        }

        //中速に切り替わるステップ
        {
            const max = this._highStepCountMax(this.stepCount);
            const min = this._highStepCountMin(this.stepCount);
            const step = lottery.lottery(max - min + 1) + min;
            this.stepToMiddle = step;
            Log.put(`[toMiddle] step:${step} min:${min} max:${max}`, 'RoulettePlay._setupDirection');
        }

        //低速に切り替わるステップ
        {
            const max = this._lowStepCountMax(this.stepCount);
            const min = this._lowStepCountMin(this.stepCount);
            let step = lottery.lottery(max - min + 1) + min;

            //高速＋低速が予定ステップを超える場合は調整する
            if ((this.stepToMiddle + step) > this.stepCount) {
                step = this.stepCount - this.stepToMiddle;
            }
            this.stepToLow = this.stepCount - step;

            Log.put(`[toLow] step:${step} min:${min} max:${max}`, 'RoulettePlay._setupDirection');
        }
    }

    /**
     * 中速に切り替わる最小ステップ数を取得する
     * @param stepCount 止まるまでのステップ数
     * @returns 中速に切り替わる最小ステップ数
     */
    private _highStepCountMin(stepCount: number): number {
        let rate = 0.75;

        if (stepCount <= 18) { rate = 0.75; }
        else if (stepCount <= 24) { rate = 0.70; }
        else if (stepCount <= 30) { rate = 0.60; }
        else { rate = 0.50; }

        const step = Math.floor(stepCount * rate);
        return step;
    }

    /**
     * 中速に切り替わる最大ステップ数を取得する
     * @param stepCount 止まるまでのステップ数
     * @returns 中速に切り替わる最大ステップ数
     */
    private _highStepCountMax(stepCount: number): number {
        const rate = 0.9;
        const step = Math.floor(stepCount * rate);
        return step;
    }

    /**
     * 低速に切り替わる最小ステップ数を取得する
     * @param stepCount 止まるまでのステップ数
     * @returns 低速に切り替わる最小ステップ数
     */
    private _lowStepCountMin(stepCount: number): number {
        return 0;
    }

    /**
     * 低速に切り替わる最大ステップ数を取得する
     * @param stepCount 止まるまでのステップ数
     * @returns 低速に切り替わる最大ステップ数
     */
    private _lowStepCountMax(stepCount: number): number {
        let rate = 0.1;

        if (stepCount <= 18) { rate = 0.10; }
        else if (stepCount <= 24) { rate = 0.10; }
        else if (stepCount <= 30) { rate = 0.15; }
        else { rate = 0.20; }

        const step = Math.floor(stepCount * rate);
        return step;
    }

    /**
     * パネルを消去する
     */
    private _panelErase(): void {
        const panels = this.scene.getPanels();
        if (panels != null) {
            const panel = panels.getImageBySuit(this.playerSuit);
            if (panel != null) {
                this.scene.tweens.add({
                    targets: panel,
                    duration: 100,
                    props: {
                        alpha: { from: 1, to: 0 },
                    },
                });
            }
        }
    }

    // 終了時の処理
    private _onEnd(): void {
        if (this.roulette != null) {
            this.roulette.cellAllOff();
        }
        this.isEnd = true;
    }
}