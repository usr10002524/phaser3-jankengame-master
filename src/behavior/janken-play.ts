import { Assets, Consts } from "../consts";
import { Globals } from "../globals";
import { PanelImage } from "../objects/panels/panelImage";
import { SceneMain } from "../scene/scene-main";
import { Behavior } from "../service/behavior";
import { Log } from "../service/logwithstamp";

/**
 * じゃんけんプレー中処理
 */
export class JankenPlay extends Behavior {

    private scene: SceneMain;
    private randomSelectTimer: Phaser.Time.TimerEvent | null;
    private seTimer: Phaser.Time.TimerEvent | null;
    private shuffleTimer: Phaser.Time.TimerEvent | null;
    private step: number;
    private select: number;
    private shuffleSuit: number;

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
        super('JankenPlay');
        this.scene = scene;
        this.randomSelectTimer = null;
        this.seTimer = null;
        this.shuffleTimer = null;
        this.step = JankenPlay.Step.INIT;
        this.select = Consts.Janken.Suit.NONE;
        this.shuffleSuit = Consts.Janken.Suit.GU;
    }

    //extends Behavior
    /**
     * 初期化
     */
    initialize(): void {
        this._updateShuffle();
        this.step = JankenPlay.Step.INIT;
    }

    /**
     * 更新処理
     */
    update(): void {
        switch (this.step) {
            case JankenPlay.Step.INIT: {
                this._stepInit();
                break;
            }
            case JankenPlay.Step.INPUT_WAIT: {
                this._stepInputWait();
                break;
            }
            case JankenPlay.Step.FINISH: {
                this._stepFinish();
                break;
            }
            case JankenPlay.Step.FINISH_WAIT: {
                this._stepFinishWait();
                break;
            }
            case JankenPlay.Step.END: {
                break;
            }
        }
    }

    /**
     * 終了処理
     */
    finalize(): void {
        this._deleteRandomSelectTimer();
        this._deleteSeTimer();
        this._deleteShuffleTimer();
    }

    /**
     * 表示が終了したかチェックする
     * @returns 表示が終了した場合は true 、そうでない場合は false を返す。
     */
    isFinished(): boolean {
        return (this.step === JankenPlay.Step.END)
    }

    //各ステップ処理
    private _stepInit(): void {
        const panels = this.scene.getPanels();
        if (panels == null) {
            Log.put('panels == null', 'JankenPlay._stepInit');
            this.step = JankenPlay.Step.END;
            return;
        }

        panels.setSelectSuit();
        //選択タイムアウトタイマー開始
        this._startRandomSelectTimer();

        //SE鳴らす&SEタイマー開始
        this._playFirst();
        this._startSeTimer();

        this.step = JankenPlay.Step.INPUT_WAIT;
    }

    // プレーヤー入力まち
    private _stepInputWait(): void {
        const panels = this.scene.getPanels();
        if (panels == null) {
            Log.put('panels == null', 'JankenPlay._stepInputWait');
            this.step = JankenPlay.Step.END;
            return;
        }

        //選択待ち
        if (panels.isTouch(Consts.Panels.Type.GU)) {
            this.select = Consts.Janken.Suit.GU;
        }
        else if (panels.isTouch(Consts.Panels.Type.CHOKI)) {
            this.select = Consts.Janken.Suit.CHOKI;
        }
        else if (panels.isTouch(Consts.Panels.Type.PA)) {
            this.select = Consts.Janken.Suit.PA;
        }

        if (this.select !== Consts.Janken.Suit.NONE) {
            //タイマーが動いていれば止める
            this._deleteRandomSelectTimer();
            this._deleteSeTimer();
            this._deleteShuffleTimer();

            //SE鳴らす
            this._playThird();

            //以降のタッチは無効
            panels.disableTouch();

            //シーンにプレーヤー選択を通知
            this.scene.onSelectSuit(this.select);
            this.step = JankenPlay.Step.FINISH;
        }
    }

    // 終了ステップ
    private _stepFinish(): void {

        const suits = [Consts.Janken.Suit.GU, Consts.Janken.Suit.CHOKI, Consts.Janken.Suit.PA];

        const panels = this.scene.getPanels();
        if (panels != null) {

            //tweenの対象を抽出
            const targets: PanelImage[] = [];
            for (let i = 0; i < suits.length; i++) {
                if (suits[i] === this.select) {
                    continue;
                }
                const panel = panels.getImageBySuit(suits[i]);
                if (panel != null) {
                    targets.push(panel);
                }
            }

            //tween起動
            this.scene.tweens.add({
                targets: targets,
                duration: 100,
                props: {
                    alpha: { from: 1, to: 0 },
                },
                onComplete: () => {
                    this._onEnd();
                }
            });

            this.step = JankenPlay.Step.FINISH_WAIT;
            return;
        }

        //ここまで来るのはtweenを起動できなかった場合
        //手動でステップを変更する
        this._onEnd();
    }

    // 終了まち
    private _stepFinishWait(): void {
        // this.step = JankenPlay.Step.END;
    }

    // ランダム選択タイマーを開始する
    private _startRandomSelectTimer(): void {
        this._deleteRandomSelectTimer();

        this.randomSelectTimer = this.scene.time.addEvent({
            delay: 3000,
            callback: this._randomSelect,
            callbackScope: this,
        });
    }

    // ランダム選択タイマーを削除する
    private _deleteRandomSelectTimer(): void {
        if (this.randomSelectTimer != null) {
            this.randomSelectTimer.remove();
        }
    }

    // SE再生タイマーを開始
    private _startSeTimer(): void {
        this._deleteSeTimer();

        this.seTimer = this.scene.time.addEvent({
            delay: 666,
            callback: this._playSecond,
            callbackScope: this,
        });
    }
    // SE再生タイマーを削除
    private _deleteSeTimer(): void {
        if (this.seTimer != null) {
            this.seTimer.remove();
        }
    }

    // 「じゃん」または「あい」の表示
    private _playFirst(): void {
        const janken = this.scene.getJankenManager();
        const moji = this.scene.getMoji();
        if (janken != null && moji != null) {
            const round = janken.getRound();
            if (round > 0) {
                //「あい」
                this.scene.sound.play(Assets.Audio.SE.AI);
                moji.draw(Consts.Moji.Type.AI);
            }
            else {
                //「じゃん」
                this.scene.sound.play(Assets.Audio.SE.JAN);
                moji.draw(Consts.Moji.Type.JAN);
            }
        }
    }

    // 「けん」または「こで」の表示
    private _playSecond(): void {
        const janken = this.scene.getJankenManager();
        const moji = this.scene.getMoji();
        if (janken != null && moji != null) {
            const round = janken.getRound();
            if (round > 0) {
                //「こで」
                this.scene.sound.play(Assets.Audio.SE.KODE);
                moji.draw(Consts.Moji.Type.KODE);
            }
            else {
                //「けん」
                this.scene.sound.play(Assets.Audio.SE.KEN);
                moji.draw(Consts.Moji.Type.KEN);
            }
        }
    }

    // 「ぽん」または「しょ」の表示
    private _playThird(): void {
        const janken = this.scene.getJankenManager();
        const moji = this.scene.getMoji();
        if (janken != null && moji != null) {
            const round = janken.getRound();
            if (round > 0) {
                //「しょ」
                this.scene.sound.play(Assets.Audio.SE.SHO);
                moji.draw(Consts.Moji.Type.SHO);
            }
            else {
                //「ぽん」
                this.scene.sound.play(Assets.Audio.SE.PON);
                moji.draw(Consts.Moji.Type.PON);
            }
        }
    }

    // ランダムで選択する
    private _randomSelect(): void {
        if (this.select !== Consts.Janken.Suit.NONE) {
            return; //選択済みなので何もしない
        }
        const random = Globals.get().getRandom();
        this.select = random.get(Consts.Janken.SUIT_MAX) + Consts.Janken.SUIT_MIN;
    }

    // CPU側決定演出　グーチョキパーの表示を切り替え
    private _updateShuffle(): void {
        //すでに決定しているなら何もしない
        if (this.select != Consts.Janken.Suit.NONE) {
            return;
        }

        const roulette = this.scene.getRoulette();
        if (roulette != null) {
            roulette.lampSet(this.shuffleSuit, true);
        }

        //次に出す手
        switch (this.shuffleSuit) {
            case Consts.Janken.Suit.GU: this.shuffleSuit = Consts.Janken.Suit.CHOKI; break;
            case Consts.Janken.Suit.CHOKI: this.shuffleSuit = Consts.Janken.Suit.PA; break;
            case Consts.Janken.Suit.PA: this.shuffleSuit = Consts.Janken.Suit.GU; break;
        }

        //次の呼び出しタイマーを設定
        {
            if (this.shuffleTimer != null) {
                this.shuffleTimer.remove();
            }

            this.shuffleTimer = this.scene.time.addEvent({
                delay: 64,
                callback: this._updateShuffle,
                callbackScope: this,
            });
        }
    }

    // シャッフルタイマーを削除
    private _deleteShuffleTimer(): void {
        if (this.shuffleTimer != null) {
            this.shuffleTimer.remove();
        }
    }

    // 終了時の処理
    private _onEnd(): void {
        const panels = this.scene.getPanels();
        if (panels != null) {
            //決定状態の表示にする
            panels.setDecide(this.select);
        }
        this.step = JankenPlay.Step.END;
    }
}