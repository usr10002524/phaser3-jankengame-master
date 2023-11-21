import { Consts } from "../../consts";
import { Log } from "../../service/logwithstamp";
import { JankenInfo } from "./janken-core";

/**
 * じゃんけんゲーム統計データ
 */
export class JankenCoreDiagnotics {
    // 試行回数
    private trials: number;
    // 結果
    private result: {
        win: number,
        lose: number,
        draw: number,
    }[];
    // 強制で決定した際の結果
    private resultForce: {
        win: number,
        lose: number,
        draw: number,
    }[];
    // プレーヤーの手
    private playerSuit: {
        gu: number,
        choki: number,
        pa: number,
    }[];
    // CPUの手
    private enemySuit: {
        gu: number,
        choki: number,
        pa: number,
    }[];

    /**
     * コンストラクタ
     */
    constructor() {
        this.trials = 0;
        this.result = [];
        this.resultForce = [];
        this.playerSuit = [];
        this.enemySuit = [];
    }

    /**
     * 開始
     * @param maxRound 最大ラウンド数
     */
    start(maxRound: number) {
        this.result = [];
        this.resultForce = [];
        this.playerSuit = [];
        this.enemySuit = [];

        for (let i = 0; i < maxRound; i++) {
            this.result[i] = { win: 0, lose: 0, draw: 0 };
            this.resultForce[i] = { win: 0, lose: 0, draw: 0 };
            this.playerSuit[i] = { gu: 0, choki: 0, pa: 0 };
            this.enemySuit[i] = { gu: 0, choki: 0, pa: 0 };
        }
    }

    /**
     * 履歴を追加する
     * @param history 履歴データ
     */
    add(history: JankenInfo[]): void {
        if (history.length === 0) {
            return;
        }

        this.trials++;

        //結果を記録
        const round = history.length - 1;
        const lastHistory = history[round];
        if (lastHistory.force) {
            switch (lastHistory.result) {
                case Consts.Janken.Result.WIN: this.resultForce[round].win++; break;
                case Consts.Janken.Result.LOSE: this.resultForce[round].lose++; break;
                case Consts.Janken.Result.DRAW: this.resultForce[round].draw++; break;
            }
        }
        else {
            switch (lastHistory.result) {
                case Consts.Janken.Result.WIN: this.result[round].win++; break;
                case Consts.Janken.Result.LOSE: this.result[round].lose++; break;
                case Consts.Janken.Result.DRAW: this.result[round].draw++; break;
            }
        }

        //使用したスートを記録
        for (let i = 0; i < history.length; i++) {
            switch (history[i].player) {
                case Consts.Janken.Suit.GU: this.playerSuit[i].gu++; break;
                case Consts.Janken.Suit.CHOKI: this.playerSuit[i].choki++; break;
                case Consts.Janken.Suit.PA: this.playerSuit[i].pa++; break;
            }
            switch (history[i].enemy) {
                case Consts.Janken.Suit.GU: this.enemySuit[i].gu++; break;
                case Consts.Janken.Suit.CHOKI: this.enemySuit[i].choki++; break;
                case Consts.Janken.Suit.PA: this.enemySuit[i].pa++; break;
            }
        }
    }

    /**
     * 結果を出力する
     */
    report(): void {
        Log.put(`,trials,${this.trials}`);
        Log.put(`,result`);
        Log.put(`,round,win,lose`);
        for (let i = 0; i < this.result.length; i++) {
            // Log.put(`round${i + 1}: win:${this.result[i].win} lose:${this.result[i].lose} draw:${this.result[i].draw}`);
            Log.put(`,${i + 1},${this.result[i].win},${this.result[i].lose},${this.result[i].draw}`);
        }
        Log.put(`,resultForce:`);
        for (let i = 0; i < this.resultForce.length; i++) {
            // Log.put(`round${i + 1}: win:${this.resultForce[i].win} lose:${this.resultForce[i].lose} draw:${this.resultForce[i].draw}`);
            Log.put(`,${i + 1},${this.resultForce[i].win},${this.resultForce[i].lose},${this.resultForce[i].draw}`);
        }
        Log.put(`,playerSuit:`);
        Log.put(`,round,gu,choki,pa`);
        for (let i = 0; i < this.playerSuit.length; i++) {
            // Log.put(`round${i + 1}: gu:${this.playerSuit[i].gu} choki:${this.playerSuit[i].choki} pa:${this.playerSuit[i].pa}`);
            Log.put(`,${i + 1},${this.playerSuit[i].gu},${this.playerSuit[i].choki},${this.playerSuit[i].pa}`);
        }
        Log.put(`,enemySuit:`);
        Log.put(`,round,gu,choki,pa`);
        for (let i = 0; i < this.enemySuit.length; i++) {
            // Log.put(`round${i + 1}: gu:${this.enemySuit[i].gu} choki:${this.enemySuit[i].choki} pa:${this.enemySuit[i].pa}`);
            Log.put(`,${i + 1},${this.enemySuit[i].gu},${this.enemySuit[i].choki},${this.enemySuit[i].pa}`);
        }

    }
}