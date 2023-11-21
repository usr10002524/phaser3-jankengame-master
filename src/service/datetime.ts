
/**
 * 日時クラス
 */
export class DateTime {

    /**
     * エポックタイムを取得する
     * @returns エポックタイプ
     */
    static getTime(): number {
        const date = new Date();
        return date.getTime();
    }

    /**
     * 時分秒部分 を丸める
     * @param stamp エポックタイプ
     * @param offsetMsec エポックタイムのオフセット
     * @returns stamp + offsetMsec の時分秒部分を0にしたエポックタイム
     */
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

    /**
     * stampA と stampB が同日かどうかチェックする
     * @param stampA エポックタイム
     * @param stampB エポックタイム
     * @param offsetMsec エポックタイムのオフセット
     * @returns stampA と stampB が同日の場合は true 、そうでない場合は false を返す
     */
    static isSameDate(stampA: number, stampB: number, offsetMsec?: number) {
        const timeA = DateTime.dateTrunc(stampA, offsetMsec);
        const timeB = DateTime.dateTrunc(stampB, offsetMsec);

        return (timeA === timeB);
    }
}