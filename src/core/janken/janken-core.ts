import { Consts } from "../../consts";
import { Log } from "../../service/logwithstamp";
import { Random } from "../../service/random";
import { JankenCoreConsts } from "./janken-core-consts";

/**
 * 1ゲームあたりの情報
 */
export type JankenInfo = {
    player: number;
    enemy: number;
    result: number;
    force: boolean;
}

/**
 * じゃんけんゲームコア
 */
export class JankenCore {

    // 乱数
    private random: Random | null;
    // 履歴
    private history: JankenInfo[];
    // 終了したか
    private finished: boolean;
    // 勝率テーブルのインデックス
    private rateIndex: number;

    /**
     * コンストラクタ
     */
    constructor() {
        this.random = null;
        this.history = [];
        this.finished = false;
        this.rateIndex = JankenCoreConsts.DEFAULT_RATE_INDEX;
    }

    /**
     * 初期化
     * @param config コンフィグ
     * @param random 乱数
     * @param rateIndex 勝率テーブルのインデックス
     */
    start(config: { random: Random, rateIndex: number }): void {
        this.random = config.random;
        this.history = [];
        this.finished = false;
        this._setRateIndex(config.rateIndex);
    }

    /**
     * 1プレー実行する
     * @param playerSuit プレーヤーの手
     * @returns enmySuit CPUの手
     * @returns result   結果
     */
    play(playerSuit: number): { enemySuit: number, result: number } {
        if (this.random == null) {
            return { enemySuit: Consts.Janken.Suit.NONE, result: Consts.Janken.Result.NONE };  //乱数生成機が未設定
        }
        if (this.finished) {
            return { enemySuit: Consts.Janken.Suit.NONE, result: Consts.Janken.Result.NONE };  //すでに終了
        }

        const round = this.history.length + 1;
        let result = Consts.Janken.Result.NONE;

        if (round < JankenCoreConsts.MAXROUND) {
            //まず1/3であいこ抽選
            const prob = this.random.get(3 * 10000) % 3;
            if (0 === prob) {
                //あいこ確定
                result = Consts.Janken.Result.DRAW;
            }
            else {
                //勝率に応じて結果を抽選
                result = this._judgeWithRate();
            }
        }
        else {
            //勝率に応じて結果を抽選
            result = this._judgeWithRate();
        }
        //結果を格納
        const enemySuit = this._getEnemySuitFromResult(playerSuit, result);
        this.history.push({ player: playerSuit, enemy: enemySuit, result: result, force: false });


        //自然確率（ほぼ）
        // if (round < Consts.Janken.MAXROUND) {
        //     const enemySuit = this.random.get(Consts.Janken.SUIT_MAX) + Consts.Janken.SUIT_MIN;
        //     result = this._judge(playerSuit, enemySuit);

        //     //結果を格納
        //     this.history.push({ player: playerSuit, enemy: enemySuit, result: result, force: false });
        // }
        // else {
        //     //最終ラウンドまで行った場合は1/3で勝たせる
        //     let enemySuit = Consts.Janken.Suit.NONE;
        //     if (0 === this.random.get(3)) {
        //         //プレーヤーに勝たせる
        //         enemySuit = this._getLoseSuit(playerSuit);
        //     }
        //     else {
        //         //プレーヤーに負けさせる
        //         enemySuit = this._getWinSuit(playerSuit);
        //     }
        //     result = this._judge(playerSuit, enemySuit);

        //     //結果を格納
        //     this.history.push({ player: playerSuit, enemy: enemySuit, result: result, force: true });
        // }

        if (result != Consts.Janken.Result.DRAW) {
            this.finished = true;   //決着済み
        }
        return { enemySuit: enemySuit, result: result };
    }

    /**
     * 履歴を取得する
     * @returns 履歴
     */
    getHistory(): JankenInfo[] {
        return this.history;
    }

    /**
     * ラウンド数を取得する
     * @returns ラウンド数
     */
    getRound(): number {
        return this.history.length;
    }

    // 勝率インデックスを設定する
    private _setRateIndex(rateIndex: number): void {
        if (rateIndex >= 0 && rateIndex < JankenCoreConsts.Rate.length) {
            this.rateIndex = rateIndex;
        }
        else {
            Log.put(`Illegal index:${rateIndex}. Use Default index:${JankenCoreConsts.DEFAULT_RATE_INDEX}`);
            this.rateIndex = JankenCoreConsts.DEFAULT_RATE_INDEX;
        }
    }

    // 勝率を取得する
    private _getRate(): number {
        if (this.rateIndex >= 0 && this.rateIndex < JankenCoreConsts.Rate.length) {
            return JankenCoreConsts.Rate[this.rateIndex];
        }
        else {
            Log.put(`Illegal index:${this.rateIndex}. Use Default index:${JankenCoreConsts.DEFAULT_RATE_INDEX}`);
            return JankenCoreConsts.Rate[JankenCoreConsts.DEFAULT_RATE_INDEX];
        }
    }

    // 勝敗判定を行う
    private _judge(playerSuit: number, enemySuit: number): number {
        switch (playerSuit) {
            case Consts.Janken.Suit.GU:
                switch (enemySuit) {
                    case Consts.Janken.Suit.GU: return Consts.Janken.Result.DRAW;
                    case Consts.Janken.Suit.CHOKI: return Consts.Janken.Result.WIN;
                    case Consts.Janken.Suit.PA: return Consts.Janken.Result.LOSE;
                }

            case Consts.Janken.Suit.CHOKI:
                switch (enemySuit) {
                    case Consts.Janken.Suit.GU: return Consts.Janken.Result.LOSE;
                    case Consts.Janken.Suit.CHOKI: return Consts.Janken.Result.DRAW;
                    case Consts.Janken.Suit.PA: return Consts.Janken.Result.WIN;
                }

            case Consts.Janken.Suit.PA:
                switch (enemySuit) {
                    case Consts.Janken.Suit.GU: return Consts.Janken.Result.WIN;
                    case Consts.Janken.Suit.CHOKI: return Consts.Janken.Result.LOSE;
                    case Consts.Janken.Suit.PA: return Consts.Janken.Result.DRAW;
                }
        }
        return Consts.Janken.Result.NONE;
    }

    // 勝率に基づいて勝敗を決める
    private _judgeWithRate(): number {
        if (this.random == null) {
            Log.put(`this.rondom == null`);
            return Consts.Janken.Result.NONE;
        }

        const rate = this._getRate();
        const value = this.random?.get(JankenCoreConsts.DENOMINATOR);
        if (value < rate) {
            return Consts.Janken.Result.WIN;
        }
        else {
            return Consts.Janken.Result.LOSE;
        }
    }

    // 結果に応じてCPUの手を取得する
    private _getEnemySuitFromResult(playerSuit: number, result: number): number {
        switch (result) {
            case Consts.Janken.Result.WIN: {
                return this._getLoseSuit(playerSuit);
            }
            case Consts.Janken.Result.LOSE: {
                return this._getWinSuit(playerSuit);
            }
            case Consts.Janken.Result.DRAW: {
                return playerSuit;
            }
            default: {
                return Consts.Janken.Result.NONE;
            }
        }
    }

    // 指定された手に勝つ手を取得
    private _getWinSuit(suit: number): number {
        switch (suit) {
            case Consts.Janken.Suit.GU: return Consts.Janken.Suit.PA;
            case Consts.Janken.Suit.CHOKI: return Consts.Janken.Suit.GU;
            case Consts.Janken.Suit.PA: return Consts.Janken.Suit.CHOKI;
        }
        return Consts.Janken.Suit.NONE;
    }

    // 指定された手に負ける手を取得
    private _getLoseSuit(suit: number): number {
        switch (suit) {
            case Consts.Janken.Suit.GU: return Consts.Janken.Suit.CHOKI;
            case Consts.Janken.Suit.CHOKI: return Consts.Janken.Suit.PA;
            case Consts.Janken.Suit.PA: return Consts.Janken.Suit.GU;
        }
        return Consts.Janken.Suit.NONE;
    }
}
