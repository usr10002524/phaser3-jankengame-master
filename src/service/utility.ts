export class Utility {

    /**
     * 指定桁の0埋め舌文字列を取得する
     * @param n 数値
     * @param len 表示桁数
     * @returns 指定した数値を指定した桁で0埋めした文字列を返す
     */
    static zeroPadding(n: number, len: number) {
        return (Array(len).join('0') + n).slice(-len);
    }

    /**
     * 数値を桁ごとに分解した配列を取得する
     * @param n 数値
     * @returns 数値の各桁を入れた配列
     */
    static numberToArray(n: number): number[] {
        const numberArray = [];

        let str = n.toString();
        const len = str.length;
        for (let i = 0; i < len; i++) {
            const a = str.slice(-1, 1);
            const numA = parseInt(a, 10);
            numberArray.push(numA);
        }

        return numberArray;
    }
}