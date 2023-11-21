import { Random } from "./service/random";
import { ServerData } from "./service/serverdata";

/**
 * グローバル変数クラス
 */
export class Globals {

    //シングルトンで使用するインスタンス
    private static instance: Globals | null = null;

    //シングルトンのインスタンスを取得
    static get(): Globals {
        if (Globals.instance === null) {
            Globals.instance = new Globals();
        }
        return Globals.instance;
    }

    //--------------------------------------------
    // 所持メダル枚数
    private medal: number;
    // 最高ポイント
    private highest: number;
    // 最高値が更新されたか
    private highestUpdated: boolean;
    // 乱数
    private random: Random;
    // サーバデータ
    private serverData: ServerData;


    //外部からインスタンス化できないようにコンストラクタは private にする
    private constructor() {
        this.medal = 0;
        this.highest = 0;
        this.highestUpdated = false;
        const seed = Date.now();
        this.random = new Random(seed);
        this.serverData = new ServerData();

        this.reset();
    }

    /**
     * リセットする
     */
    reset(): void {

    }

    /**
     * 更新処理
     * @param delta 前フレームからの経過時間
     */
    update(delta: number): void {
    }

    /**
     * 所持メダルをセットする
     * @param medal 所持メダル
     */
    setMedal(medal: number): void {
        this.medal = medal;
        this.medal = Math.max(this.medal, 0);
        this._setHighest(this.medal);
    }
    /**
     * 所持メダルを取得する
     * @returns 所持メダル
     */
    getMedal(): number {
        return this.medal;
    }
    /**
     * 所持メダルを加算する
     * @param add 所持メダル
     */
    addMedal(add: number): void {
        this.medal += add;
        this.medal = Math.max(this.medal, 0);
        this._setHighest(this.medal);
    }

    // 最高値をリセットする
    resetHighest(highest: number) {
        this.highest = highest;
        this.highestUpdated = false;
    }
    // 最高値を取得する
    getHighest(): { highest: number, updateded: boolean } {
        return { highest: this.highest, updateded: this.highestUpdated };
    }

    /**
     * 
     * @returns 乱数を取得
     */
    getRandom(): Random {
        return this.random;
    }

    /**
     * サーバデータを取得する
     * @returns サーバデータ
     */
    getServerData(): ServerData {
        return this.serverData;
    }

    /**
     * 
     * @param highest 最高値を設定する
     */
    private _setHighest(highest: number): void {
        if (this.highest < highest) {
            this.highest = highest;
            this.highestUpdated = true;
        }
    }
}