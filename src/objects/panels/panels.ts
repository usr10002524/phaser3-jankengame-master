import { Assets, Consts } from "../../consts";
import { Log } from "../../service/logwithstamp";
import { PanelImage } from "./panelImage";
import { PanelsConst } from "./panels-const";

/**
 * パネルクラス
 */
export class Panels {

    private scene: Phaser.Scene;
    private panels: PanelImage[];
    private panelContainer: Phaser.GameObjects.Container;

    /**
     * コンストラクタ
     * @param scene シーン
     */
    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        //container
        {
            const x = this.scene.game.canvas.width * 0.5;
            const y = this.scene.game.canvas.height * 0.75;
            this.panelContainer = this.scene.add.container(x, y);
            this.panelContainer.setName('panel');
            this.panelContainer.setDepth(Consts.Panels.DEPTH);
        }

        //panels
        {
            this.panels = [];

            for (let i = 0; i < PanelsConst.panelProp.length; i++) {
                const prop = PanelsConst.panelProp[i];
                const panel = new PanelImage(this.scene, prop.x, prop.y, Assets.Graphic.Panels.KEY, prop.frame);
                panel.setDepth(Consts.Panels.DEPTH);
                panel.setVisible(false);
                this.panels.push(panel);
            }
            this.panelContainer.add(this.panels);
        }
    }

    /**
     * 定期処理
     */
    update(): void {
        this.panels.forEach(panel => {
            panel.updatePanel();
        });
    }

    /**
     * 指定したパネルがタッチされたかどうかを取得する。
     * @param type パネルの種類(Consts.Panels.Type)
     * @returns パネルがタッチされたかどうか。
     * されていた場合はtrue、そうでない場合はfalseを返す。
     */
    isTouch(type: number): boolean {
        if (type < 0 || type >= this.panels.length) {
            return false;
        }

        return this.panels[type].isTouch();
    }

    /**
     * じゃんけん開始時の状態を表示する
     */
    setStart(): void {
        //じゃんけんの手パネルは非表示
        this._setVisible(Consts.Panels.Type.GU, false);
        this._setVisible(Consts.Panels.Type.CHOKI, false);
        this._setVisible(Consts.Panels.Type.PA, false);
        this._setTouchAllow(Consts.Panels.Type.GU, false);
        this._setTouchAllow(Consts.Panels.Type.CHOKI, false);
        this._setTouchAllow(Consts.Panels.Type.PA, false);

        //スタートパネルを表示状態にして、所定に位置に配置
        this._setVisible(Consts.Panels.Type.START, true);
        this._setTouchAllow(Consts.Panels.Type.START, true);
        this._resetPosition(Consts.Panels.Type.START);
    }

    /**
     * じゃんけんの手選択時の状態を表示する
     */
    setSelectSuit(): void {
        //スタートパネルは非表示
        this._setVisible(Consts.Panels.Type.START, false);
        this._setTouchAllow(Consts.Panels.Type.START, false);

        //じゃんけんの手パネルを表示状態にして、所定に位置に配置
        const suits = [Consts.Panels.Type.GU, Consts.Panels.Type.CHOKI, Consts.Panels.Type.PA];
        for (let i = 0; i < suits.length; i++) {
            this._setVisible(suits[i], true);
            this._setTouchAllow(suits[i], true);
            this._resetPosition(suits[i]);
        }
    }

    /**
     * じゃんけん決定時の状態を表示する
     */
    setDecide(suit: number): void {
        //一旦全部を非表示
        this._setVisible(Consts.Panels.Type.START, false);
        this._setVisible(Consts.Panels.Type.GU, false);
        this._setVisible(Consts.Panels.Type.CHOKI, false);
        this._setVisible(Consts.Panels.Type.PA, false);
        this._setTouchAllow(Consts.Panels.Type.START, false);
        this._setTouchAllow(Consts.Panels.Type.GU, false);
        this._setTouchAllow(Consts.Panels.Type.CHOKI, false);
        this._setTouchAllow(Consts.Panels.Type.PA, false);


        //選択した手のみ表示(タッチは不可のまま)
        const type = this._suitToPanel(suit);
        this._setVisible(type, true);
    }

    /**
     * タッチを無効にする
     */
    disableTouch(): void {
        this._setTouchAllow(Consts.Panels.Type.START, false);
        this._setTouchAllow(Consts.Panels.Type.GU, false);
        this._setTouchAllow(Consts.Panels.Type.CHOKI, false);
        this._setTouchAllow(Consts.Panels.Type.PA, false);
    }

    /**
     * 指定したパネルのオブジェクトを取得する。
     * @param type パネルの種類(Consts.Panels.Type)
     * @returns パネルのオブジェクト
     */
    getImage(type: number): PanelImage | null {
        if (type < 0 || type >= this.panels.length) {
            return null;
        }
        else {
            return this.panels[type];
        }
    }

    /**
     * 指定したパネルのオブジェクトを取得する。
     * @param suit じゃんけんの手(Consts.Janken.Suit)
     * @returns パネルのオブジェクト
     */
    getImageBySuit(suit: number): PanelImage | null {
        const type = this._suitToPanel(suit);

        if (type < 0 || type >= this.panels.length) {
            return null;
        }
        else {
            return this.panels[type];
        }
    }


    /**
     * 指定したパネルを初期位置に配置する。
     * @param type パネルの種類(Consts.Panels.Type)
     * @returns void
     */
    private _resetPosition(type: number): void {
        if (type < 0
            || type >= this.panels.length
            || type >= PanelsConst.panelProp.length) {
            return;
        }

        const prop = PanelsConst.panelProp[type];
        this.panels[type].setPosition(prop.x, prop.y);
    }

    /**
     * 指定したパネルの表示状態を設定する。
     * @param type パネルの種類(Consts.Panels.Type)
     * @param on_off tureの場合はパネルを表示状態に、falseの場合はパネルを非表示状態にする。
     * @returns void
     */
    private _setVisible(type: number, on_off: boolean): void {
        if (type < 0
            || type >= this.panels.length
            || type >= PanelsConst.panelProp.length) {
            return;
        }

        this.panels[type].setVisible(on_off);
        this.panels[type].setAlpha(1);
    }

    /**
     * 指定したパネルのタッチ受付状態を向こうにするする。
     * @param type パネルの種類(Consts.Panels.Type)
     * @param on_off タッチを受け付けるかどうか。trueの場合は受け付ける、そうでない場合は受け付けない。
     * @returns void
     */
    private _setTouchAllow(type: number, on_off: boolean): void {
        if (type < 0
            || type >= this.panels.length
            || type >= PanelsConst.panelProp.length) {
            return;
        }

        this.panels[type].setTouchAllow(on_off);
    }

    /**
     * じゃんけんの手から対応するパネルの種類を取得する。
     * @param suit じゃんけんの手(Consts.Janken.Suit)
     * @returns 対応するパネルの種類(Consts.Panels.Type)を返す。
     */
    private _suitToPanel(suit: number): number {
        switch (suit) {
            case Consts.Janken.Suit.GU: return Consts.Panels.Type.GU;
            case Consts.Janken.Suit.CHOKI: return Consts.Panels.Type.CHOKI;
            case Consts.Janken.Suit.PA: return Consts.Panels.Type.PA;
            default: return -1;
        }
    }
}