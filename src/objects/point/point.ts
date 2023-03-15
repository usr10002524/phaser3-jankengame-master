import { Assets, Consts } from "../../consts";
import { Globals } from "../../globals";
import { IncrementTimer } from "../../service/inctimer";

export class Point {

    private scene: Phaser.Scene;
    private container: Phaser.GameObjects.Container;
    private base: Phaser.GameObjects.Image;
    private num: Phaser.GameObjects.Image[];

    private score: number;
    private lastScore: number;
    private incTimer: IncrementTimer | null;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.score = 0;
        this.lastScore = 0;
        this.incTimer = null;

        //container
        {
            const x = Consts.Point.Base.Position.x;
            const y = Consts.Point.Base.Position.y;
            const depth = Consts.Point.Base.DEPTH;
            this.container = this.scene.add.container(x, y);
            this.container.setDepth(depth);
        }

        //base 
        {
            const x = 0;
            const y = 0;
            const depth = Consts.Point.Base.DEPTH;
            const key = Assets.Graphic.Point.KEY;
            const frame = Assets.Graphic.Point.Frames.POINT;
            this.base = this.scene.add.image(x, y, key, frame);
            this.base.setDepth(depth);
            this.container.add(this.base);
        }

        //num
        this.num = [];

        //初回描画
        this.score = Globals.get().getMedal();
        this._setPoint(this.score);
    }

    update(): void {

        //スコアが加算されたらインクリメントを行う
        const curScore = Globals.get().getMedal();
        if (curScore !== this.score) {
            if (this.incTimer != null) {
                this.incTimer.destroy();
                this.incTimer = null;
            }
            //増加値によってインクリメント時間を調整する
            const delay = this._getDelay(curScore - this.score);
            if (delay > 0) {
                //タイマー処理でインクリメント
                this.incTimer = new IncrementTimer(this.scene, this.score, curScore, delay);
            }
            else {
                //即時加算
                this._setPoint(curScore);
            }
            this.score = curScore;
        }

        if (this.incTimer != null) {
            const curValue = this.incTimer.getCur();
            if (this.lastScore != curValue) {
                this._setPoint(curValue);
            }
        }
    }

    private _setPoint(point: number): void {
        //まず今あるものを片付ける
        this._removeNumber();

        //文字列に変換
        let str = point.toString();
        const len = str.length;

        for (let i = 0; i < len; i++) {
            //最後の１文字を取り出す
            const start = len - (i + 1);
            const end = start + 1;
            const c = str.substring(start, end);

            const pos = this._getNumberPosition(i);
            const frame = this._getNumberFrame(c);
            const key = Assets.Graphic.Point.KEY;
            const depth = Consts.Point.Character.DEPTH;

            const img = this.scene.add.image(pos.x, pos.y, key, frame);
            img.setDepth(depth);
            this.num.push(img);
        }
        this.container.add(this.num);
    }


    private _removeNumber(): void {
        this.container.remove(this.num);

        for (let i = 0; i < this.num.length; i++) {
            this.num[i].destroy();
        }

        this.num = [];
    }

    private _getNumberPosition(keta: number): { x: number, y: number } {
        const base_x = Consts.Point.Character.Position.x;
        const base_y = Consts.Point.Character.Position.y;
        const x = base_x - keta * Consts.Point.Character.WIDTH;
        const y = base_y;

        return { x: x, y: y };
    }

    private _getNumberFrame(c: string): string {
        switch (c) {
            case '0': return Assets.Graphic.Point.Frames.POINT_N0;
            case '1': return Assets.Graphic.Point.Frames.POINT_N1;
            case '2': return Assets.Graphic.Point.Frames.POINT_N2;
            case '3': return Assets.Graphic.Point.Frames.POINT_N3;
            case '4': return Assets.Graphic.Point.Frames.POINT_N4;
            case '5': return Assets.Graphic.Point.Frames.POINT_N5;
            case '6': return Assets.Graphic.Point.Frames.POINT_N6;
            case '7': return Assets.Graphic.Point.Frames.POINT_N7;
            case '8': return Assets.Graphic.Point.Frames.POINT_N8;
            case '9': return Assets.Graphic.Point.Frames.POINT_N9;
            default: return '';
        }
    }

    private _getDelay(value: number) {
        if (value <= Consts.Point.Threshold.Small.VALUE) {
            return Consts.Point.Threshold.Small.DELAY;
        }
        else if (value <= Consts.Point.Threshold.Middle.VALUE) {
            return Consts.Point.Threshold.Middle.DELAY;
        }
        else {
            return Consts.Point.Threshold.Large.DELAY;
        }
    }
}