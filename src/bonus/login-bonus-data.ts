import { Consts } from "../consts";
import { DateTime } from "../service/datetime";
import { Log } from "../service/logwithstamp";


export class LoginBonusData {
    private version: string;
    private bonus: number[];
    private current: number;
    private lastReceipt: number;
    private nextStart: number;
    private nextEnd: number;

    static getExpire(): number {
        const date = new Date();
        const now = date.getTime();
        let expire = DateTime.dateTrunc(now, -Consts.Bonus.DAY_OFFSET);
        expire += (24 * 60 * 60 * 1000);
        expire += (Consts.Bonus.DAY_OFFSET);
        return expire;
    }

    constructor() {
        this.version = '';
        this.bonus = [];
        this.current = 0;
        this.lastReceipt = 0;
        this.nextStart = 0;
        this.nextEnd = 0;
    }

    toJson(): string {
        return JSON.stringify(this);
    }

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

    isReceitable(): boolean {
        const date = new Date();
        const now = date.getTime();
        if (DateTime.isSameDate(this.lastReceipt, now, -Consts.Bonus.DAY_OFFSET)) {
            return false;   //受領済み
        }
        return true;
    }

    isSeries(): boolean {
        const date = new Date();
        const now = date.getTime();

        if (now < this.nextStart || this.nextEnd <= now) {
            return false;
        }
        return true;
    }

    isDateChanged(): boolean {
        const date = new Date();
        const now = date.getTime();

        if (now < this.nextStart) {
            return false;
        }
        return true;
    }

    getBonusCount(): number {
        return this.bonus.length;
    }

    getBonus(index: number): number {
        if (index < 0 || index >= this.bonus.length) {
            return 0;
        }
        else {
            return this.bonus[index];
        }
    }

    getCurrentBonus(): { index: number, bonus: number } {
        return { index: this.current, bonus: this.bonus[this.current] };
    }

    reset(): void {
        this.version = Consts.Bonus.VERSION;
        this.bonus = Consts.Bonus.DEAILY;
        this.current = 0;
        this.lastReceipt = 0;
        this.nextStart = 0;
        this.nextEnd = 0;
    }

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

