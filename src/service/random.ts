
/**
 * XorShiftを使った乱数生成
 */
export class Random {
    private x: number;
    private y: number;
    private z: number;
    private w: number;

    constructor(seed: number) {
        this.x = 683164;
        this.y = 2549173053;
        this.z = 8063410069;
        this.w = seed;
    }

    /**
     * Number.MIN_SAFE_INTEGER～Number.MAX_SAFE_INTEGERの範囲で乱数を取得する
     * @returns 乱数
     */
    next(): number {
        let t;

        t = this.x ^ (this.x << 11);
        this.x = this.y; this.y = this.z; this.z = this.w;
        return this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8));
    }

    /**
     * 0 <= n < maxの範囲で乱数を生成する
     * @param max 取得する整数の最大値+1の値
     * @returns 0 <= n < maxの範囲の乱数
     */
    get(max: number): number {
        const r = Math.abs(this.next());
        return (r % max);
    }
}