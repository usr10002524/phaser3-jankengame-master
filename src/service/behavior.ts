/**
 * ビヘイビア
 * 
 * 簡単な振る舞い制御システム。
 * Behavior を継承して振る舞いを実装する。
 * インスタンスを作成し、BehaivorManager にaddする。
 * add した際に initialize() が呼ばれる。
 * その後、毎フレーム update() が呼ばれる。
 * update() 時に isFinished() でビヘイビアの終了を監視し、true が返されると、finalize() を呼び、インスタンスを破棄する。
 * Behavior クラスのコンストラクタで渡す key は BehaivorManager から Behavior を検索する際に使用する。
 * 同名の key は許容されるが、BehaivorManager に同名の key のBehavior が複数存在した場合、
 * get は最初に見つかった Behavior を返すことに注意。
 */

import { Log } from "../service/logwithstamp";

/**
 * ビヘイビアクラス
 */
export abstract class Behavior {
    protected key: string;

    /**
     * コンストラクタ
     * @param key 検索用のキー
     */
    constructor(key: string) {
        this.key = key;
        Log.put(`${key} create.`, key);
    }

    //keyを取得する
    getKey(): string {
        return this.key;
    }

    //初期化(BehaviorManagerにaddされたときに呼ばれる)
    abstract initialize(): void;

    //更新処理
    abstract update(): void;

    //終了処理
    abstract finalize(): void;

    //終了したか
    abstract isFinished(): boolean;
}

export class BehaviorManager {

    private elems: Behavior[];
    private behaviorMap: Map<number, Behavior>;
    private sequence: number;

    /**
     * コンストラクタ
     */
    constructor() {
        this.elems = [];
        this.behaviorMap = new Map<number, Behavior>();
        this.sequence = 0;
    }

    /**
     * ビヘイビアを追加する
     * @param behavior 追加するビヘイビア
     * @return シーケンス番号
     */
    add(behavior: Behavior): number {
        behavior.initialize();
        this.sequence++;
        this.behaviorMap.set(this.sequence, behavior);
        this.elems.push(behavior);

        return this.sequence;
    }

    /**
     * ビヘイビアの終了チェック
     * @param sequence add のときに発行されたシーケンス番号
     * @returns ビヘイビアが終了状態のときは true 、そうでないときは false を返す
     */
    isFinished(sequence: number): boolean {
        const behavior = this.behaviorMap.get(sequence);
        if (behavior != null) {
            return behavior.isFinished();   //終了状態になっている
        }
        else {
            return true;    //マップから削除済みなので終了している
        }
    }

    /**
     * 更新処理
     */
    update(): void {
        let removes: number[] = [];

        this.behaviorMap.forEach((behavior: Behavior, sequence: number) => {
            //更新処理を行う
            behavior.update();

            //終了していれば別途抽出しておく
            if (behavior.isFinished()) {
                removes.push(sequence);
            }
        });

        //リムーブ予約が入っているものを取り外す
        removes.forEach((sequence: number) => {
            const behavior = this.behaviorMap.get(sequence);
            //終了処理を行う
            if (behavior != null) {
                behavior.finalize();
            }

            //マップから削除する
            this.behaviorMap.delete(sequence);
        });
    }

    /**
     * ビヘイビアマップのクリア
     */
    clear(): void {
        //すべてに対して終了処理を呼び出す
        this.behaviorMap.forEach((behavior: Behavior, sequence: number) => {
            //更新処理を行う
            behavior.finalize();
        });

        this.behaviorMap.clear();
    }

}