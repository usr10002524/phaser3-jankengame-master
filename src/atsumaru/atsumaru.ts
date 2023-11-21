/**
 * AtsumaruAPI を使う際のラッパー
 */

import { AtsumaruApiError, Observer, StorageItem, Subscription } from "@atsumaru/api-types";
import { RPGAtsumaruApi } from "@atsumaru/api-types";

export const AtsumaruConsts = {
    //アツマール用
    Data: {
        BONUS: 'bonus',
        MEDAL: 'medal',
        // HIGHEST: 'highest',
    },
    //スコアボード
    ScoreBoard: {
        HIGHEST: 1,
    },

    CommStat: {
        NONE: 0,    //通信していない
        DURING: 1,  //通信中
        SUCCESS: 2, //成功
        FAIL: 3,     //失敗
    },

    SAVE_INTERVAL: 60 * 1000,
}

export class AtsumaruBase {
    //Atumaruが有効かどうか
    static isValid(): boolean {
        const atsumaru = window.RPGAtsumaru;
        if (atsumaru) {
            return true;
        }
        else {
            return false;
        }
    }

    protected _withAtsumaru(fn: (atsumaru: RPGAtsumaruApi) => void): void {
        const atsumaru = window.RPGAtsumaru;
        if (atsumaru) {
            fn(atsumaru);
        }
        else {
            // console.log("RPGAtsumaruオブジェクトが存在しません");
        }
    }
}


//--- master volume -----------------------
export type AtsumaruMasterVolumeInfo = {
    isChanged: boolean; //マスターボリュームが変更されたか
    volume: number;     //現在のマスターボリュームの値
}

/**
 * マスターボリューム
 */
export class AtsumaruMasterVolume
    extends AtsumaruBase
    implements Observer<number>
{

    private isActive: boolean;
    private isChanged: boolean;
    private masterVolume: number;
    private callback: ((info: AtsumaruMasterVolumeInfo) => void) | null;

    constructor() {
        super();

        this.isActive = false;
        this.isChanged = false;
        this.masterVolume = 0;
        this.callback = null;
    }

    /**
     * 初期化。起動時に一度呼ぶ。
     */
    initialize(): void {
        // console.log(`AtsumaruMasterVolume.initialize called.`);

        if (AtsumaruBase.isValid()) {
            //初回マスターボリューム取得
            const volume = this._getMasterVolume();
            if (volume != null) {
                //マスターボリュームが取れた
                this.isActive = true;
                this.isChanged = true;
                this.masterVolume = volume;
                console.log(`AtsumaruMasterVolume.initialize. initialize OK! isActive=${this.isActive} masterVolume=${this.masterVolume}`);
            }

            //ボリューム変更コールバック設定
            this._setChangeVolumeCallback();
        }
    }

    /**
     * コールバックを設定する
     * @param fn コールバック関数
     */
    setCallback(fn: (info: AtsumaruMasterVolumeInfo) => void) {
        this.callback = fn;
    }

    /**
     * マスターボリューム情報(AtsumaruMasterVolumeInfo)を取得する。
     * @returns マスターボリュームの情報を返す。アツマールが無効の場合はnullが返される。
     */
    getMasterVolume(): AtsumaruMasterVolumeInfo | null {
        if (this.isActive) {
            const ret: AtsumaruMasterVolumeInfo = {
                isChanged: this.isChanged,
                volume: this.masterVolume,
            };

            //変更フラグは下ろす
            this.isChanged = false;
            return ret;
        }
        else {
            return null;
        }
    }

    // マスターボリュームを取得する
    private _getMasterVolume(): number | null {
        let volume = null;
        this._withAtsumaru(atsumaru => {
            volume = atsumaru.volume.getCurrentValue();
            // console.log(`AtsumaruMasterVolume._getMasterVolume called. volume=${volume}`);
        });
        return volume;
    }

    // ボリューム変更コールバックを設定する
    private _setChangeVolumeCallback(): void {
        // console.log(`AtsumaruMasterVolume._setChangeVolumeCallback called.`);
        this._withAtsumaru(atsumaru => atsumaru.volume.changed.subscribe(this));
    }

    //--- implements Observer<number> -------------------
    start(subscription: Subscription): void {
    }

    next(volume: number) {
        // console.log(`AtsumaruMasterVolume._onChangeMasterVolume called. volume=${volume}`);

        if (this.isActive) {
            if (this.masterVolume != volume) {
                this.masterVolume = volume;
                this.isChanged = true;
                if (this.callback != null) {
                    this.callback({ isChanged: this.isChanged, volume: this.masterVolume });
                }
            }
        }
    }

    error(errorValue: any) {
        console.log(`${errorValue}`);
    }
}

//--- snap shot -----------------------
/**
 * スナップショット
 */
export class AtsumaruSnapShot extends AtsumaruBase {

    private currentScene: Phaser.Scene | null;
    private lastImage: HTMLImageElement | null;
    private modalOpen: boolean;

    private static modalName = 'ScreenshotModal__ScreenshotModal__Body';

    constructor() {
        super();

        this.currentScene = null;
        this.lastImage = null;
        this.modalOpen = false;
    }

    initialize(): void {
        this._withAtsumaru(atsumaru => {
            atsumaru.experimental?.screenshot?.setScreenshotHandler?.(async () => {
                if (this.currentScene == null) {
                    // シーンが設定されていない
                    console.log("currentScene == null");
                    return "";
                }
                else {
                    // シーンからスナップショットを取得する
                    this.currentScene.game.renderer.snapshot((snapshot: Phaser.Display.Color | HTMLImageElement) => {
                        console.log("_snapshot called");

                        //前回くっつけた画像がある場合は外す
                        if (this.lastImage != null) {
                            document.body.removeChild(this.lastImage);
                            this.lastImage = null;
                        }

                        //画像を追加する
                        this.lastImage = snapshot as HTMLImageElement;
                        const child = document.body.appendChild(this.lastImage);
                        child.setAttribute('hidden', '');
                    });

                    //snapshotを読んだあと、コールバック処理関数の処理を行うのにラグがあるため、スリープで待つ。
                    await this._sleep(100);
                    if (this.lastImage != null) {
                        return this.lastImage.currentSrc;
                    }
                    else {
                        return "";
                    }
                }
            });
        });

    }

    // シーンをセットする
    setScene(scene: Phaser.Scene): void {
        this.currentScene = scene;
    }

    //スリープ
    private async _sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}



//--- server data -----------------------
//--- server data load -----------------------
export type AtsumaruServerDataLoadInfo = {
    stat: number,
    data: StorageItem[],
};

/**
 * サーバデータロード
 */
export class AtsumaruServerDataLoad extends AtsumaruBase {

    private stat: number;
    private items: StorageItem[];
    private callback: ((info: AtsumaruServerDataLoadInfo) => void) | null;

    constructor() {
        super();
        this.stat = AtsumaruConsts.CommStat.NONE;
        this.items = [];
        this.callback = null;
    }

    /**
     * コールバックを設定する
     * @param fn コールバック
     */
    setCallback(fn: (info: AtsumaruServerDataLoadInfo) => void): void {
        this.callback = fn;
    }

    /**
     * データをロードする
     * @param callback ロード完了時のコールバック
     */
    load(callback?: (info: AtsumaruServerDataLoadInfo) => void): void {
        console.log('AtsumaruServerDataLoad called.');

        if (callback != null) {
            this.setCallback(callback);
        }

        if (!AtsumaruBase.isValid()) {
            //アツマールが有効ではない
            console.log("AtsumaruServerDataLoad. Atsumaru not in work.");
            this.stat = AtsumaruConsts.CommStat.FAIL;
            this.items = [];
            if (this.callback != null) {
                this.callback({ stat: this.stat, data: this.items });
            }
            return;
        }

        this._withAtsumaru(atsumaru => {
            console.log("Atsumaru atsumaru.storage.getItems() start.");
            //ロード開始
            this.stat = AtsumaruConsts.CommStat.DURING;
            this.items = [];

            atsumaru.storage.getItems()
                .then(items => {
                    console.log("Atsumaru atsumaru.storage.getItems() success.");

                    this.stat = AtsumaruConsts.CommStat.SUCCESS;
                    this.items = items;
                    if (this.callback != null) {
                        this.callback({ stat: this.stat, data: this.items });
                    }
                })
                .catch((error: AtsumaruApiError) => {
                    console.error(error.message);
                    console.log("Atsumaru atsumaru.storage.getItems() fail.");

                    this.stat = AtsumaruConsts.CommStat.FAIL;
                    this.items = [];
                    if (this.callback != null) {
                        this.callback({ stat: this.stat, data: this.items });
                    }
                });
        });
    }

    /**
     * データロード状況をチェックする
     * @returns データロード情報
     */
    check(): AtsumaruServerDataLoadInfo {
        const info: AtsumaruServerDataLoadInfo = { stat: this.stat, data: this.items };
        return info;
    }
}

//--- server data save -----------------------
/**
 * サーバデータセーブ
 */
export class AtsumaruServerDataSave extends AtsumaruBase {

    private stat: number;
    private callback: ((stat: number) => void) | null;

    constructor() {
        super();
        this.stat = AtsumaruConsts.CommStat.NONE;
        this.callback = null;
    }

    /**
     * コールバックを設定する
     * @param fn コールバック関数
     */
    setCallback(fn: (stat: number) => void): void {
        this.callback = fn;
    }

    /**
     * データをセーブする
     * @param data セーブするデータ
     * @param callback セーブ完了時のコールバック
     */
    save(data: StorageItem[], callback?: (stat: number) => void): void {
        console.log('AtsumaruServerDataSave called.');

        if (callback != null) {
            this.setCallback(callback);
        }

        if (!AtsumaruBase.isValid()) {
            //アツマールが有効ではない
            console.log("AtsumaruServerDataLoad. Atsumaru not in work.");
            this.stat = AtsumaruConsts.CommStat.FAIL;
            if (this.callback != null) {
                this.callback(this.stat);
            }
            return;
        }

        //データ保存
        this._withAtsumaru(atsumaru => {
            console.log("Atsumaru atsumaru.storage.setItems() start.");
            this.stat = AtsumaruConsts.CommStat.DURING;

            atsumaru.storage.setItems(data)
                .then((value) => {
                    console.log("Atsumaru atsumaru.storage.setItems() success.");
                    this.stat = AtsumaruConsts.CommStat.SUCCESS;
                    if (this.callback != null) {
                        this.callback(this.stat);
                    }
                })
                .catch((error: AtsumaruApiError) => {
                    console.error(error.message);
                    console.log("Atsumaru atsumaru.storage.setItems() fail.");
                    this.stat = AtsumaruConsts.CommStat.FAIL;
                    if (this.callback != null) {
                        this.callback(this.stat);
                    }
                });
        });
    }

    /**
     * データセーブ状況をチェックする
     * @returns 通信結果(@see AtsumaruConsts.CommStat)
     */
    check(): number {
        return this.stat;
    }
}

//--- server data delete -----------------------
/**
 * サーバデータ削除
 */
export class AtsumaruServerDataDelete extends AtsumaruBase {

    private stat: number;
    private callback: ((stat: number) => void) | null;

    constructor() {
        super();
        this.stat = AtsumaruConsts.CommStat.NONE;
        this.callback = null;
    }

    /**
     * コールバックを設定する
     * @param fn コールバック関数
     */
    setCallback(fn: (stat: number) => void): void {
        this.callback = fn;
    }

    /**
     * データを削除する
     * @param key 削除するデータのキー
     * @param callback 削除完了コールバック
     */
    delete(key: string, callback?: (stat: number) => void): void {
        console.log('AtsumaruServerDataDelete called.');

        if (callback != null) {
            this.setCallback(callback);
        }

        if (!AtsumaruBase.isValid()) {
            //アツマールが有効ではない
            console.log("AtsumaruServerDataDelete. Atsumaru not in work.");
            this.stat = AtsumaruConsts.CommStat.FAIL;
            if (this.callback != null) {
                this.callback(this.stat);
            }
            return;
        }

        //データ削除
        this._withAtsumaru(atsumaru => {
            console.log("Atsumaru atsumaru.storage.removeItem() start.");
            this.stat = AtsumaruConsts.CommStat.DURING;

            atsumaru.storage.removeItem(key)
                .then((value) => {
                    console.log("Atsumaru atsumaru.storage.removeItem() success.");
                    this.stat = AtsumaruConsts.CommStat.SUCCESS;
                    if (this.callback != null) {
                        this.callback(this.stat);
                    }
                })
                .catch((error: AtsumaruApiError) => {
                    console.error(error.message);
                    console.log("Atsumaru atsumaru.storage.removeItem() fail.");
                    this.stat = AtsumaruConsts.CommStat.FAIL;
                    if (this.callback != null) {
                        this.callback(this.stat);
                    }
                });
        });
    }

    /**
     * データ削除状況をチェックする
     * @returns 通信結果(@see AtsumaruConsts.CommStat)
     */
    check(): number {
        return this.stat;
    }
}


//--- scoreboard save -----------------------
/**
 * スコアボードデータ保存
 */
export class AtsumaruScoreboardSave extends AtsumaruBase {

    private stat: number;
    private callback: ((stat: number) => void) | null;

    constructor() {
        super();

        this.stat = AtsumaruConsts.CommStat.NONE;
        this.callback = null;
    }

    /**
     * コールバック関数をセットする
     * @param fn コールバック関数
     */
    setCallback(fn: (stat: number) => void): void {
        this.callback = fn;
    }

    save(boardId: number, score: number, callback?: (stat: number) => void): void {
        console.log('AtsumaruScoreboardSave called.');

        if (callback != null) {
            this.setCallback(callback);
        }

        if (!AtsumaruBase.isValid()) {
            //アツマールが有効ではない
            console.log("AtsumaruScoreboardSave. Atsumaru not in work.");
            this.stat = AtsumaruConsts.CommStat.FAIL;
            if (this.callback != null) {
                this.callback(this.stat);
            }
            return;
        }

        //スコアボード保存
        this._withAtsumaru(atsumaru => {
            console.log("Atsumaru atsumaru.experimental.scoreboards.setRecord() start.");
            this.stat = AtsumaruConsts.CommStat.DURING;

            atsumaru.experimental?.scoreboards?.setRecord?.(boardId, score)
                .then((value) => {
                    console.log("Atsumaru atsumaru.experimental.scoreboards.setRecord() success.");
                    this.stat = AtsumaruConsts.CommStat.SUCCESS;
                    if (this.callback != null) {
                        this.callback(this.stat);
                    }
                })
                .catch((error: AtsumaruApiError) => {
                    console.error(error.message);
                    console.log("Atsumaru atsumaru.experimental.scoreboards.setRecord() fail.");
                    this.stat = AtsumaruConsts.CommStat.FAIL;
                    if (this.callback != null) {
                        this.callback(this.stat);
                    }
                });
        });
    }

    /**
     * データ削除状況をチェックする
     * @returns 通信結果(@see AtsumaruConsts.CommStat)
     */
    check(): number {
        return this.stat;
    }
}

//--- scoreboard display -----------------------
/**
 * スコアボード表示
 */
export class AtsumaruScoreboardDisplay extends AtsumaruBase {

    private stat: number;
    private callback: ((stat: number) => void) | null;

    constructor() {
        super();

        this.stat = AtsumaruConsts.CommStat.NONE;
        this.callback = null;
    }

    /**
     * コールバックを設定する
     * @param fn コールバック関数
     */
    setCallback(fn: (stat: number) => void): void {
        this.callback = fn;
    }

    /**
     * スコアボードを表示する
     * @param boardId ボードID
     * @param callback 表示完了コールバック
     */
    display(boardId: number, callback?: (stat: number) => void): void {
        console.log('AtsumaruScoreboardDisplay called.');

        if (callback != null) {
            this.setCallback(callback);
        }

        if (!AtsumaruBase.isValid()) {
            //アツマールが有効ではない
            console.log("AtsumaruScoreboardDisplay. Atsumaru not in work.");
            this.stat = AtsumaruConsts.CommStat.FAIL;
            if (this.callback != null) {
                this.callback(this.stat);
            }
            return;
        }

        //スコアボード表示
        this._withAtsumaru(atsumaru => {
            console.log("Atsumaru atsumaru.experimental.scoreboards.display() start.");
            this.stat = AtsumaruConsts.CommStat.DURING;

            atsumaru.experimental?.scoreboards?.display?.(boardId)
                .then((value) => {
                    console.log("Atsumaru atsumaru.experimental.scoreboards.display() success.");
                    this.stat = AtsumaruConsts.CommStat.SUCCESS;
                    if (this.callback != null) {
                        this.callback(this.stat);
                    }
                })
                .catch((error: AtsumaruApiError) => {
                    console.error(error.message);
                    console.log("Atsumaru atsumaru.experimental.scoreboards.display() fail.");
                    this.stat = AtsumaruConsts.CommStat.FAIL;
                    if (this.callback != null) {
                        this.callback(this.stat);
                    }
                });
        });
    }

    /**
     * スコアボード表示状況をチェックする
     * @returns 通信結果(@see AtsumaruConsts.CommStat)
     */
    check(): number {
        return this.stat;
    }
}
