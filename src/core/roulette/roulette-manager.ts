import { Lottery } from "../../service/lottery";
import { Random } from "../../service/random";
import { RouletteCore } from "./roulette-core";
import { RouletteCoreConsts } from "./roulette-core-consts";

/**
 * ルーレットマネージャ
 */
export class RouletteManager {

    private core: RouletteCore;
    private random: Random;
    private lottery: Lottery;

    /**
     * コンストラクタ
     * @param random 乱数
     */
    constructor(random: Random) {
        this.random = random;
        this.core = new RouletteCore();
        this.lottery = new Lottery(this.random);
    }

    /**
     * 初期化
     */
    start(): void {
        const celltTableIndex = this.random.get(RouletteCoreConsts.CellTables.length);
        this.core.start({ random: this.random, cellTableIndex: celltTableIndex });
    }

    /**
     * 1プレー実行する
     * @returns index 停止位置
     * @returns win 獲得WIN
     */
    play(): { index: number, win: number } {
        const result = this.core.play();
        return { index: result.index, win: result.win };
    }

}