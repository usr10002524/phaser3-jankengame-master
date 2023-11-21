import { Lottery } from "../../service/lottery";
import { Random } from "../../service/random";
import { JankenCore } from "./janken-core";
import { JankenCoreConsts } from "./janken-core-consts";

/**
 * じゃんけんマネージャ
 */
export class JankenManager {
    private core: JankenCore;
    private random: Random;
    private lottery: Lottery;

    /**
     * コンストラクタ
     * @param random 乱数
     */
    constructor(random: Random) {
        this.random = random;
        this.core = new JankenCore();
        this.lottery = new Lottery(this.random);
    }

    /**
     * 初期化処理
     */
    start(): void {
        const rateIndex = this.lottery.lotteryWeight(JankenCoreConsts.RateIndexTable);
        this.core.start({ random: this.random, rateIndex: rateIndex });
    }

    /**
     * 1プレー実行する
     * @param playerSuit プレーヤーの手
     * @returns プレー結果
     * @returns cpuSuit CPUの手
     * @returns result 結果
     */
    play(playerSuit: number): { cpuSuit: number, result: number } {
        const result = this.core.play(playerSuit);
        return { cpuSuit: result.enemySuit, result: result.result };
    }

    /**
     * ラウンド数を取得する
     * @returns ラウンド数
     */
    getRound(): number {
        return this.core.getRound();
    }
}