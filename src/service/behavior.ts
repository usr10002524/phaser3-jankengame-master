import { Log } from "../service/logwithstamp";

export abstract class Behavior {
    protected key: string;

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

    constructor() {
        this.elems = [];
        this.behaviorMap = new Map<number, Behavior>();
        this.sequence = 0;
    }

    //behavior の追加
    add(behavior: Behavior): number {
        behavior.initialize();
        this.sequence++;
        this.behaviorMap.set(this.sequence, behavior);
        this.elems.push(behavior);

        return this.sequence;
    }

    isFinished(sequence: number): boolean {
        const behavior = this.behaviorMap.get(sequence);
        if (behavior != null) {
            return behavior.isFinished();   //終了状態になっている
        }
        else {
            return true;    //マップから削除済みなので終了している
        }
    }

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

    clear(): void {
        //すべてに対して終了処理を呼び出す
        this.behaviorMap.forEach((behavior: Behavior, sequence: number) => {
            //更新処理を行う
            behavior.finalize();
        });

        this.behaviorMap.clear();
    }

}