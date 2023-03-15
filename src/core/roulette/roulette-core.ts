import { Log } from "../../service/logwithstamp";
import { Lottery } from "../../service/lottery";
import { Random } from "../../service/random";
import { Cell, RouletteCoreConsts } from "./roulette-core-consts";

export type RouletteInfo = {
    index: number,
    win: number,
}


export class RouletteCore {

    private lottery: Lottery | null;
    private cells: Cell[];
    private history: RouletteInfo[];

    constructor() {
        this.lottery = null;
        this.cells = [];
        this.history = [];

    }

    start(config: { random: Random, cellTableIndex: number }): void {
        this.lottery = new Lottery(config.random);
        this.history = [];

        this._initCells(config.cellTableIndex);
    }

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

    getHistory(): RouletteInfo[] {
        return this.history;
    }

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

    private _lottery(): number {
        if (this.lottery == null) {
            return -1;
        }
        const weight = this._getWeightArray();
        const index = this.lottery.lotteryWeight(weight);
        return index;
    }

    private _getWeightArray(): number[] {
        const weight: number[] = [];

        for (let i = 0; i < this.cells.length; i++) {
            weight.push(this.cells[i].weight);
        }

        return weight;
    }
}