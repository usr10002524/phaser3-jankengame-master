
export class DateTime {

    static getTime(): number {
        const date = new Date();
        return date.getTime();
    }

    static dateTrunc(stamp: number, offsetMsec?: number) {

        //オフセットが指定してあれば適応する
        if (offsetMsec != null) {
            stamp += offsetMsec;
        }

        const date = new Date(stamp);
        const Y = date.getFullYear();
        const M = date.getMonth();
        const D = date.getDate();

        const tmp = new Date(Y, M, D);
        return tmp.getTime();
    }

    static isSameDate(stampA: number, stampB: number, offsetMsec?: number) {
        const timeA = DateTime.dateTrunc(stampA, offsetMsec);
        const timeB = DateTime.dateTrunc(stampB, offsetMsec);

        return (timeA === timeB);
    }
}