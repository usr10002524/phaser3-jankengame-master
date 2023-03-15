import { Log } from "../../service/logwithstamp";
import { RouletteInfo } from "./roulette-core";

export class RouletteCoreDiagnotics {
    private trials: number;
    private cells: number[];
    private win: number;
    private invalidCount: number;

    constructor() {
        this.trials = 0;
        this.cells = []
        this.win = 0;
        this.invalidCount = 0;
    }

    start(maxIndex: number): void {
        this.trials = 0;
        this.cells = []
        this.win = 0;
        this.invalidCount = 0;

        for (let i = 0; i < maxIndex; i++) {
            this.cells[i] = 0;
        }
    }

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

    get(): { trials: number, cells: number[], win: number, invalidCount: number } {
        return { trials: this.trials, cells: this.cells, win: this.win, invalidCount: this.invalidCount };
    }

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
