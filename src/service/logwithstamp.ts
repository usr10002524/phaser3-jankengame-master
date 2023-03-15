import { Utility } from "./utility";

export class Log {
    static put(text: string, scope?: string) {
        const date = new Date();
        const Y = Utility.zeroPadding(date.getFullYear(), 4);
        const M = Utility.zeroPadding(date.getMonth() + 1, 2);
        const D = Utility.zeroPadding(date.getDate(), 2);
        const h = Utility.zeroPadding(date.getHours(), 2);
        const m = Utility.zeroPadding(date.getMinutes(), 2);
        const s = Utility.zeroPadding(date.getSeconds(), 2);
        const ms = Utility.zeroPadding(date.getMilliseconds(), 3);

        if (scope === undefined) {
            scope = '';
        }

        console.log(`${Y}-${M}-${D} ${h}:${m}:${s}.${ms} [${scope}] ${text}`);
    }


}