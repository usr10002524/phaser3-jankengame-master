import { Lottery } from "../../service/lottery";
import { Random } from "../../service/random";
import { JankenCore } from "./janken-core";
import { JankenCoreConsts } from "./janken-core-consts";

export class JankenManager {
    private core: JankenCore;
    private random: Random;
    private lottery: Lottery;

    constructor(random: Random) {
        this.random = random;
        this.core = new JankenCore();
        this.lottery = new Lottery(this.random);
    }

    start(): void {
        const rateIndex = this.lottery.lotteryWeight(JankenCoreConsts.RateIndexTable);
        this.core.start({ random: this.random, rateIndex: rateIndex });
    }

    play(playerSuit: number): { cpuSuit: number, result: number } {
        const result = this.core.play(playerSuit);
        return { cpuSuit: result.enemySuit, result: result.result };
    }

    getRound(): number {
        return this.core.getRound();
    }
}