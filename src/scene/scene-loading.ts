import { AtsumaruBase, AtsumaruConsts, AtsumaruServerDataLoad, AtsumaruServerDataLoadInfo } from "../atsumaru/atsumaru";
import { LocalStorage, LocalStorageItem } from "../common/local-storage";
import { Assets } from "../consts";
import { Globals } from "../globals";
import { Log } from "../service/logwithstamp";

/**
 * ローディングシーン
 */
export class SceneLoading extends Phaser.Scene {

    private text: Phaser.GameObjects.Text | null;
    private isLoading: boolean;
    private isLoaded: boolean;
    private atsumaruServerDataLoad: AtsumaruServerDataLoad | null;

    /**
     * コンストラクタ
     */
    constructor() {
        super('SceneLoading');

        this.text = null;
        this.isLoading = false;
        this.isLoaded = false;
        this.atsumaruServerDataLoad = null;
    }

    /**
     * ロード
     */
    preload() {
        //TODO ここでアセットを読み込む
        this.load.setBaseURL(Assets.BASE);

        //グラフィック
        this.load.atlas(Assets.Graphic.Roulette.KEY, Assets.Graphic.Roulette.FILE, Assets.Graphic.Roulette.ATLAS);
        this.load.atlas(Assets.Graphic.Panels.KEY, Assets.Graphic.Panels.FILE, Assets.Graphic.Panels.ATLAS);
        this.load.atlas(Assets.Graphic.Sheets.KEY, Assets.Graphic.Sheets.FILE, Assets.Graphic.Sheets.ATLAS);
        this.load.atlas(Assets.Graphic.Moji.KEY, Assets.Graphic.Moji.FILE, Assets.Graphic.Moji.ATLAS);
        this.load.atlas(Assets.Graphic.Icons.KEY, Assets.Graphic.Icons.FILE, Assets.Graphic.Icons.ATLAS);
        this.load.atlas(Assets.Graphic.Title.KEY, Assets.Graphic.Title.FILE, Assets.Graphic.Title.ATLAS);
        this.load.atlas(Assets.Graphic.Point.KEY, Assets.Graphic.Point.FILE, Assets.Graphic.Point.ATLAS);
        this.load.atlas(Assets.Graphic.SoundIcons.Atlas.NAME, Assets.Graphic.SoundIcons.Atlas.FILE, Assets.Graphic.SoundIcons.Atlas.ATLAS);


        //オーディオ
        for (let i = 0; i < Assets.Audio.SEs.length; i++) {
            const audio = Assets.Audio.SEs[i];
            this.load.audio(audio.KEY, [audio.OGG, audio.MP3]);
        }

        //サーバデータ
        {
            if (AtsumaruBase.isValid()) {
                this.isLoading = true;
                this.atsumaruServerDataLoad = new AtsumaruServerDataLoad();
                this.atsumaruServerDataLoad.load((info: AtsumaruServerDataLoadInfo) => {
                    this.isLoaded = true;
                    if (info.stat === AtsumaruConsts.CommStat.SUCCESS) {
                        const serverData = Globals.get().getServerData();
                        info.data.forEach(storageItem => {
                            serverData.set(storageItem.key, storageItem.value);
                            Log.put(`key:${storageItem.key} value:${storageItem.value}`, 'SaverDataLoad');
                        });

                    }
                });
            }
            else {
                this.isLoading = true;
                LocalStorage.loadLocalData((result: number, data: LocalStorageItem[]) => {
                    this.isLoaded = true;
                    if (result === AtsumaruConsts.CommStat.SUCCESS) {
                        const serverData = Globals.get().getServerData();
                        data.forEach(storageItem => {
                            serverData.set(storageItem.key, storageItem.value);
                            Log.put(`key:${storageItem.key} value:${storageItem.value}`, 'SaverDataLoad');
                        });
                    }
                });
            }
        }

        //ロード進捗
        {
            const x = this.game.canvas.width * 0.5;
            const y = this.game.canvas.height * 0.5;
            const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
                font: "18px Arial",
                color: "#0000FF"
            }
            this.text = this.add.text(x, y, '', textStyle);
            this.text.setOrigin(0.5, 0.5);
        }
        this.scene.scene.load.on('progress', (progress: number) => {
            this.text?.setText(`Loading...  ${Math.floor(progress * 100)}%`);
        }, this);
        this.scene.scene.load.on('complete', () => {
            this.text?.destroy();
            console.log('load complete');
        }, this);
    }

    /**
     * 初期化処理
     */
    create() {
    }

    /**
     * 更新処理
     */
    update() {
        if (this.isLoading) {
            if (!this.isLoaded) {
                return;
            }

            //最高所持額セット
            // {
            //     const serverData = Globals.get().getServerData();
            //     const value = serverData.get(AtsumaruConsts.Data.HIGHEST);
            //     if (value != null) {
            //         const highest = parseInt(value);
            //         Globals.get().resetHighest(highest);
            //     }
            // }
        }
        this.scene.start("SceneTitle");
        // this.scene.start("SoundTest");
    }
}