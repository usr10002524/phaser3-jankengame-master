import { AtsumaruConsts } from "../atsumaru/atsumaru";

export type LocalStorageItem = {
    key: string;
    value: string;
};


export class LocalStorage {

    public static loadLocalData(fn: (result: number, data: LocalStorageItem[]) => void): void {

        this.getItems()
            .then(resp => {
                fn(AtsumaruConsts.CommStat.SUCCESS, resp);
            })
            .catch(e => {
                fn(AtsumaruConsts.CommStat.FAIL, []);
            });
    }

    public static saveLocalData(data: LocalStorageItem[], fn: (result: number) => void): void {

        this.setItems(data)
            .then(() => {
                fn(AtsumaruConsts.CommStat.SUCCESS);
            })
            .catch(e => {
                fn(AtsumaruConsts.CommStat.FAIL);
            });
    }

    public static deleteLocalData(key: string, fn: (result: number) => void): void {

        this.deleteItem(key)
            .then(() => {
                fn(AtsumaruConsts.CommStat.SUCCESS);
            })
            .catch(e => {
                fn(AtsumaruConsts.CommStat.FAIL);
            });
    }

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