/**
 * じゃんけんゲームの各種定数
 */
export const JankenCoreConsts = {
    // じゃんけん勝率
    Rate: [
        4600,
        4400,
        4200,
        4000,
        3800,
        3600,
        3400,
        3200,
    ],
    // 勝率の出現テーブル
    RateIndexTable: [
        1500,
        2000,
        2000,
        2000,
        1800,
        400,
        200,
        100,
    ],
    DEFAULT_RATE_INDEX: 3,
    DENOMINATOR: 10000,

    MAXROUND: 10,
    FORCELOSE: true,
}