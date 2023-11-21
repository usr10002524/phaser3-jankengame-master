import { Assets, Consts } from "../../consts";

/**
 * タイトル背景
 */
export class BgTile {

    private scene: Phaser.Scene;
    private container: Phaser.GameObjects.Container;
    private tiles: Phaser.GameObjects.Rectangle[];
    private icons: Phaser.GameObjects.Image[];
    private shade: Phaser.GameObjects.Rectangle;
    private startIndex: number[];
    private tween: Phaser.Tweens.Tween | null;

    static COLS: number = 16;
    static ROWS: number = 12;
    static ICONS = [
        Assets.Graphic.Icons.Frames.GU,
        Assets.Graphic.Icons.Frames.CHOKI,
        Assets.Graphic.Icons.Frames.PA,
        Assets.Graphic.Icons.Frames.COIN,
    ];
    static COLORS = [0xf6991c, 0xeeece9];

    /**
     * コンストラクタ
     * @param scene シーン
     */
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.container = scene.add.container(scene.game.canvas.width * 0.5, scene.game.canvas.height * 0.5);
        this.container.setDepth(Consts.BG.DEPTH);

        //全体のシェード
        {
            const x = this.scene.game.canvas.width * 0.5;
            const y = this.scene.game.canvas.height * 0.5;
            const width = this.scene.game.canvas.width;
            const height = this.scene.game.canvas.height;
            const color = 0x000000;
            const alpha = 0.75;
            this.shade = this.scene.add.rectangle(x, y, width, height, color, alpha);
            this.shade.setOrigin(0.5, 0.5);
            this.shade.setDepth(Consts.BG.DEPTH + 1);
        }

        this.tiles = [];
        this.icons = [];
        this.startIndex = [];
        this.tween = null;

        this._setupTile();
    }

    // タイトル背景の作成
    private _setupTile(): void {
        //
        {
            this._initIndex();
            this._initDrawBG();
        }


        this.container.add(this.tiles);
        this.container.add(this.icons);
        this.container.sort('depth');

        this._scrollUpdate();
    }

    // 背景のスクロール処理
    private _scrollUpdate(): void {
        if (this.tween != null) {
            this.tween.remove();
        }

        this._updateIndex();
        this._updateDrawBG();

        this.tween = this.scene.add.tween({
            targets: this.container,
            duration: 2000,
            props: {
                x: { value: '+=64' },
                y: { value: '+=64' },
            },
            onComplete: () => {
                this._scrollUpdate();
            },
        });
    }

    // インデックスの初期化
    private _initIndex(): void {
        this.startIndex = [];

        for (let i = 0; i < BgTile.ROWS; i++) {
            this.startIndex.push(i);
        }
    }

    // インデックスに応じて背景をタイリング表示する
    private _initDrawBG(): void {
        const orig_x = -480;
        const orig_y = -352;
        const width = 64;
        const height = 64;
        const anchor_x = 0.5;
        const anchor_y = 0.5;

        for (let r = 0; r < BgTile.ROWS; r++) {
            const color_offs = r % 2;
            const icon_offs = this.startIndex[r];
            for (let c = 0; c < BgTile.COLS; c++) {
                const x = orig_x + c * width;
                const y = orig_y + r * height;
                const color_index = (color_offs + c) % BgTile.COLORS.length;
                const color = BgTile.COLORS[color_index];

                const rect = this.scene.add.rectangle(x, y, width, height, color);
                rect.setOrigin(anchor_x, anchor_y);
                rect.setDepth(Consts.BG.DEPTH);
                this.tiles.push(rect);

                const key = Assets.Graphic.Icons.KEY;
                const icon_index = (icon_offs + c) % BgTile.ICONS.length;
                const icon = this.scene.add.image(x, y, key, BgTile.ICONS[icon_index])
                icon.setOrigin(anchor_x, anchor_y);
                icon.setDepth(Consts.BG.DEPTH + 1);
                this.icons.push(icon);
            }
        }
    }

    // インデックスを更新する
    private _updateIndex(): void {
        for (let i = 0; i < this.startIndex.length; i++) {
            let index = this.startIndex[i];
            index += 2; //横に+1、縦に+1
            index %= BgTile.ROWS;
            this.startIndex[i] = index;
        }

    }

    // 背景表示の更新
    private _updateDrawBG(): void {
        let index = 0;

        for (let r = 0; r < BgTile.ROWS; r++) {
            const color_offs = r % 2;
            const icon_offs = this.startIndex[r];
            for (let c = 0; c < BgTile.COLS; c++) {
                //表示内容をずらす
                const rect = this.tiles[index];
                const color_index = (color_offs + c) % BgTile.COLORS.length;
                const color = BgTile.COLORS[color_index];
                rect.setFillStyle(color);

                const icon_index = (icon_offs + c) % BgTile.ICONS.length;
                const icon = this.icons[index];
                icon.setFrame(BgTile.ICONS[icon_index]);

                index++;
            }
        }

        //コンテナの位置をリセット
        this.container.setPosition(this.scene.game.canvas.width * 0.5, this.scene.game.canvas.height * 0.5);
    }

}