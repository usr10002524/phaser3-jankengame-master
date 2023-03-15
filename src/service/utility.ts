export class Utility {

    static zeroPadding(n: number, len: number) {
        return (Array(len).join('0') + n).slice(-len);
    }

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