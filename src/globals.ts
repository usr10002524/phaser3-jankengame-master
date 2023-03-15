import { Random } from "./service/random";
import { ServerData } from "./service/serverdata";

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
    private medal: number;
    private highest: number;
    private highestUpdated: boolean;
    private random: Random;
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

    reset(): void {

    }

    update(delta: number): void {
    }

    setMedal(medal: number): void {
        this.medal = medal;
        this.medal = Math.max(this.medal, 0);
        this._setHighest(this.medal);
    }
    getMedal(): number {
        return this.medal;
    }
    addMedal(add: number): void {
        this.medal += add;
        this.medal = Math.max(this.medal, 0);
        this._setHighest(this.medal);
    }

    resetHighest(highest: number) {
        this.highest = highest;
        this.highestUpdated = false;
    }
    getHighest(): { highest: number, updateded: boolean } {
        return { highest: this.highest, updateded: this.highestUpdated };
    }

    getRandom(): Random {
        return this.random;
    }

    getServerData(): ServerData {
        return this.serverData;
    }


    private _setHighest(highest: number): void {
        if (this.highest < highest) {
            this.highest = highest;
            this.highestUpdated = true;
        }
    }
}