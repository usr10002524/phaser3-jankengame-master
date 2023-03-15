import { Consts } from "../../consts";
import { Log } from "../../service/logwithstamp";
import { Random } from "../../service/random";
import { JankenCoreConsts } from "./janken-core-consts";

export type JankenInfo = {
    player: number;
    enemy: number;
    result: number;
    force: boolean;
}

export class JankenCore {

    private random: Random | null;
    private history: JankenInfo[];
    private finished: boolean;
    private rateIndex: number;

    constructor() {
        this.random = null;
        this.history = [];
        this.finished = false;
        this.rateIndex = JankenCoreConsts.DEFAULT_RATE_INDEX;
    }

    start(config: { random: Random, rateIndex: number }): void {
        this.random = config.random;
        this.history = [];
        this.finished = false;
        this._setRateIndex(config.rateIndex);
    }

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

    getHistory(): JankenInfo[] {
        return this.history;
    }

    getRound(): number {
        return this.history.length;
    }

    private _setRateIndex(rateIndex: number): void {
        if (rateIndex >= 0 && rateIndex < JankenCoreConsts.Rate.length) {
            this.rateIndex = rateIndex;
        }
        else {
            Log.put(`Illegal index:${rateIndex}. Use Default index:${JankenCoreConsts.DEFAULT_RATE_INDEX}`);
            this.rateIndex = JankenCoreConsts.DEFAULT_RATE_INDEX;
        }
    }

    private _getRate(): number {
        if (this.rateIndex >= 0 && this.rateIndex < JankenCoreConsts.Rate.length) {
            return JankenCoreConsts.Rate[this.rateIndex];
        }
        else {
            Log.put(`Illegal index:${this.rateIndex}. Use Default index:${JankenCoreConsts.DEFAULT_RATE_INDEX}`);
            return JankenCoreConsts.Rate[JankenCoreConsts.DEFAULT_RATE_INDEX];
        }
    }

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

    private _getWinSuit(suit: number): number {
        switch (suit) {
            case Consts.Janken.Suit.GU: return Consts.Janken.Suit.PA;
            case Consts.Janken.Suit.CHOKI: return Consts.Janken.Suit.GU;
            case Consts.Janken.Suit.PA: return Consts.Janken.Suit.CHOKI;
        }
        return Consts.Janken.Suit.NONE;
    }

    private _getLoseSuit(suit: number): number {
        switch (suit) {
            case Consts.Janken.Suit.GU: return Consts.Janken.Suit.CHOKI;
            case Consts.Janken.Suit.CHOKI: return Consts.Janken.Suit.PA;
            case Consts.Janken.Suit.PA: return Consts.Janken.Suit.GU;
        }
        return Consts.Janken.Suit.NONE;
    }
}
