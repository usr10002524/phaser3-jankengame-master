/**
 * AtsumaruAPI が使えない場合、javascript の LocalStrage を使う。
 * AtsumaruAPI と同等に使えるよう、関数名、引数などは同じようにしておく。
 */

import { AtsumaruConsts } from "../atsumaru/atsumaru";


// LocalStrage アイテム１つあたりのデータ
export type LocalStorageItem = {
    key: string;
    value: string;
};

/**
 * LocalStorage クラス
 */
export class LocalStorage {

    /**
     * データのロードを行う
     * コールバック関数の result にはロード結果(@see AtumaruConst.CommStat)、
     * data にはロードしたデータの配列が渡される。
     * ロード結果が AtumaruConst.CommStat.FAIL の場合、data は空の配列が渡される。
     * 
     * @param fn ロード結果をコールバックする関数
     */
    public static loadLocalData(fn: (result: number, data: LocalStorageItem[]) => void): void {

        this.getItems()
            .then(resp => {
                fn(AtsumaruConsts.CommStat.SUCCESS, resp);
            })
            .catch(e => {
                fn(AtsumaruConsts.CommStat.FAIL, []);
            });
    }

    /**
     * データのセーブを行う。
     * コールバック関数の result にはロード結果(@see AtumaruConst.CommStat)が渡される。
     * @param data セーブを行うデータの配列
     * @param fn セーブ結果をコールバックする関数
     */
    public static saveLocalData(data: LocalStorageItem[], fn: (result: number) => void): void {

        this.setItems(data)
            .then(() => {
                fn(AtsumaruConsts.CommStat.SUCCESS);
            })
            .catch(e => {
                fn(AtsumaruConsts.CommStat.FAIL);
            });
    }

    /**
     * データの削除を行う。
     * コールバック関数の result には削除結果(@see AtumaruConst.CommStat)が渡される。
     * @param key 削除するデータのキー
     * @param fn 削除結果をコールバックする関数
     */
    public static deleteLocalData(key: string, fn: (result: number) => void): void {

        this.deleteItem(key)
            .then(() => {
                fn(AtsumaruConsts.CommStat.SUCCESS);
            })
            .catch(e => {
                fn(AtsumaruConsts.CommStat.FAIL);
            });
    }

    /**
     * localStrage からデータを取得する
     * @returns ロードしたデータ
     */
    private static async getItems(): Promise<LocalStorageItem[]> {

        try {
            let result: LocalStorageItem[] = [];

            const keyCount = localStorage.length;
            for (let i = 0; i < keyCount; i++) {
                const key = localStorage.key(i);
                if (key == null) {
                    continue;
                }
                const value = localStorage.getItem(key);
                if (value == null) {
                    continue;
                }
                result.push({ key: key, value: value });
            }

            return result;
        }
        catch (e) {
            throw e;
        }
    }

    /**
     * localStorage にデータを保存する
     * @param data セーブするデータ
     * @returns void
     */
    private static async setItems(data: LocalStorageItem[]): Promise<void> {
        try {
            data.forEach(element => {
                localStorage.setItem(element.key, element.value);
            });

            return;
        }
        catch (e) {
            throw e;
        }
    }

    /**
     * localStorage からデータを削除する
     * @param key 削除するデータのキー
     * @returns void
     */
    private static async deleteItem(key: string): Promise<void> {
        try {
            localStorage.removeItem(key);
            return;
        }
        catch (e) {
            throw e;
        }
    }
}