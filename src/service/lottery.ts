import { Random } from "./random";

/**
 * 抽選ユーティリティクラス
 */
export class Lottery {

    private random: Random; //乱数生成機

    /**
     * コンストラクタ
     * @param random 乱数
     */
    constructor(random: Random) {
        this.random = random;
    }

    /**
     * 0 <= n < maxの範囲で乱数を生成する
     * @param max 取得する整数の最大値+1の値
     * @returns 0 <= n < maxの範囲の乱数
     */
    lottery(max: number): number {
        return this.random.get(max);
    }

    /**
     * 重み付き配列から抽選を行う
     * @param weigtArray 重みの配列
     * @returns 0 <= n < weigtArray.length-1 の範囲の値を返す。
     */
    lotteryWeight(weigtArray: number[]): number {
        if (weigtArray.length === 0) {
            return -1;  //配列が空
        }

        //ウェイトの合計を算出
        let total = 0;
        for (let i = 0; i < weigtArray.length; i++) {
            total += weigtArray[i];
        }
        if (total === 0) {
            return -1;  //ウェイトの合計が0
        }

        //ウェイト合計までの乱数を取得
        let r = this.random.get(total);
        for (let i = 0; i < weigtArray.length; i++) {
            if (r < weigtArray[i]) {
                return i;
            }
            r -= weigtArray[i]; //ウェイト分を減らす
        }

        return -1;  //セーフティ　ここには来ないはず
    }

    /**
     * 指定した配列をシャッフルし返す。
     * @param array 配列
     * @returns シャッフルされた配列
     */
    arrayShuffle<T>(array: T[]): T[] {
        for (let i = array.length - 1; i >= 0; i--) {
            const j = this.random.get(i + 1);
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}