import { Assets, Consts } from "../consts";
import { JankenPlay } from "../behavior/janken-play";
import { JankenStart } from "../behavior/janken-start";
import { Panels } from "../objects/panels/panels";
import { Roulette } from "../objects/roulette/roulette";
import { BehaviorManager } from "../service/behavior";
import { Log } from "../service/logwithstamp";
import { JankenManager } from "../core/janken/janken-manager";
import { Globals } from "../globals";
import { JankenWin } from "../behavior/janken-win";
import { JankenLose } from "../behavior/janken-lose";
import { JankenDraw } from "../behavior/janken-draw";
import { RouletteManager } from "../core/roulette/roulette-manager";
import { RoulettePlay } from "../behavior/roulette-play";
import { LoginBonus } from "../behavior/login-bonus";
import { Moji } from "../objects/moji/moji";
import { AtsumaruBase, AtsumaruConsts, AtsumaruMasterVolume, AtsumaruMasterVolumeInfo, AtsumaruScoreboardSave, AtsumaruServerDataSave, AtsumaruSnapShot } from "../atsumaru/atsumaru";
import { BgTile } from "../objects/bg/bgtitle";
import { Point } from "../objects/point/point";
import { LoginBonusData } from "../bonus/login-bonus-data";
import { SoundVolume, SoundVolumeConfig } from "../common/sound-volume";
import { LocalStorage } from "../common/local-storage";

export class SceneMain extends Phaser.Scene {

    private roulette: Roulette | null;
    private panels: Panels | null;
    private moji: Moji | null;
    private bgTile: BgTile | null;
    private point: Point | null;
    private jankenManager: JankenManager | null;
    private rouletteManager: RouletteManager | null;
    private behaviorManager: BehaviorManager;
    private step: number;
    private behaviorId: number;

    private playerSuit: number;
    private cpuSuit: number;
    private jankenResult: number;

    private rouletteCellIndex: number;
    private rouletteWin: number;

    private saveTimer: Phaser.Time.TimerEvent | null;

    private atmrVolume: AtsumaruMasterVolume | null;
    private atmrSnapshot: AtsumaruSnapShot | null;
    private soundVolume: SoundVolume | null;

    static SAVE_EVERY_GAME: boolean = true; //毎ゲームセーブする

    private static Step = {
        INIT: 0,

        LOGIN: 1,
        LOGIN_WAIT: 2,

        JANKEN_START: 10,
        JANKEN_START_WAIT: 11,
        JANKEN_PLAY: 20,
        JANKEN_PLAY_WAIT: 21,
        JANKEN_RESULT: 30,
        JANKEN_RESULT_WAIT: 31,

        ROULETTE_PLAY: 40,
        ROULETTE_PLAY_WAIT: 41,
        ROULETTE_RESULT: 50,
        ROULETTE_RESULT_WAIT: 51,

        END: 1000,
    }

    constructor() {
        super('SceneMain');

        this.roulette = null;
        this.panels = null;
        this.moji = null;
        this.bgTile = null;
        this.point = null;
        this.jankenManager = null;
        this.rouletteManager = null;
        this.behaviorManager = new BehaviorManager();
        this.step = SceneMain.Step.INIT;
        this.behaviorId = 0;

        this.playerSuit = Consts.Janken.Suit.NONE;
        this.cpuSuit = Consts.Janken.Suit.NONE;
        this.jankenResult = Consts.Janken.Result.NONE;

        this.rouletteCellIndex = 0;
        this.rouletteWin = 0;

        this.saveTimer = null;

        this.atmrVolume = null;
        this.atmrSnapshot = null;
        this.soundVolume = null;
    }

    create(): void {
        this._initVolume();
        this._initSnapshot();

        this.roulette = new Roulette(this);
        this.panels = new Panels(this);
        this.moji = new Moji(this);
        this.bgTile = new BgTile(this);
        this.point = new Point(this);

        const random = Globals.get().getRandom();
        this.jankenManager = new JankenManager(random);
        this.rouletteManager = new RouletteManager(random);

        this.behaviorManager.clear();
        this.step = SceneMain.Step.INIT;

        this.playerSuit = Consts.Janken.Suit.NONE;
        this.cpuSuit = Consts.Janken.Suit.NONE;
        this.jankenResult = Consts.Janken.Result.NONE;

        this.rouletteCellIndex = 0;
        this.rouletteWin = 0;
    }

    update(): void {
        this.panels?.update();
        this.behaviorManager.update();
        this.point?.update();

        switch (this.step) {
            case SceneMain.Step.INIT: {

                this.step = SceneMain.Step.LOGIN;
                break;
            }

            case SceneMain.Step.LOGIN: {
                this._stepLogin();
                break;
            }

            case SceneMain.Step.LOGIN_WAIT: {
                this._stepLoginWait();
                break;
            }


            case SceneMain.Step.JANKEN_START: {
                this._stepJankenStart();
                break;
            }
            case SceneMain.Step.JANKEN_START_WAIT: {
                this._stepJankenStartWait();
                break;
            }

            case SceneMain.Step.JANKEN_PLAY: {
                this._stepJankenPlay();
                break;
            }
            case SceneMain.Step.JANKEN_PLAY_WAIT: {
                this._stepJankenPlayWait();
                break;
            }

            case SceneMain.Step.JANKEN_RESULT: {
                this._stepJankenResult();
                break;
            }
            case SceneMain.Step.JANKEN_RESULT_WAIT: {
                this._stepJankenResultWait();
                break;
            }


            case SceneMain.Step.ROULETTE_PLAY: {
                this._stepRoulettePlay();
                break;
            }
            case SceneMain.Step.ROULETTE_PLAY_WAIT: {
                this._stepRoulettePlayWait();
                break;
            }

            case SceneMain.Step.ROULETTE_RESULT: {
                this._stepRouletteResult();
                break;
            }
            case SceneMain.Step.ROULETTE_RESULT_WAIT: {
                this._stepRouletteResultWait();
                break;
            }
        }
    }

    getPanels(): Panels | null {
        return this.panels;
    }

    getRoulette(): Roulette | null {
        return this.roulette;
    }

    getMoji(): Moji | null {
        return this.moji;
    }

    getJankenManager(): JankenManager | null {
        return this.jankenManager;
    }

    getRouletteManager(): RouletteManager | null {
        return this.rouletteManager;
    }

    onSelectSuit(suit: number): void {

        if (this.jankenManager == null) {
            Log.put('this.jankenManager == null', 'SceneMain.onSelectSuit');
            return;
        }

        //プレーヤーの手に対して、結果を抽選する
        const result = this.jankenManager.play(suit);
        this.playerSuit = suit;
        this.cpuSuit = result.cpuSuit;
        this.jankenResult = result.result;
        Log.put(`player:${this.playerSuit} cpu:${this.cpuSuit} result:${this.jankenResult}`, 'SceneMain.onSelectSuit');

        //ランプの表示を変更
        this.roulette?.lampSet(this.cpuSuit, true);
    }


    private _stepLogin(): void {
        this.behaviorId = this.behaviorManager.add(new LoginBonus(this));
        this.step = SceneMain.Step.LOGIN_WAIT;
    }

    private _stepLoginWait(): void {
        if (this.behaviorManager.isFinished(this.behaviorId)) {
            if (!SceneMain.SAVE_EVERY_GAME) {
                this._serverDataSaveTimer();
            }
            this.step = SceneMain.Step.JANKEN_START;
        }
    }

    private _stepJankenStart(): void {
        this.playerSuit = Consts.Janken.Suit.NONE;
        this.cpuSuit = Consts.Janken.Suit.NONE;
        this.jankenResult = Consts.Janken.Result.NONE;

        if (SceneMain.SAVE_EVERY_GAME) {
            this._serverSave();
        }

        if (this._isDateChanged()) {
            this.scene.start("SceneTitle");
            return;
        }

        if (this.jankenManager != null) {
            this.jankenManager.start();
        }

        this.behaviorId = this.behaviorManager.add(new JankenStart(this));

        this.step = SceneMain.Step.JANKEN_START_WAIT;
    }

    private _stepJankenStartWait(): void {
        if (this._isDateChanged()) {
            this.scene.start("SceneTitle");
            return;
        }

        //演出の終了待ち
        if (this.behaviorManager.isFinished(this.behaviorId)) {
            this.step = SceneMain.Step.JANKEN_PLAY;
        }
    }

    private _stepJankenPlay(): void {
        this.behaviorId = this.behaviorManager.add(new JankenPlay(this));
        this.step = SceneMain.Step.JANKEN_PLAY_WAIT;
    }

    private _stepJankenPlayWait(): void {
        //演出の終了待ち
        if (this.behaviorManager.isFinished(this.behaviorId)) {
            this.step = SceneMain.Step.JANKEN_RESULT;
        }
    }

    private _stepJankenResult(): void {
        switch (this.jankenResult) {
            case Consts.Janken.Result.WIN: {
                this.behaviorId = this.behaviorManager.add(new JankenWin(this));
                break;
            }
            case Consts.Janken.Result.LOSE: {
                this.behaviorId = this.behaviorManager.add(new JankenLose(this));
                break;
            }
            case Consts.Janken.Result.DRAW: {
                this.behaviorId = this.behaviorManager.add(new JankenDraw(this));
                break;
            }
        }
        this.step = SceneMain.Step.JANKEN_RESULT_WAIT;
    }

    private _stepJankenResultWait(): void {
        if (this.behaviorManager.isFinished(this.behaviorId)) {
            switch (this.jankenResult) {
                case Consts.Janken.Result.WIN: {
                    //勝ち→ルーレットへ
                    this.step = SceneMain.Step.ROULETTE_PLAY;
                    break;
                }
                case Consts.Janken.Result.LOSE: {
                    //負け→じゃんけん開始へ
                    this.step = SceneMain.Step.JANKEN_START;
                    break;
                }
                case Consts.Janken.Result.DRAW: {
                    //あいこ→じゃんけん開始へ
                    this.step = SceneMain.Step.JANKEN_PLAY;
                    break;
                }
            }
        }
    }

    private _stepRoulettePlay(): void {
        this.rouletteCellIndex = 0;
        this.rouletteWin = 0;

        if (this.rouletteManager != null) {
            this.rouletteManager.start();
            const result = this.rouletteManager.play();
            this.rouletteCellIndex = result.index;
            this.rouletteWin = result.win;
            Log.put(`roulette index:${this.rouletteCellIndex} win:${this.rouletteWin}`, 'SceneMain._stepRoulettePlay');
        }

        this.behaviorId = this.behaviorManager.add(new RoulettePlay(this, this.rouletteCellIndex, this.playerSuit));
        this.step = SceneMain.Step.ROULETTE_PLAY_WAIT;
    }

    private _stepRoulettePlayWait(): void {
        //演出の終了待ち
        if (this.behaviorManager.isFinished(this.behaviorId)) {
            this.step = SceneMain.Step.ROULETTE_RESULT;
        }
    }

    private _stepRouletteResult(): void {
        //獲得WINを加算
        Globals.get().addMedal(this.rouletteWin);
        this.step = SceneMain.Step.ROULETTE_RESULT_WAIT;

    }

    private _stepRouletteResultWait(): void {
        this.step = SceneMain.Step.JANKEN_START;
    }


    private _isDateChanged(): boolean {
        const serverData = Globals.get().getServerData();
        const data = serverData.get(AtsumaruConsts.Data.BONUS);
        if (data == null) {
            return false;
        }
        const bonusData = new LoginBonusData();
        bonusData.restore(data);
        if (!bonusData.isValid()) {
            return false;
        }
        // if (bonusData.isReceitable()) {
        //     return false;
        // }
        return bonusData.isDateChanged();
    }


    private _serverDataSaveTimer(): void {
        if (this.saveTimer != null) {
            this.saveTimer.remove();
        }

        if (!AtsumaruBase.isValid()) {
            return; //アツマールが有効ではない
        }

        Log.put('called.', 'SceneMain._serverDataSaveTimer');

        this._serverSave();

        this.saveTimer = this.time.addEvent({
            delay: AtsumaruConsts.SAVE_INTERVAL,
            callback: this._serverDataSaveTimer,
            callbackScope: this,
        });
    }

    private _serverSave(): void {
        // if (!AtsumaruBase.isValid()) {
        //     return; //アツマールが有効ではない
        // }

        //現在の値を取得
        const medal = Globals.get().getMedal();
        // const highest = Globals.get().getHighest();

        //データ更新
        const serverData = Globals.get().getServerData();
        serverData.set(AtsumaruConsts.Data.MEDAL, medal.toString());
        // if (highest.updateded) {
        //     serverData.set(AtsumaruConsts.Data.HIGHEST, highest.highest.toString());
        // }

        //更新のあったものを送信
        const strorageItems = serverData.getDirtyData();
        strorageItems.forEach(storageItem => {
            Log.put(`key:${storageItem.key} value:${storageItem.value}`, 'SaverDataSave');
            serverData.resetDirty(storageItem.key);
        });

        if (AtsumaruBase.isValid()) {
            const serverDataSave = new AtsumaruServerDataSave();
            serverDataSave.save(strorageItems);
        }
        else {
            LocalStorage.saveLocalData(strorageItems, (stat: number) => { });
        }

        //スコアボード
        // if (highest.updateded) {
        //     const scoreBoardSave = new AtsumaruScoreboardSave();
        //     let score = medal;
        //     if (highest.updateded && highest.highest > medal) {
        //         score = highest.highest;
        //     }
        //     scoreBoardSave.save(AtsumaruConsts.ScoreBoard.HIGHEST, score);
        // }

    }


    private _initVolume(): void {
        if (AtsumaruBase.isValid()) {
            this.atmrVolume = new AtsumaruMasterVolume();
            this.atmrVolume.initialize();
            const masterVolume = this.atmrVolume.getMasterVolume();
            if (masterVolume != null) {
                this.sound.volume = masterVolume.volume;
            }
            this.atmrVolume.setCallback((info: AtsumaruMasterVolumeInfo) => {
                this.sound.volume = info.volume;
            });
        }
        else {
            this._createSoundVolume();
        }
    }

    private _createSoundVolume(): void {
        const config: SoundVolumeConfig = {
            pos: {
                x: Consts.SoundVolume.Base.Pos.X,
                y: Consts.SoundVolume.Base.Pos.Y,
            },
            depth: Consts.SoundVolume.Base.DEPTH,

            icon: {
                atlas: Assets.Graphic.SoundIcons.Atlas.NAME,
                frame: {
                    volume: Assets.Graphic.SoundIcons.Volume.ON,
                    mute: Assets.Graphic.SoundIcons.Mute.ON,
                },
                pos: {
                    x: Consts.SoundVolume.Icon.Pos.X,
                    y: Consts.SoundVolume.Icon.Pos.Y,
                },
                scale: {
                    x: Consts.SoundVolume.Icon.Scale.X,
                    y: Consts.SoundVolume.Icon.Scale.Y,
                },
                depth: Consts.SoundVolume.Icon.DEPTH,
            },

            guage: {
                pos: {
                    x: Consts.SoundVolume.Guage.Pos.X,
                    y: Consts.SoundVolume.Guage.Pos.Y,
                },
                size: {
                    w: Consts.SoundVolume.Guage.Size.W,
                    h: Consts.SoundVolume.Guage.Size.H,
                },
                color: {
                    normal: Consts.SoundVolume.Guage.Color.NORMAL,
                    disabled: Consts.SoundVolume.Guage.Color.DISABLED,
                    bg: Consts.SoundVolume.GuageBg.COLOR,
                },
                depth: {
                    bar: Consts.SoundVolume.Guage.DEPTH,
                    bg: Consts.SoundVolume.GuageBg.DEPTH,
                },
            },

            handle: {
                size: {
                    w: Consts.SoundVolume.Handle.Size.W,
                    h: Consts.SoundVolume.Handle.Size.H,
                },
                color: {
                    normal: Consts.SoundVolume.Handle.Color.NORMAL,
                    disabled: Consts.SoundVolume.Handle.Color.DISABLED,
                    grabed: Consts.SoundVolume.Handle.Color.GRABED,
                },
                depth: Consts.SoundVolume.Handle.DEPTH,
            },

            panel: {
                pos: {
                    x: Consts.SoundVolume.Panel.Pos.X,
                    y: Consts.SoundVolume.Panel.Pos.Y,
                },
                size: {
                    w: Consts.SoundVolume.Panel.Size.W,
                    h: Consts.SoundVolume.Panel.Size.H,
                },
                color: {
                    normal: Consts.SoundVolume.Panel.COLOR,
                },
                alpha: {
                    normal: Consts.SoundVolume.Panel.ALPHA,
                },
                depth: Consts.SoundVolume.Panel.DEPTH,
            },
        }
        this.soundVolume = new SoundVolume(this, config);
    }

    private _initSnapshot(): void {
        this.atmrSnapshot = new AtsumaruSnapShot();
        this.atmrSnapshot.initialize();
        this.atmrSnapshot.setScene(this);
    }
}