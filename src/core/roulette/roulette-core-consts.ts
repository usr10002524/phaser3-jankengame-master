/**
 * 1マスあたりの情報
 */
export type Cell = {
    win: number;
    weight: number;
}

/**
 * ルーレット全体の情報
 */
export type CellTable = {
    cells: Cell[];
}

/**
 * ルーレットの各種定数
 */
export const RouletteCoreConsts = {
    // 各マスのWINと出現率
    CellTables: [
        // ローリスク・ローリターン
        {
            cells: [
                { win: 50, weight: 50 },
                { win: 1, weight: 2000 },
                { win: 2, weight: 2000 },
                { win: 7, weight: 250 },
                { win: 4, weight: 500 },
                { win: 2, weight: 2000 },
                { win: 16, weight: 100 },
                { win: 1, weight: 2000 },
                { win: 2, weight: 2000 },
                { win: 7, weight: 250 },
                { win: 4, weight: 500 },
                { win: 2, weight: 2000 },
            ],
        },
        // 中間
        {
            cells: [
                { win: 50, weight: 100 },
                { win: 1, weight: 2800 },
                { win: 2, weight: 2000 },
                { win: 7, weight: 150 },
                { win: 4, weight: 300 },
                { win: 2, weight: 2000 },
                { win: 16, weight: 200 },
                { win: 1, weight: 2800 },
                { win: 2, weight: 2000 },
                { win: 7, weight: 150 },
                { win: 4, weight: 300 },
                { win: 2, weight: 2000 },
            ],
        },
        // ハイリスク・ハイリターン
        {
            cells: [
                { win: 50, weight: 150 },
                { win: 1, weight: 5350 },
                { win: 2, weight: 625 },
                { win: 7, weight: 225 },
                { win: 4, weight: 450 },
                { win: 2, weight: 625 },
                { win: 16, weight: 300 },
                { win: 1, weight: 5350 },
                { win: 2, weight: 625 },
                { win: 7, weight: 225 },
                { win: 4, weight: 450 },
                { win: 2, weight: 625 },
            ],
        },
    ] as CellTable[],

    DEFAULT_CELLTABLE_INDEX: 0,
}