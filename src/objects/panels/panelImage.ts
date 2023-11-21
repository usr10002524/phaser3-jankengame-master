/**
 * パネルイメージクラス
 */
export class PanelImage extends Phaser.GameObjects.Image {

    private prevX: number;
    private prevY: number;
    private clicked: boolean;
    private isTouched: boolean;
    private lastTouched: boolean;
    private touchAllowed: boolean;

    /**
     * コンストラクタ
     * @param scene シーン
     * @param x X座標
     * @param y Y座標
     * @param key ファイルのキー
     * @param frame 表示するフレーム
     */
    constructor(scene: Phaser.Scene, x: number, y: number, key: string, frame: string) {
        super(scene, x, y, key, frame);
        this.prevX = x;
        this.prevY = y;
        this.clicked = false;
        this.isTouched = false;
        this.lastTouched = false;
        this.touchAllowed = true;

        this.setInteractive();
        this.on(Phaser.Input.Events.POINTER_OUT, this._onOut, this);
        this.on(Phaser.Input.Events.POINTER_DOWN, this._onDown, this);
        this.on(Phaser.Input.Events.POINTER_UP, this._onUp, this);

        scene.add.existing(this);
    }

    /**
     * 定期処理
     */
    updatePanel(): void {
        this.lastTouched = this.isTouched;
        this.isTouched = false;
    }

    /**
     * オブジェクトがタッチされたかどうかを取得する。
     * @returns タッチされていた場合はtrueを、そうでない場合はfalseを返す。
     */
    isTouch(): boolean {
        return this.lastTouched;
    }

    /**
     * タッチ入力を許可するかどうかを設定する
     * @param on_off タッチ入力を許可するかどうか
     */
    setTouchAllow(on_off: boolean): void {
        this.touchAllowed = on_off;
    }

    /**
     * ポインターがオブジェクトから離れたときのコールバック。
     */
    private _onOut(): void {
        if (this.clicked) {
            this.setPosition(this.prevX, this.prevY);
        }
        this.clicked = false;
    }

    /**
     * マウスボタンが押されたときのコールバック
     */
    private _onDown(): void {
        if (!this.touchAllowed) {
            return;
        }
        if (!this.clicked) {
            this.clicked = true;
            this.prevX = this.x;
            this.prevY = this.y;
            this.setPosition(this.prevX + 5, this.prevY + 5);
        }
    }

    /**
     * マウスボタンが離されたときのコールバック
     */
    private _onUp(): void {
        if (this.clicked) {
            this.setPosition(this.prevX, this.prevY);
            this.isTouched = true;
        }
        this.clicked = false;
    }
}