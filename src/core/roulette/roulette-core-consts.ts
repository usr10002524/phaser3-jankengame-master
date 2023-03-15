
export type Cell = {
    win: number;
    weight: number;
}

export type CellTable = {
    cells: Cell[];
}

export const RouletteCoreConsts = {
    CellTables: [
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