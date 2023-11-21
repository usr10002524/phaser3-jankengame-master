import { AtsumaruBase, AtsumaruConsts, AtsumaruMasterVolume, AtsumaruMasterVolumeInfo, AtsumaruScoreboardDisplay, AtsumaruSnapShot } from "../atsumaru/atsumaru";
import { SoundVolume, SoundVolumeConfig } from "../common/sound-volume";
import { Assets, Consts } from "../consts";
import { BgTile } from "../objects/bg/bgtitle";
import { Roulette } from "../objects/roulette/roulette";

/**
 * タイトルシーン
 */
export class SceneTitle extends Phaser.Scene {

    private roulette: Roulette | null;
    private bgTile: BgTile | null;
    private title: Phaser.GameObjects.Image | null;
    private start: Phaser.GameObjects.Image | null;
    private ranking: Phaser.GameObjects.Image | null;
    private panels: Phaser.GameObjects.Rectangle[];
    private shade: Phaser.GameObjects.Rectangle | null;
    private timer: Phaser.Time.TimerEvent | null;
    private demoSuit: number;
    private atmrVolume: AtsumaruMasterVolume | null;
    private atmrSnapshot: AtsumaruSnapShot | null;
    private soundVolume: SoundVolume | null;

    /**
     * コンストラクタ
     */
    constructor() {
        super('SceneTitle');

        this.roulette = null;
        this.bgTile = null;
        this.title = null;
        this.start = null;
        this.ranking = null;
        this.panels = [];
        this.shade = null;
        this.timer = null;
        this.demoSuit = Consts.Janken.Suit.GU;
        this.atmrVolume = null;
        this.atmrSnapshot = null;
        this.soundVolume = null;
    }

    /**
     * 初期化処理
     */
    create(): void {
        this._initVolume();
        this._initSnapshot();

        this.atmrSnapshot = new AtsumaruSnapShot();
        this.atmrSnapshot.initialize();
        this.atmrSnapshot.setScene(this);

        // this.roulette = new Roulette(this);  //見えないので表示しないTT
        this.bgTile = new BgTile(this);
        //title
        {
            const x = this.game.canvas.width * 0.5;
            const y = 230;
            const key = Assets.Graphic.Title.KEY;
            const frame = Assets.Graphic.Title.Frames.TITLE;
            this.title = this.add.image(x, y, key, frame);
            this.title.setDepth(6);
        }
        //パネル表示
        {
            const x = this.game.canvas.width * 0.5;
            const y = 470;
            const w = 300;
            const h = 20;

            const panel = this.add.rectangle(x, y, w, h, 0x0000FF);
            panel.setOrigin(0.5, 0);
            panel.setDepth(6);

            this.panels.push(panel);
        }
        // {
        //     const x = this.game.canvas.width * 0.5;
        //     const y = 550;
        //     const w = 400;
        //     const h = 20;

        //     const panel = this.add.rectangle(x, y, w, h, 0x0000FF);
        //     panel.setOrigin(0.5, 0);
        //     panel.setDepth(6);

        //     this.panels.push(panel);
        // }
        //start
        {
            const x = this.game.canvas.width * 0.5;
            const y = 460;
            this.start = this.add.image(x, y, Assets.Graphic.Title.KEY, Assets.Graphic.Title.Frames.GAMESTART);
            this.start.setDepth(7);
            this.start.setInteractive();
            this.start.on("pointerover", () => {
                this.panels[0].setFillStyle(0x00FF7F);
            });
            this.start.on("pointerout", () => {
                this.panels[0].setFillStyle(0x0000FF);
            });
            this.start.on("pointerdown", () => {
                this.panels[0].setFillStyle(0x00FF7F);
                this.sound.play(Assets.Audio.SE.DECIDE);
            });
            this.start.on("pointerup", () => {
                this.panels[0].setFillStyle(0x0000FF);
                this._onStart();
            });
        }
        //ranking
        // {
        //     const x = this.game.canvas.width * 0.5;
        //     const y = 540;
        //     this.ranking = this.add.image(x, y, Assets.Graphic.Title.KEY, Assets.Graphic.Title.Frames.RANKING);
        //     this.ranking.setDepth(7);
        //     this.ranking.setInteractive();
        //     this.ranking.on("pointerover", () => {
        //         this.panels[1].setFillStyle(0x00FF7F);
        //     });
        //     this.ranking.on("pointerout", () => {
        //         this.panels[1].setFillStyle(0x0000FF);
        //     });
        //     this.ranking.on("pointerdown", () => {
        //         this.panels[1].setFillStyle(0x00FF7F);
        //         this.sound.play(Assets.Audio.SE.DECIDE);
        //     });
        //     this.ranking.on("pointerup", () => {
        //         this.panels[1].setFillStyle(0x0000FF);
        //         this._onRankingStart();
        //     });
        // }
        //shade
        {
            this.shade = this.add.rectangle(0, 0, this.game.canvas.width, this.game.canvas.height, 0x000000, 0.25);
            this.shade.setOrigin(0, 0);
            this.shade.setDepth(5);
        }
        this.timer = null;

        // this._updateDemo();  //見えないので表示しないTT
    }

    // メインシーンへの遷移
    private _onStart(): void {
        this.scene.start("SceneMain");
    }

    // スコアボード表示開始
    private _onRankingStart(): void {
        const ranking = new AtsumaruScoreboardDisplay();
        ranking.display(AtsumaruConsts.ScoreBoard.HIGHEST);
    }

    // デモ更新
    private _updateDemo(): void {
        const roulette = this.roulette;
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

            this.timer = this.time.addEvent({
                delay: 1000,
                callback: this._updateDemo,
                callbackScope: this,
            });
        }
    }

    // サウンドボリューム初期化
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

    // サウンドボリュームを作成
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

    // スクリーンショット初期化
    private _initSnapshot(): void {
        this.atmrSnapshot = new AtsumaruSnapShot();
        this.atmrSnapshot.initialize();
        this.atmrSnapshot.setScene(this);
    }
}