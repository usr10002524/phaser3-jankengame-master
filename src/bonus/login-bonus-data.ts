import { Consts } from "../consts";
import { DateTime } from "../service/datetime";
import { Log } from "../service/logwithstamp";

/**
 * ログインボーナスデータ
 */
export class LoginBonusData {
    private version: string;    // データバージョン
    private bonus: number[];    // ボーナス配列
    private current: number;    // 現在のインデックスr
    private lastReceipt: number;    // 最後にボーナスを受け取った時間
    private nextStart: number;  // 次回ボーナス受領可能開始日時
    private nextEnd: number;    // 次回ボーナス受領可能終了日時

    /**
     * ボーナス受領可能終了日時を取得する
     * @returns ボーナス受領可能終了日時
     */
    static getExpire(): number {
        const date = new Date();
        const now = date.getTime();
        let expire = DateTime.dateTrunc(now, -Consts.Bonus.DAY_OFFSET);
        expire += (24 * 60 * 60 * 1000);
        expire += (Consts.Bonus.DAY_OFFSET);
        return expire;
    }

    /**
     * コンストラクタ
     */
    constructor() {
        this.version = '';
        this.bonus = [];
        this.current = 0;
        this.lastReceipt = 0;
        this.nextStart = 0;
        this.nextEnd = 0;
    }

    /**
     * データをjson化する
     * @returns json化したログボデータ
     */
    toJson(): string {
        return JSON.stringify(this);
    }

    /**
     * jsonデータからログボデータを復元する
     * @param json json化したログボデータ
     */
    restore(json: string) {
        try {
            const obj = JSON.parse(json) as LoginBonusData;
            this.version = obj.version;
            for (let i = 0; i < obj.bonus.length; i++) {
                this.bonus[i] = obj.bonus[i];
            }
            this.current = obj.current;
            this.lastReceipt = obj.lastReceipt;
            this.nextStart = obj.nextStart;
            this.nextEnd = obj.nextEnd;
            // Log.put('restore OK.', 'LoginBonusData');
        }
        catch (e) {
            Log.put('restore FAIL.', 'LoginBonusData');
            this.reset();
        }
    }

    /**
     * データの整合性チェック
     * @returns データの整合性がある場合は true 、そうでない場合は false を返す
     */
    isValid(): boolean {
        if (this.version !== Consts.Bonus.VERSION) {
            return false;
        }
        if (this.bonus.length !== Consts.Bonus.DEAILY.length) {
            return false;
        }
        for (let i = 0; i < Consts.Bonus.DEAILY.length; i++) {
            if (this.bonus[i] !== Consts.Bonus.DEAILY[i]) {
                return false;
            }
        }
        if (this.current < 0 || this.current >= Consts.Bonus.DEAILY.length) {
            return false;
        }

        return true;
    }

    /**
     * ログボを受領できるかチェックする
     * @returns ログボデータを受領できる場合は true 、そうでない場合は false を返す。
     */
    isReceitable(): boolean {
        const date = new Date();
        const now = date.getTime();
        if (DateTime.isSameDate(this.lastReceipt, now, -Consts.Bonus.DAY_OFFSET)) {
            return false;   //受領済み
        }
        return true;
    }

    /**
     * 連日プレーしているかチェックする
     * @returns 連日プレーしている場合は true 、そうでない場合は false を返す。
     */
    isSeries(): boolean {
        const date = new Date();
        const now = date.getTime();

        if (now < this.nextStart || this.nextEnd <= now) {
            return false;
        }
        return true;
    }

    /**
     * 日付が変わったかチェックする
     * @returns 日付が変わった場合は true、そうでない場合は false を返す。
     */
    isDateChanged(): boolean {
        const date = new Date();
        const now = date.getTime();

        if (now < this.nextStart) {
            return false;
        }
        return true;
    }

    /**
     * ボーナスデータの数を取得する
     * @returns ボーナスデータの数
     */
    getBonusCount(): number {
        return this.bonus.length;
    }

    /**
     * ボーナスデータ配列から指定されたインデックスのボーナスを取得する。
     * @param index ボーナスデータのインデックス。
     * @returns ボーナス
     */
    getBonus(index: number): number {
        if (index < 0 || index >= this.bonus.length) {
            return 0;
        }
        else {
            return this.bonus[index];
        }
    }

    /**
     * 今回受領するボーナスを取得する
     * @returns index   受領したボーナスのインデックスr
     * @returns bonus   受領したボーナス
     */
    getCurrentBonus(): { index: number, bonus: number } {
        return { index: this.current, bonus: this.bonus[this.current] };
    }

    /**
     * ボーナスデータをリセットする
     */
    reset(): void {
        this.version = Consts.Bonus.VERSION;
        this.bonus = Consts.Bonus.DEAILY;
        this.current = 0;
        this.lastReceipt = 0;
        this.nextStart = 0;
        this.nextEnd = 0;
    }

    /**
     * 次回ボーナスようにデータを更新する
     */
    next(): void {
        this.version = Consts.Bonus.VERSION;
        this.bonus = Consts.Bonus.DEAILY;
        this.lastReceipt = DateTime.getTime();

        this.current++;
        this.current %= Consts.Bonus.DEAILY.length;

        let stamp = DateTime.getTime();
        stamp = DateTime.dateTrunc(stamp, -Consts.Bonus.DAY_OFFSET);
        this.nextStart = stamp + (24 * 60 * 60 * 1000) + Consts.Bonus.DAY_OFFSET;
        this.nextEnd = this.nextStart + (24 * 60 * 60 * 1000);
    }
}

