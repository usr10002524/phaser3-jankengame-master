/**
 * 各種定数
 */
export const Consts = {
    TITLE: "JANKEN GAME",
    VERSION: "202303200910",

    //画面サイズ
    Screen: {
        WIDTH: 800,
        HEIGHT: 600,
        BGCOLOR: 0x000000,
    },

    Roulette: {
        DEPTH: 10,
    },
    Cells: {
        Position: {
            POS_00: 0,
            POS_01: 1,
            POS_02: 2,
            POS_03: 3,
            POS_04: 4,
            POS_05: 5,
            POS_06: 6,
            POS_07: 7,
            POS_08: 8,
            POS_09: 9,
            POS_10: 10,
            POS_11: 11,
            POS_MAX: 12,
        },
        DEPTH: 6,
    },
    CellEffs: {
        DEPTH: 8,
    },
    Numbers: {
        DEPTH: 7,
    },
    NumberEffs: {
        DEPTH: 9,
    },
    Lamps: {
        Type: {
            COMMON: 0,  //GU, CHOKI, pA
            CLOSE1: 1,  //GU, CHOKI
            CLOSE2: 2,  //GU, PA
            OPEN1: 3,   //PA
            OPEN2: 4,   //CHOKI, PA
            MAX: 5,
        },
        DEPTH: 7,
    },
    LampEffes: {
        DEPTH: 8,
    },
    LampBG: {
        DEPTH: 6,
    },

    Panels: {
        Type: {
            START: 0,
            GU: 1,
            CHOKI: 2,
            PA: 3,
            MAX: 4,
        },
        DEPTH: 10
    },

    Janken: {
        Suit: {
            NONE: 0,
            GU: 1,
            CHOKI: 2,
            PA: 3,
        },
        SUIT_MIN: 1,
        SUIT_MAX: 3,

        Result: {
            NONE: 0,
            WIN: 1,
            LOSE: 2,
            DRAW: 3,
        },
    },

    Moji: {
        Type: {
            NONE: 0,
            JAN: 1,
            KEN: 2,
            PON: 3,
            AI: 4,
            KODE: 5,
            SHO: 6,
            WIN: 7,
            LOSE: 8,
            DRAW: 9,
        },
        DEPTH: 20,
    },

    Sheet: {
        Sheet: {
            Position: {
                x: 0,
                y: 0,
            },
            DEPTH: 20,
        },
        Cells: {
            Position: [
                { x: -209, y: -91 },
                { x: -76, y: -91 },
                { x: 57, y: -91 },
                { x: 190, y: -91 },
                { x: -142, y: 42 },
                { x: -9, y: 42 },
                { x: 124, y: 42 },
            ],
            Icon: {
                DEPTH: 21,
            },
            Stamp: {
                DEPTH: 22,
            },
            Cursor: {
                DEPTH: 22,
            }
        },
        Notice1: {
            Position: { x: 0, y: 130 },
            Oirgin: { x: 0.5, y: 0 },
            DEPTH: 21,
        },
        Notice2: {
            Position: { x: 300, y: 200 },
            Oirgin: { x: 1, y: 0 },
            DEPTH: 21,
        },
    },

    BG: {
        DEPTH: 0,
    },

    Bonus: {
        VERSION: 'JANKEN:20221222',
        DEAILY: [100, 100, 100, 100, 100, 100, 200],
        DAY_OFFSET: 5 * 60 * 60 * 1000,
    },

    Point: {
        Base: {
            Position: {
                x: 150,
                y: 50,
            },
            Origin: {
                x: 0,
                y: 0,
            },
            DEPTH: 30,
        },

        Character: {
            Position: {
                x: 100,
                y: 0,
            },
            Origin: {
                x: 1,
                y: 0,
            },
            WIDTH: 16,
            DEPTH: 31,
        },

        Threshold: {
            Small: {
                VALUE: 100,
                // DELAY: 0,
                DELAY: 100,
            },
            Middle: {
                VALUE: 1000,
                // DELAY: 100,
                DELAY: 500,
            },
            Large: {
                VALUE: 9999999,
                DELAY: 1000
            },
        },
    },

    //ボリューム表示
    SoundVolume: {
        Base: {
            Pos: {
                X: 732,
                Y: 560,
            },
            DEPTH: 7,
        },
        Icon: {
            Pos: {
                X: -40,
                Y: 0,
            },
            Scale: {
                X: 0.6,
                Y: 0.6,
            },
            DEPTH: 2,
        },
        Handle: {
            Size: {
                W: 10,
                H: 25,
            },
            Color: {
                NORMAL: 0xF0F0F0,
                DISABLED: 0x808080,
                GRABED: 0xA0A0A0,
            },
            DEPTH: 4,
        },
        Guage: {
            Pos: {
                X: -24,
                Y: 0,
            },
            Size: {
                W: 72,
                H: 10,
            },
            Color: {
                NORMAL: 0xFFFFFF,
                DISABLED: 0x808080,
            },
            DEPTH: 3,
        },
        GuageBg: {
            COLOR: 0x000000,
            DEPTH: 2,
        },
        Panel: {
            Pos: {
                X: -58,
                Y: 0,
            },
            Size: {
                W: 116,
                H: 40,
            },
            COLOR: 0x404040,
            ALPHA: 0.5,
            DEPTH: 1,
        },
    },

    // 言語
    Localizable: {
        ENGLISH: 1,
        JAPANEASE: 2,
    },
}

export const Assets = {
    BASE: 'assets/',

    //グラフィック
    Graphic: {
        Roulette: {
            KEY: 'roulette',
            ATLAS: 'image/roulette_atlas.json',
            FILE: 'image/roulette.png',

            Frames: {
                ROULETTE: 'roulette',
                PANELBG: 'panelbg',
                W_CELL: 'w_cell',
                W_CELL_EFF: 'w_cell_eff',
                O_CELL: 'o_cell',
                O_CELL_EFF: 'o_cell_eff',
                O_CELL_EFF2: 'o_cell_eff2',
                W_02_EFF: 'w_02_eff',
                W_04_EFF: 'w_04_eff',
                W_16_EFF: 'w_16_eff',
                W_50_EFF: 'w_50_eff',
                W_01_EFF: 'w_01_eff',
                W_07_EFF: 'w_07_eff',
                O_01_EFF: 'o_01_eff',
                O_02_EFF: 'o_02_eff',
                O_04_EFF: 'o_04_eff',
                O_07_EFF: 'o_07_eff',
                O_16_EFF: 'o_16_eff',
                O_50_EFF: 'o_50_eff',
                W_02: 'w_02',
                W_07: 'w_07',
                W_04: 'w_04',
                W_01: 'w_01',
                W_50: 'w_50',
                W_16: 'w_16',
                O_01: 'o_01',
                O_02: 'o_02',
                O_04: 'o_04',
                O_07: 'o_07',
                O_16: 'o_16',
                O_50: 'o_50',
                LAMP: 'lamp',
                LAMP_EFF: 'lamp_eff',
            },
        },

        Panels: {
            KEY: 'panels',
            ATLAS: 'image/panels_atlas.json',
            FILE: 'image/panels.png',

            Frames: {
                PANEL_CHOKI: "panel_choki",
                PANEL_GU: "panel_gu",
                PANEL_PA: "panel_pa",
                PANEL_START: "panel_start",
            },
        },

        Sheets: {
            KEY: 'bonus',
            ATLAS: 'image/bonus_atlas.json',
            FILE: 'image/bonus.png',

            Frames: {
                SHEET: "sheet",
                ICON_100PT: "100pt",
                STAMP: "stamp",
                ICON_200PT: "200pt",
                CURSOR: "cursor",
            },
        },

        Moji: {
            KEY: 'moji',
            ATLAS: 'image/moji_atlas.json',
            FILE: 'image/moji.png',

            Frames: {
                JAN: "jan",
                AIKO: "aiko",
                AI: "ai",
                PON: "pon",
                KEN: "ken",
                KATI: "kati",
                MAKE: "make",
                KODE: "kode",
                SHO: "syo",
            },
        },

        Icons: {
            KEY: 'icons',
            ATLAS: 'image/icons_atlas.json',
            FILE: 'image/icons.png',

            Frames: {
                COIN: "coin",
                GU: "gu",
                CHOKI: "choki",
                PA: "pa",
            },
        },

        Title: {
            KEY: 'title',
            ATLAS: 'image/title_atlas.json',
            FILE: 'image/title.png',

            Frames: {
                TITLE: "title",
                GAMESTART: "gamestart",
                RANKING: "ranking",
            },
        },

        Point: {
            KEY: 'point',
            ATLAS: 'image/point_atlas.json',
            FILE: 'image/point.png',

            Frames: {
                POINT: "point",
                POINT_N0: "point_n0",
                POINT_N1: "point_n1",
                POINT_N2: "point_n2",
                POINT_N3: "point_n3",
                POINT_N4: "point_n4",
                POINT_N5: "point_n5",
                POINT_N6: "point_n6",
                POINT_N7: "point_n7",
                POINT_N8: "point_n8",
                POINT_N9: "point_n9",
            },
        },

        // サウンドボリューム
        SoundIcons: {
            Atlas: {
                NAME: "sound_icons",
                FILE: "image/sound_icons.png",
                ATLAS: "image/sound_icons_atlas.json",
            },

            Volume: {
                ON: "sound_w",
                OFF: "sound_w",
                GRAY: "sound_g",
            },
            Mute: {
                ON: "mute_w",
                OFF: "mute_w",
                GRAY: "mute_g",
            },
        },
    },


    //サウンド
    Audio: {
        SEs: [
            { KEY: 'se_01_16', MP3: 'audio/se/se_01_16.mp3', OGG: 'audio/se/se_01_16.ogg' },
            { KEY: 'se_01_19', MP3: 'audio/se/se_01_19.mp3', OGG: 'audio/se/se_01_19.ogg' },
            { KEY: 'se_01_20', MP3: 'audio/se/se_01_20.mp3', OGG: 'audio/se/se_01_20.ogg' },
            { KEY: 'se_01_21', MP3: 'audio/se/se_01_21.mp3', OGG: 'audio/se/se_01_21.ogg' },
            { KEY: 'se_01_22', MP3: 'audio/se/se_01_22.mp3', OGG: 'audio/se/se_01_22.ogg' },
            { KEY: 'se_01_23', MP3: 'audio/se/se_01_23.mp3', OGG: 'audio/se/se_01_23.ogg' },
            { KEY: 'se_01_24', MP3: 'audio/se/se_01_24.mp3', OGG: 'audio/se/se_01_24.ogg' },
            { KEY: 'se_03_02', MP3: 'audio/se/se_03_02.mp3', OGG: 'audio/se/se_03_02.ogg' },
            { KEY: 'se_05_01', MP3: 'audio/se/se_05_01.mp3', OGG: 'audio/se/se_05_01.ogg' },
            { KEY: 'se_02_10', MP3: 'audio/se/se_02_10.mp3', OGG: 'audio/se/se_02_10.ogg' },
            { KEY: 'se_02_13', MP3: 'audio/se/se_02_13.mp3', OGG: 'audio/se/se_02_13.ogg' },
            { KEY: 'se_01_11', MP3: 'audio/se/se_01_11.mp3', OGG: 'audio/se/se_01_11.ogg' },
            { KEY: 'se_01_12', MP3: 'audio/se/se_01_12.mp3', OGG: 'audio/se/se_01_12.ogg' },
        ],
        SE: {
            SELECT: "se_02_13",
            DECIDE: "se_02_10",
            JAN: 'se_01_21',
            KEN: 'se_01_21',
            PON: 'se_01_22',
            AI: 'se_01_21',
            KODE: 'se_01_21',
            SHO: 'se_01_22',
            FEVER: 'se_01_20',
            YAPPY: 'se_01_24',
            ZUKO: 'se_01_23',
            RSTEP: 'se_01_19',
            // ニコニコ
            // STAMP: 'se_03_02',
            // PAGE: 'se_05_01',
            // ニコニコ以外
            STAMP: 'se_01_12',
            PAGE: 'se_01_11',
        },
    },

    //言語
    Localizable: {
        KEY: "localizable",
        File: {
            ENGLISH: "lang/lang-en.json",
            JAPANEASE: "lang/lang-jp.json",
            DEFAULT: "lang/lang-en.json",
        },

        Sentence: {
            EDIT: "edit",
            ERASE: "erase",
            PLAY: "play",
            PAUSE: "pause",
            CLEAR: "clear",
            SPEEDUP: "speedup",
            SPEEDDOWN: "speeddown",
            RETURN: "return",
            SAVE: "save",
            SCREENSHOT: "screenshot",
            LETSPUT: "letsput",
            LETSPLAY: "letsplay",
            LETSWATCH: "letswatch",
            EDITMODE: "editmode",
            PLAYMODE: "playmode",
        },
    },

    //TODO その他あれば追加する
}
