import { Consts } from "../consts";
import { JankenCore } from "../core/janken/janken-core";
import { JankenCoreConsts } from "../core/janken/janken-core-consts";
import { JankenCoreDiagnotics } from "../core/janken/janken-core-diagnotics";
import { RouletteCoreDiagnotics } from "../core/roulette/roulette-core-diagnotics";
import { Log } from "../service/logwithstamp";
import { Lottery } from "../service/lottery";
import { Random } from "../service/random";
import { RouletteCore } from "../core/roulette/roulette-core";
import { RouletteCoreConsts } from "../core/roulette/roulette-core-consts";

/**
 * テストシーン
 */
export class SceneTest extends Phaser.Scene {

    private trials: number;
    private random: Random | null;
    private janken: JankenCore | null;
    private jankenDiag: JankenCoreDiagnotics | null;

    private roulette: RouletteCore | null;
    private rouletteDiag: RouletteCoreDiagnotics | null;

    private gameDiag: GameDiagnotics | null;

    /**
     * コンストラクタ
     */
    constructor() {
        super({ key: "Test" });

        this.trials = 0;
        this.random = null;
        this.janken = null;
        this.jankenDiag = null;

        this.roulette = null;
        this.rouletteDiag = null;

        this.gameDiag = null;
    }

    /**
     * ロード
     */
    preload(): void {
    }

    /**
     * 初期化処理
     */
    create(): void {

        const seed = Date.now();
        Log.put(`seed:${seed}`,);
        this.random = new Random(seed);

        const checkType: number = 2;

        if (checkType === 0) {
            this.trials = 10000;
            this.janken = new JankenCore();
            this.jankenDiag = new JankenCoreDiagnotics();

            this.jankenDiag.start(JankenCoreConsts.MAXROUND);

            for (let i = 0; i < this.trials; i++) {
                this.janken.start({ random: this.random, rateIndex: 2 });

                while (true) {
                    const palyerSuit = this.random.get(Consts.Janken.SUIT_MAX) + Consts.Janken.SUIT_MIN;
                    const result = this.janken.play(palyerSuit);
                    if (result.result != Consts.Janken.Result.DRAW) {
                        break;
                    }
                }
                const history = this.janken.getHistory();
                this.jankenDiag.add(history);
            }

            this.jankenDiag.report();
        }
        else if (checkType === 1) {
            this.trials = 10000;
            this.roulette = new RouletteCore();
            this.rouletteDiag = new RouletteCoreDiagnotics();

            this.rouletteDiag.start(11);

            for (let i = 0; i < this.trials; i++) {
                this.roulette.start({ random: this.random, cellTableIndex: 0 });

                const result = this.roulette.play();
                const history = this.roulette.getHistory();
                this.rouletteDiag.add(history);
            }

            this.rouletteDiag.report();
        }
        else if (checkType === 2) {
            this.trials = 10000;

            this.janken = new JankenCore();
            this.roulette = new RouletteCore();

            this.gameDiag = new GameDiagnotics();
            this.gameDiag.start();

            const lottery = new Lottery(this.random);

            for (let i = 0; i < this.trials; i++) {

                let win = 0;
                let winCount = 0;
                for (let g = 0; g < 100; g++) {
                    //じゃんけんの勝ちやすさ
                    const jankenRateIndex = lottery.lotteryWeight(JankenCoreConsts.RateIndexTable);
                    this.janken.start({ random: this.random, rateIndex: jankenRateIndex });

                    //ルーレットテーブルの抽選
                    const celltTableIndex = this.random.get(RouletteCoreConsts.CellTables.length);
                    this.roulette.start({ random: this.random, cellTableIndex: celltTableIndex });

                    //じゃんけんパート
                    let jankenResult = Consts.Janken.Result.NONE;
                    while (true) {
                        const palyerSuit = this.random.get(Consts.Janken.SUIT_MAX) + Consts.Janken.SUIT_MIN;
                        const jankenResult = this.janken.play(palyerSuit);
                        if (jankenResult.result != Consts.Janken.Result.DRAW) {
                            break;
                        }
                    }

                    if (jankenResult === Consts.Janken.Result.WIN) {
                        //ルーレットパート
                        const result = this.roulette.play();
                        win += result.win;
                        winCount++;
                    }
                }

                this.gameDiag.add(win);
            }

            this.gameDiag.report();
        }
    }

    /**
     * 更新処理
     */
    update(): void {


    }


}


/**
 * 統計情報
 */
class GameDiagnotics {
    private trial: number;
    private totalWin: number;
    private maxWin: number;
    private volatarity: { min: number, max: number, count: number }[];

    /**
     * コンストラクタ
     */
    constructor() {
        this.trial = 0;
        this.totalWin = 0;
        this.maxWin = 0;
        this.volatarity = [];
    }

    /**
     * 初期化処理
     */
    start(): void {
        this.trial = 0;
        this.totalWin = 0;
        this.maxWin = 0;
        this.volatarity = [];

        //0
        this.volatarity.push({ min: 0, max: 0, count: 0 });
        //1-9
        this.volatarity.push({ min: 1, max: 9, count: 0 });

        //10-99
        let add = 10;
        for (let i = 10; i < 100; i += add) {
            this.volatarity.push({ min: i, max: i + add - 1, count: 0 });
        }
        //100-199
        add = 10;
        for (let i = 100; i < 200; i += add) {
            this.volatarity.push({ min: i, max: i + add - 1, count: 0 });
        }
        //200-500
        add = 50;
        for (let i = 200; i < 500; i += add) {
            this.volatarity.push({ min: i, max: i + add - 1, count: 0 });
        }
        //500
        this.volatarity.push({ min: 500, max: -1, count: 0 });

    }

    /**
     * 結果を追加する
     * @param win 獲得WIN
     */
    add(win: number): void {
        if (win > this.maxWin) {
            this.maxWin = win;
        }

        const index = this._getIndex(win);
        if (index < 0) {
            console.log(`illegal index. win=${win}`);
            return;
        }
        this.volatarity[index].count++;

        this.trial++;
        this.totalWin += win;
    }

    /**
     * 結果を出力する
     */
    report(): void {
        Log.put(`,trial,${this.trial}`);
        Log.put(`,totalWin,${this.totalWin}`);
        Log.put(`,maxWin,${this.maxWin}`);
        Log.put(`,volatarity`);
        Log.put(`,min,max,count`);

        for (let i = 0; i < this.volatarity.length; i++) {
            const v = this.volatarity[i];
            Log.put(`,${v.min},${v.max},${v.count}`);
        }
    }

    // 獲得WINからインデックスを取得する
    private _getIndex(win: number): number {
        for (let i = 0; i < this.volatarity.length; i++) {
            const v = this.volatarity[i];
            if (v.min === -1) {
                if (win <= v.max) {
                    return i;
                }
            }
            else if (v.max === -1) {
                if (win >= v.min) {
                    return i;
                }
            }
            else {
                if (v.min <= win && win <= v.max) {
                    return i;
                }
            }
        }

        return -1;
    }
}
