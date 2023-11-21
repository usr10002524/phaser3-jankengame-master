import { Log } from "../../service/logwithstamp";
import { RouletteInfo } from "./roulette-core";

/**
 * ルーレット統計情報
 */
export class RouletteCoreDiagnotics {
    // 試行回数
    private trials: number;
    // 各マスの停止数
    private cells: number[];
    // 累計WIN
    private win: number;
    // 不正結果回数
    private invalidCount: number;

    /**
     * コンストラクタ
     */
    constructor() {
        this.trials = 0;
        this.cells = []
        this.win = 0;
        this.invalidCount = 0;
    }

    /**
     * 初期化処理
     * @param maxIndex セル数
     */
    start(maxIndex: number): void {
        this.trials = 0;
        this.cells = []
        this.win = 0;
        this.invalidCount = 0;

        for (let i = 0; i < maxIndex; i++) {
            this.cells[i] = 0;
        }
    }

    /**
     * 結果を追加する
     * @param result ルーレット結果
     */
    add(result: RouletteInfo[]) {
        for (let i = 0; i < result.length; i++) {
            this.trials++;

            const r = result[i];
            if (r.index < 0) {
                this.invalidCount++;
            }
            else {
                this.cells[r.index]++;
                this.win += r.win;
            }
        }
    }

    /**
     * 統計情報を取得する
     * @returns trails 試行回数
     * @returns cells 各マスの停止数
     * @returns win 累計WIN
     * @returns invalidCount 不正結果回数
     */
    get(): { trials: number, cells: number[], win: number, invalidCount: number } {
        return { trials: this.trials, cells: this.cells, win: this.win, invalidCount: this.invalidCount };
    }

    /**
     * 統計情報を出力する
     */
    report(): void {
        Log.put(`,trials,${this.trials}`);
        Log.put(`,result`);
        Log.put(`,index,count`);
        for (let i = 0; i < this.cells.length; i++) {
            // Log.put(`index${i + 1}: count:${this.cells[i]}`);
            Log.put(`,${i + 1},${this.cells[i]}`);
        }
        Log.put(`,invalid,${this.invalidCount}`);
        Log.put(`,win,${this.win}`);
    }
}
