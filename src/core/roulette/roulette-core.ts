import { Log } from "../../service/logwithstamp";
import { Lottery } from "../../service/lottery";
import { Random } from "../../service/random";
import { Cell, RouletteCoreConsts } from "./roulette-core-consts";

/**
 * ルーレット結果情報
 */
export type RouletteInfo = {
    index: number,  // 停止位置
    win: number,    // 獲得WIN
}

/**
 * ルーレットコアクラス
 */
export class RouletteCore {

    private lottery: Lottery | null;
    private cells: Cell[];
    private history: RouletteInfo[];

    /**
     * コンストラクタ
     */
    constructor() {
        this.lottery = null;
        this.cells = [];
        this.history = [];

    }

    /**
     * 初期化
     * @param config コンフィグ
     * @param random 乱数
     * @param cellTableIndex セルテーブルのインデックス
     */
    start(config: { random: Random, cellTableIndex: number }): void {
        this.lottery = new Lottery(config.random);
        this.history = [];

        this._initCells(config.cellTableIndex);
    }

    /**
     * 1プレー実行する
     * @returns index 停止位置
     * @returns win 獲得WIN
     */
    play(): { index: number, win: number } {
        const index = this._lottery();
        let win = 0;
        if (index !== -1) {
            win = this.cells[index].win;
        }

        //結果を格納
        this.history.push({ index: index, win: win });

        return { index: index, win: win };
    }

    /**
     * 履歴を取得する
     * @returns 履歴情報
     */
    getHistory(): RouletteInfo[] {
        return this.history;
    }

    // 指定したセルテーブルインデックスで初期化する
    private _initCells(index: number) {

        this.cells = [];

        if (index < 0 || index >= RouletteCoreConsts.CellTables.length) {
            Log.put(`illegal index:${index}. use default index:${RouletteCoreConsts.DEFAULT_CELLTABLE_INDEX}`)
            index = RouletteCoreConsts.DEFAULT_CELLTABLE_INDEX;
        }
        const cellTable = RouletteCoreConsts.CellTables[index];

        for (let i = 0; i < cellTable.cells.length; i++) {
            this.cells.push({ win: cellTable.cells[i].win, weight: cellTable.cells[i].weight });
        }
    }

    // 抽選を行う
    private _lottery(): number {
        if (this.lottery == null) {
            return -1;
        }
        const weight = this._getWeightArray();
        const index = this.lottery.lotteryWeight(weight);
        return index;
    }

    // 重み追記抽選テーブルを取得する
    private _getWeightArray(): number[] {
        const weight: number[] = [];

        for (let i = 0; i < this.cells.length; i++) {
            weight.push(this.cells[i].weight);
        }

        return weight;
    }
}