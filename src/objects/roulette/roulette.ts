import { Assets, Consts } from "../../consts";
import { RouletteConst } from "./roulette-const";

/**
 * ルーレット表示クラス
 */
export class Roulette {
    private scene: Phaser.Scene;

    private roulette: Phaser.GameObjects.Image;
    private panelbg: Phaser.GameObjects.Image;
    private cells: Phaser.GameObjects.Image[];
    private numbers: Phaser.GameObjects.Image[];
    private cellEffs: Phaser.GameObjects.Image[];
    private numberEffs: Phaser.GameObjects.Image[];
    private lamps: Phaser.GameObjects.Image[];
    private lampEffs: Phaser.GameObjects.Image[];

    private baseContainer: Phaser.GameObjects.Container;
    private cellContainer: Phaser.GameObjects.Container;
    private effContainer: Phaser.GameObjects.Container;
    private lampContainer: Phaser.GameObjects.Container;
    private lampEffContainer: Phaser.GameObjects.Container[];

    /**
     * コンストラクタ
     * @param scene シーン
     */
    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        const x = this.scene.game.canvas.width * 0.5;
        const y = this.scene.game.canvas.height * 0.5;

        //container
        {
            this.baseContainer = this.scene.add.container(x, y);
            this.baseContainer.setName('base');
            this.baseContainer.setDepth(Consts.Roulette.DEPTH);

            this.cellContainer = this.scene.add.container(x, y);
            this.cellContainer.setName('cells');
            this.cellContainer.setDepth(Consts.Cells.DEPTH);

            this.effContainer = this.scene.add.container(x, y);
            this.effContainer.setName('effs');
            this.effContainer.setDepth(Consts.CellEffs.DEPTH);

            this.lampContainer = this.scene.add.container(x, y);
            this.lampContainer.setName('lamps');
            this.lampContainer.setDepth(Consts.Lamps.DEPTH);

            this.lampEffContainer = [];
            for (let i = 0; i < Consts.Lamps.Type.MAX; i++) {
                const container = this.scene.add.container(x, y);
                //ランプエフェクトはコンテナ単位で表示/非表示を制御する
                container.setVisible(false);
                container.setDepth(Consts.LampEffes.DEPTH);
                this.lampEffContainer.push(container);
            }
            this.lampEffContainer[Consts.Lamps.Type.COMMON].setName('lamp-common');
            this.lampEffContainer[Consts.Lamps.Type.OPEN1].setName('lamp-open1');
            this.lampEffContainer[Consts.Lamps.Type.OPEN2].setName('lamp-open2');
            this.lampEffContainer[Consts.Lamps.Type.CLOSE1].setName('lamp-close1');
            this.lampEffContainer[Consts.Lamps.Type.CLOSE2].setName('lamp-close2');
        }

        //roulette
        {
            this.roulette = this.scene.add.image(0, 0, Assets.Graphic.Roulette.KEY, Assets.Graphic.Roulette.Frames.ROULETTE);
            this.roulette.setDepth(Consts.Roulette.DEPTH);
            this.baseContainer.add(this.roulette);
        }

        //cells
        {
            this.cells = [];
            this.cellEffs = [];
            for (let i = 0; i < RouletteConst.cellProp.length; i++) {
                const prop = RouletteConst.cellProp[i];

                //cell
                const cell = this.scene.add.image(prop.x, prop.y, Assets.Graphic.Roulette.KEY, prop.frame);
                cell.setRotation(Phaser.Math.DegToRad(prop.r));
                cell.setDepth(Consts.Cells.DEPTH);
                this.cells.push(cell);

                // cellEff
                const cellEff = this.scene.add.image(prop.x, prop.y, Assets.Graphic.Roulette.KEY, prop.effFrame);
                cellEff.setRotation(Phaser.Math.DegToRad(prop.r));
                cellEff.setBlendMode(Phaser.BlendModes.ADD);
                cellEff.setDepth(Consts.CellEffs.DEPTH);
                cellEff.setVisible(false);
                this.cellEffs.push(cellEff);
            }
            this.cellContainer.add(this.cells);
            this.effContainer.add(this.cellEffs);
        }

        //numbers
        {
            this.numbers = [];
            this.numberEffs = [];
            for (let i = 0; i < RouletteConst.noProp.length; i++) {
                const prop = RouletteConst.noProp[i];

                //number
                const number = this.scene.add.image(prop.x, prop.y, Assets.Graphic.Roulette.KEY, prop.frame);
                number.setRotation(Phaser.Math.DegToRad(prop.r));
                number.setDepth(Consts.Numbers.DEPTH);
                this.numbers.push(number);

                // numberEff
                const numberEff = this.scene.add.image(prop.x, prop.y, Assets.Graphic.Roulette.KEY, prop.effFrame);
                numberEff.setRotation(Phaser.Math.DegToRad(prop.r));
                numberEff.setBlendMode(Phaser.BlendModes.ADD);
                numberEff.setDepth(Consts.NumberEffs.DEPTH);
                numberEff.setVisible(false);
                this.numberEffs.push(numberEff);
            }
            this.cellContainer.add(this.numbers);
            this.effContainer.add(this.numberEffs);
        }

        //lamps
        {
            this.lamps = [];
            this.lampEffs = [];
            for (let i = 0; i < RouletteConst.lampProp.length; i++) {
                const prop = RouletteConst.lampProp[i];

                const lamp = this.scene.add.image(prop.x, prop.y, Assets.Graphic.Roulette.KEY, prop.frame);
                lamp.setDepth(Consts.Lamps.DEPTH);
                this.lamps.push(lamp);

                const lampEff = this.scene.add.image(prop.x, prop.y, Assets.Graphic.Roulette.KEY, prop.effFrame);
                lampEff.setDepth(Consts.LampEffes.DEPTH);
                lampEff.setBlendMode(Phaser.BlendModes.ADD);
                // lampEff.setVisible(false);   //コンテナ側で表示、非表示を制御する
                this.lampEffs.push(lampEff);

                this.lampContainer.add(lamp);
                this.lampEffContainer[prop.type].add(lampEff);
            }

            //panelbg
            {
                this.panelbg = this.scene.add.image(0, 0, Assets.Graphic.Roulette.KEY, Assets.Graphic.Roulette.Frames.PANELBG,);
                this.panelbg.setDepth(Consts.LampBG.DEPTH);
                this.lampContainer.add(this.panelbg);
            }
        }

        //depth sort in container
        {
            this.baseContainer.sort('depth');
            this.cellContainer.sort('depth');
            this.effContainer.sort('depth');
            this.lampContainer.sort('depth');
            for (let i = 0; i < this.lampEffContainer.length; i++) {
                this.lampEffContainer[i].sort('depth');
            }

        }
    }

    /**
     * 指定したマスを点灯させる
     * @param position 点灯するマスの場所(Consts.Cells.Position)
     * @returns void
     */
    cellOn(position: number): void {
        if (position < 0
            || position >= this.cellEffs.length
            || position >= this.numberEffs.length) {
            return;
        }

        this.cellEffs[position].setVisible(true);
        this.numberEffs[position].setVisible(true);
    }

    /**
     * 指定したマスを消灯する
     * @param position 消灯するマスの場所(Consts.Cells.Position)
     * @returns void
     */
    cellOff(position: number): void {
        if (position < 0
            || position >= this.cellEffs.length
            || position >= this.numberEffs.length) {
            return;
        }

        this.cellEffs[position].setVisible(false);
        this.numberEffs[position].setVisible(false);
    }

    /**
     * すべてのマスを消灯する
     */
    cellAllOff(): void {
        for (let i = 0; i < this.cellEffs.length; i++) {
            this.cellEffs[i].setVisible(false);
        }
        for (let i = 0; i < this.numberEffs.length; i++) {
            this.numberEffs[i].setVisible(false);
        }
    }

    /**
     * 指定したじゃんけんの手を消灯、または点灯する。
     * @param suit 点灯/消灯するじゃんけんの手
     * @param on_off 点灯 or 消灯
     */
    lampSet(suit: number, on_off: boolean): void {
        this.lampAllOff();

        switch (suit) {
            case Consts.Janken.Suit.GU: {
                this.lampEffContainer[Consts.Lamps.Type.COMMON].setVisible(on_off);
                this.lampEffContainer[Consts.Lamps.Type.CLOSE1].setVisible(on_off);
                this.lampEffContainer[Consts.Lamps.Type.CLOSE2].setVisible(on_off);
                break;
            }

            case Consts.Janken.Suit.CHOKI: {
                this.lampEffContainer[Consts.Lamps.Type.COMMON].setVisible(on_off);
                this.lampEffContainer[Consts.Lamps.Type.CLOSE1].setVisible(on_off);
                this.lampEffContainer[Consts.Lamps.Type.OPEN2].setVisible(on_off);
                break;
            }

            case Consts.Janken.Suit.PA: {
                this.lampEffContainer[Consts.Lamps.Type.COMMON].setVisible(on_off);
                this.lampEffContainer[Consts.Lamps.Type.OPEN1].setVisible(on_off);
                this.lampEffContainer[Consts.Lamps.Type.OPEN2].setVisible(on_off);
                break;
            }
        }
    }

    /**
     * すべてのランプを消灯する
     */
    lampAllOff(): void {
        for (let i = 0; i < this.lampEffContainer.length; i++) {
            this.lampEffContainer[i].setVisible(false);
        }
    }


}