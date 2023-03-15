import { StorageItem } from "@atsumaru/api-types";

/**
 * サーバデータ1つあたりのデータ
 */
class OneData {
    data: string = '';
    isDirty: boolean = false;

    constructor(data: string, isDirty: boolean) {
        this.data = data;
        this.isDirty = isDirty;
    }
}

/**
 * サーバデータ管理クラス
 */
export class ServerData {

    private dataMap: Map<string, OneData>;

    constructor() {
        this.dataMap = new Map<string, OneData>();
    }

    /**
     * サーバデータをセットする。
     * @param key サーバデータのキー
     * @param data サーバデータのデータ部分
     */
    set(key: string, data: string): void {
        let dirty = false;
        //データが有るかチェック
        if (this.dataMap.has(key)) {
            //データが有る場合、変化があればdirtyフラグを立てる
            const cur = this.dataMap.get(key);
            if (cur?.data !== data) {
                dirty = true;
            }
        }
        else {
            //データが無い場合、常にdirtyフラグを立てる
            dirty = true;
        }
        this.dataMap.set(key, new OneData(data, dirty));
    }

    /**
     * 指定したキーのサーバデータが存在するかどうかを取得する。
     * @param key サーバデータのキー
     * @returns 指定したキーのデータが存在する場合はtrue,なければfalseを返す。
     */
    has(key: string): boolean {
        return this.dataMap.has(key);
    }

    /**
     * 指定したキーのサーバデータを取得する。
     * @param key サーバデータのキー
     * @returns 指定したキーのデータが存在する場合はデータ部分を返す。なければnullを返す。
     */
    get(key: string): string | null {
        const data = this.dataMap.get(key);
        if (data == null) {
            return null;
        }
        else {
            return data.data;
        }
    }

    /**
     * dirtyフラグが立っているサーバデータをStorageItemの形で取得する。
     * @returns dirtyフラグが立っているサーバデータを返す。
     */
    getDirtyData(): StorageItem[] {
        let data: StorageItem[] = [];

        this.dataMap.forEach((value: OneData, key: string) => {
            if (value.isDirty) {
                data.push({ key: key, value: value.data });
            }
        });
        return data;
    }

    /**
     * 指定したキーのサーバデータのdirtyフラグを下ろす。
     * @param key サーバデータのキー
     */
    resetDirty(key: string): void {
        const data = this.dataMap.get(key);
        if (data != null) {
            data.isDirty = false;
        }
    }

}