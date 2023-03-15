export class IncrementTimer {
    scene: Phaser.Scene;
    start: number;
    end: number;
    delay: number;
    incTimer: Phaser.Time.TimerEvent;

    constructor(scene: Phaser.Scene, start: number, end: number, delay: number) {
        this.scene = scene;
        this.start = start;
        this.end = end;
        this.delay = delay;

        this.incTimer = scene.time.addEvent({ delay: delay });
    }

    destroy(): void {
        if (this.incTimer) {
            this.incTimer.remove();
        }
    }

    getStart(): number {
        return this.start;
    }
    getEnd(): number {
        return this.end;
    }
    getCur(): number {
        const progress = this.incTimer.getProgress();
        const cur = Math.floor(this.start + (this.end - this.start) * progress);
        return cur;
    }

}