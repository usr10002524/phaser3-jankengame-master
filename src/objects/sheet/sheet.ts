import { LoginBonusData } from "../../bonus/login-bonus-data";
import { Assets, Consts } from "../../consts";
import { Utility } from "../../service/utility";

export class Sheet {

    private scene: Phaser.Scene;
    private data: LoginBonusData;

    private container: Phaser.GameObjects.Container;
    private sheet: Phaser.GameObjects.Image;
    private items: Phaser.GameObjects.Image[];
    private stamps: Phaser.GameObjects.Image[];
    private cursor: Phaser.GameObjects.Image | null;
    private text: Phaser.GameObjects.Text;
    private notice: Phaser.GameObjects.Text;

    private tween: Phaser.Tweens.Tween | null;
    private isAnimeEnd: boolean;

    constructor(scene: Phaser.Scene, data: LoginBonusData) {
        this.scene = scene;
        this.data = data;

        //container
        {
            const x = scene.game.canvas.width * 0.5;
            const y = scene.game.canvas.height * 0.5;
            this.container = scene.add.container(x, y);
            this.container.setDepth(Consts.Sheet.Sheet.DEPTH);
            this.container.setVisible(false);   //非表示にしておく
        }
        //sheet
        {
            const x = Consts.Sheet.Sheet.Position.x;
            const y = Consts.Sheet.Sheet.Position.y;
            const key = Assets.Graphic.Sheets.KEY;
            const frame = Assets.Graphic.Sheets.Frames.SHEET;
            this.sheet = scene.add.image(x, y, key, frame);
            this.sheet.setDepth(Consts.Sheet.Sheet.DEPTH);
            this.container.add(this.sheet);
        }
        //items
        this.items = [];
        for (let i = 0; i < this.data.getBonusCount(); i++) {
            const bonus = this.data.getBonus(i);

            const pos = this._getCellPos(i);
            const key = Assets.Graphic.Sheets.KEY;
            let frame = '';
            switch (bonus) {
                case 100: frame = Assets.Graphic.Sheets.Frames.ICON_100PT; break;
                case 200: frame = Assets.Graphic.Sheets.Frames.ICON_200PT; break;
            }
            this.items[i] = scene.add.image(pos.x, pos.y, key, frame);
            this.items[i].setDepth(Consts.Sheet.Cells.Icon.DEPTH);
        }
        this.container.add(this.items);

        {
            const x = Consts.Sheet.Notice1.Position.x;
            const y = Consts.Sheet.Notice1.Position.y;
            const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
                font: "32px Arial",
                color: "#000000"
            }
            this.text = scene.add.text(x, y, '今日のお小遣いはこちらです', textStyle);
            this.text.setOrigin(Consts.Sheet.Notice1.Oirgin.x, Consts.Sheet.Notice1.Oirgin.y);
            this.text.setDepth(Consts.Sheet.Notice1.DEPTH);

            this.container.add(this.text);
        }
        {
            const x = Consts.Sheet.Notice2.Position.x;
            const y = Consts.Sheet.Notice2.Position.y;

            const expire = LoginBonusData.getExpire();
            const date = new Date(expire);
            const M = Utility.zeroPadding(date.getMonth() + 1, 2);
            const D = Utility.zeroPadding(date.getDate(), 2);
            const h = Utility.zeroPadding(date.getHours(), 2);
            const m = Utility.zeroPadding(date.getMinutes(), 2);

            const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
                font: "16px Arial",
                color: "#FF0000"
            }
            this.notice = scene.add.text(x, y, `※所持お小遣いは ${M}/${D} ${h}:${m} まで有効です`, textStyle);
            this.notice.setOrigin(Consts.Sheet.Notice2.Oirgin.x, Consts.Sheet.Notice2.Oirgin.y);
            this.notice.setDepth(Consts.Sheet.Notice2.DEPTH);

            this.container.add(this.notice);
        }

        this.container.sort('depth');

        this.stamps = [];
        this.cursor = null;

        this.tween = null;
        this.isAnimeEnd = false;
    }

    setupStart(): void {
        //前回までのスタンプを表示
        this._eraseStamps();

        const cur = this.data.getCurrentBonus();
        for (let i = 0; i < cur.index; i++) {
            const pos = this._getCellPos(i);
            const key = Assets.Graphic.Sheets.KEY;
            let frame = Assets.Graphic.Sheets.Frames.STAMP;

            this.stamps[i] = this.scene.add.image(pos.x, pos.y, key, frame);
            this.stamps[i].setDepth(Consts.Sheet.Cells.Stamp.DEPTH);
        }
        this.container.add(this.stamps);
        this.container.sort('depth');
    }

    setupStamp(): void {
        //今回のスタンプを表示

        const cur = this.data.getCurrentBonus();
        const i = cur.index;
        {
            const pos = this._getCellPos(i);
            const key = Assets.Graphic.Sheets.KEY;
            let frame = Assets.Graphic.Sheets.Frames.STAMP;

            this.stamps[i] = this.scene.add.image(pos.x, pos.y, key, frame);
            this.stamps[i].setDepth(Consts.Sheet.Cells.Stamp.DEPTH);
            this.stamps[i].setVisible(false);
            this.container.add(this.stamps[i]);
        }
        this.container.sort('depth');
    }

    startSheetIn(): void {
        if (this.tween != null) {
            this.tween.remove();
        }

        const start_x = this.container.x + this.scene.game.canvas.width;
        const start_y = this.container.y;
        const end_x = this.container.x;
        this.isAnimeEnd = false;

        this.tween = this.scene.tweens.add({
            targets: this.container,
            duration: 500,
            ease: 'Quint.easeOut',
            props: {
                x: { from: start_x, to: end_x },
            },
            onStart: () => {
                this.container.setPosition(start_x, start_y);
                this.container.setVisible(true);
                this.scene.sound.play(Assets.Audio.SE.PAGE);
            },
            onComplete: () => {
                this.isAnimeEnd = true;
            },
        });
    }

    startStamp(): void {
        if (this.tween != null) {
            this.tween.remove();
        }

        const cur = this.data.getCurrentBonus();
        this.isAnimeEnd = false;

        this.tween = this.scene.tweens.add({
            targets: this.stamps[cur.index],
            delay: 1000,
            duration: 500,
            ease: 'Back.easeIn',
            props: {
                scale: { from: 1.5, to: 1 },
                alpha: { from: 0.5, to: 1 },
            },
            onStart: () => {
                this.stamps[cur.index].setScale(1.5);
                this.stamps[cur.index].setAlpha(0.5);
                this.stamps[cur.index].setVisible(true);

                this.scene.sound.play(Assets.Audio.SE.STAMP, { delay: 0.45 });
            },
            onComplete: () => {
                this.isAnimeEnd = true;
            },
            completeDelay: 1000,
        })
    }

    startSheetChange(): void {
        if (this.tween != null) {
            this.tween.remove();
        }

        this.isAnimeEnd = false;

        this.tween = this.scene.tweens.add({
            targets: this.container,
            duration: 250,
            ease: 'Quint.easeIn',
            props: {
                x: { from: this.container.x, to: -this.scene.game.canvas.width },
            },
            onStart: () => {
                // this.scene.sound.play(Assets.Audio.SE.PAGE);
            },
            onComplete: () => {
                this._eraseStamps();
                const pos_x = this.scene.game.canvas.width * 0.5;
                const start_x = pos_x + this.scene.game.canvas.width;
                const end_x = pos_x;

                this.tween = this.scene.tweens.add({
                    targets: this.container,
                    duration: 250,
                    ease: 'Quint.easeOut',
                    props: {
                        x: { from: start_x, to: end_x },
                    },
                    onStart: () => {
                        // this.scene.sound.play(Assets.Audio.SE.PAGE, { delay: 0.2 });
                    },
                    onComplete: () => {
                        this.isAnimeEnd = true;
                    },
                });
            }
        });
    }

    startNextBonus(): void {
        if (this.tween != null) {
            this.tween.remove();
        }

        const cur = this.data.getCurrentBonus();
        const position = this._getCellPos(cur.index);
        const key = Assets.Graphic.Sheets.KEY;
        const frame = Assets.Graphic.Sheets.Frames.CURSOR;
        this.cursor = this.scene.add.image(position.x, position.y, key, frame);
        this.cursor.setVisible(false);
        this.cursor.setBlendMode(Phaser.BlendModes.ADD);
        this.cursor.setDepth(Consts.Sheet.Cells.Cursor.DEPTH);

        this.container.add(this.cursor);
        this.container.sort('depth');

        this.text.setText('次回のお小遣いはこちらです。')

        this.isAnimeEnd = false;

        this.tween = this.scene.tweens.add({
            targets: this.cursor,
            duration: 250,
            ease: 'Sine.easeInOut',
            loop: 4,
            yoyo: true,
            props: {
                alpha: { from: 1, to: 0 },
            },
            onStart: () => {
                this.cursor?.setAlpha(0.0);
                this.cursor?.setVisible(true);
            },
            onComplete: () => {
                // this.cursor?.setVisible(false);
                this.isAnimeEnd = true;
            }
        })
    }


    startSheetOut(): void {
        if (this.tween != null) {
            this.tween.remove();
        }

        const start_x = this.container.x;
        const start_y = this.container.y;
        const end_x = this.container.x - this.scene.game.canvas.width;
        this.isAnimeEnd = false;

        this.tween = this.scene.tweens.add({
            targets: this.container,
            delay: 1000,
            duration: 500,
            ease: 'Quint.easeIn',
            props: {
                x: { from: start_x, to: end_x },
            },
            onStart: () => {
                this.container.setPosition(start_x, start_y);
                this.scene.sound.play(Assets.Audio.SE.PAGE, { delay: 0.2 });
            },
            onComplete: () => {
                this.isAnimeEnd = true;
            },
        });
    }

    isEnd(): boolean {
        return this.isAnimeEnd;
    }

    private _eraseStamps(): void {
        this.container.remove(this.stamps);
        for (let i = 0; i < this.stamps.length; i++) {
            this.stamps[i].destroy();
        }
        this.stamps = [];
    }

    private _getCellPos(index: number): { x: number, y: number } {
        if (index < 0 || index >= Consts.Sheet.Cells.Position.length) {
            return { x: 0, y: 0 };
        }
        return Consts.Sheet.Cells.Position[index];
    }
}