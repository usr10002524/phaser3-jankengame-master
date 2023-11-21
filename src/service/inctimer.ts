/**
 * インクリメントタイマー
 */
export class IncrementTimer {
    scene: Phaser.Scene;
    start: number;
    end: number;
    delay: number;
    incTimer: Phaser.Time.TimerEvent;

    /**
     * start から end まで delay 秒で増えるタイマーを作成する
     * @param scene シーン
     * @param start 初期値
     * @param end 終了値
     * @param delay 遷移時間
     */
    constructor(scene: Phaser.Scene, start: number, end: number, delay: number) {
        this.scene = scene;
        this.start = start;
        this.end = end;
        this.delay = delay;

        this.incTimer = scene.time.addEvent({ delay: delay });
    }

    /**
     * タイマーを破棄する
     */
    destroy(): void {
        if (this.incTimer) {
            this.incTimer.remove();
        }
    }

    /**
     * 初期値を取得する
     * @returns 初期値
     */
    getStart(): number {
        return this.start;
    }
    /**
     * 終了地を取得する
     * @returns 終了値
     */
    getEnd(): number {
        return this.end;
    }
    /**
     * 現在の値を取得する
     * @returns 現在の値
     */
    getCur(): number {
        const progress = this.incTimer.getProgress();
        const cur = Math.floor(this.start + (this.end - this.start) * progress);
        return cur;
    }

}