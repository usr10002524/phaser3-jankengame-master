import { AtsumaruConsts, AtsumaruMasterVolume, AtsumaruMasterVolumeInfo, AtsumaruScoreboardDisplay, AtsumaruSnapShot } from "../atsumaru/atsumaru";
import { Assets, Consts } from "../consts";
import { BgTile } from "../objects/bg/bgtitle";
import { Roulette } from "../objects/roulette/roulette";

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
    }

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

    private _onStart(): void {
        this.scene.start("SceneMain");
    }

    private _onRankingStart(): void {
        const ranking = new AtsumaruScoreboardDisplay();
        ranking.display(AtsumaruConsts.ScoreBoard.HIGHEST);
    }

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

    private _initVolume(): void {
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

    private _initSnapshot(): void {
        this.atmrSnapshot = new AtsumaruSnapShot();
        this.atmrSnapshot.initialize();
        this.atmrSnapshot.setScene(this);
    }
}