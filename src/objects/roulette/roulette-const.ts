import { Assets } from "../../consts";

/**
 * ルーレット関連の定数
 */
export class RouletteConst {
    static cellProp: { r: number, x: number, y: number, frame: string, effFrame: string }[] = [
        { r: 0, x: 0, y: -210, frame: Assets.Graphic.Roulette.Frames.O_CELL, effFrame: Assets.Graphic.Roulette.Frames.O_CELL_EFF2 },
        { r: 30, x: 105, y: -181.87, frame: Assets.Graphic.Roulette.Frames.W_CELL, effFrame: Assets.Graphic.Roulette.Frames.O_CELL_EFF2 },
        { r: 60, x: 181.87, y: -105, frame: Assets.Graphic.Roulette.Frames.O_CELL, effFrame: Assets.Graphic.Roulette.Frames.O_CELL_EFF2 },
        { r: 90, x: 210, y: 0, frame: Assets.Graphic.Roulette.Frames.W_CELL, effFrame: Assets.Graphic.Roulette.Frames.O_CELL_EFF2 },
        { r: 120, x: 181.87, y: 105, frame: Assets.Graphic.Roulette.Frames.O_CELL, effFrame: Assets.Graphic.Roulette.Frames.O_CELL_EFF2 },
        { r: 150, x: 105, y: 181.87, frame: Assets.Graphic.Roulette.Frames.W_CELL, effFrame: Assets.Graphic.Roulette.Frames.O_CELL_EFF2 },
        { r: 180, x: 0, y: 210, frame: Assets.Graphic.Roulette.Frames.O_CELL, effFrame: Assets.Graphic.Roulette.Frames.O_CELL_EFF2 },
        { r: -150, x: -105, y: 181.87, frame: Assets.Graphic.Roulette.Frames.W_CELL, effFrame: Assets.Graphic.Roulette.Frames.O_CELL_EFF2 },
        { r: -120, x: -181.87, y: 105, frame: Assets.Graphic.Roulette.Frames.O_CELL, effFrame: Assets.Graphic.Roulette.Frames.O_CELL_EFF2 },
        { r: -90, x: -210, y: 0, frame: Assets.Graphic.Roulette.Frames.W_CELL, effFrame: Assets.Graphic.Roulette.Frames.O_CELL_EFF2 },
        { r: -60, x: -181.87, y: -105, frame: Assets.Graphic.Roulette.Frames.O_CELL, effFrame: Assets.Graphic.Roulette.Frames.O_CELL_EFF2 },
        { r: -30, x: -105, y: -181.87, frame: Assets.Graphic.Roulette.Frames.W_CELL, effFrame: Assets.Graphic.Roulette.Frames.O_CELL_EFF2 },
    ];

    static noProp: { r: number, x: number, y: number, frame: string, effFrame: string }[] = [
        { r: 0, x: 0, y: -214, frame: Assets.Graphic.Roulette.Frames.W_50, effFrame: Assets.Graphic.Roulette.Frames.W_50_EFF },
        { r: 30, x: 107, y: -185.33, frame: Assets.Graphic.Roulette.Frames.O_01, effFrame: Assets.Graphic.Roulette.Frames.O_01_EFF },
        { r: 60, x: 185.33, y: -107, frame: Assets.Graphic.Roulette.Frames.W_02, effFrame: Assets.Graphic.Roulette.Frames.W_02_EFF },
        { r: 90, x: 214, y: 0, frame: Assets.Graphic.Roulette.Frames.O_07, effFrame: Assets.Graphic.Roulette.Frames.O_07_EFF },
        { r: 120, x: 185.33, y: 107, frame: Assets.Graphic.Roulette.Frames.W_04, effFrame: Assets.Graphic.Roulette.Frames.W_04_EFF },
        { r: 150, x: 107, y: 185.33, frame: Assets.Graphic.Roulette.Frames.O_02, effFrame: Assets.Graphic.Roulette.Frames.O_02_EFF },
        { r: 180, x: 0, y: 214, frame: Assets.Graphic.Roulette.Frames.W_16, effFrame: Assets.Graphic.Roulette.Frames.W_16_EFF },
        { r: -150, x: -107, y: 185.33, frame: Assets.Graphic.Roulette.Frames.O_01, effFrame: Assets.Graphic.Roulette.Frames.O_01_EFF },
        { r: -120, x: -185.33, y: 107, frame: Assets.Graphic.Roulette.Frames.W_02, effFrame: Assets.Graphic.Roulette.Frames.W_02_EFF },
        { r: -90, x: -214, y: 0, frame: Assets.Graphic.Roulette.Frames.O_07, effFrame: Assets.Graphic.Roulette.Frames.O_07_EFF },
        { r: -60, x: -185.33, y: -107, frame: Assets.Graphic.Roulette.Frames.W_04, effFrame: Assets.Graphic.Roulette.Frames.W_04_EFF },
        { r: -30, x: -107, y: -185.33, frame: Assets.Graphic.Roulette.Frames.O_02, effFrame: Assets.Graphic.Roulette.Frames.O_02_EFF },
    ];

    static lampProp: { type: number, x: number, y: number, frame: string, effFrame: string }[] = [
        { type: 0, x: -33, y: 161, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: -33, y: 147, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: 28, y: 163, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: 28, y: 148, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: -38, y: 132, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: -23, y: 134, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: -9, y: 135, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: 6, y: 137, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: 20, y: 138, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: 40, y: 138, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: 54, y: 136, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: 70, y: 132, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: 80, y: 122, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: 72, y: 108, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: 59, y: 96, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: 76, y: 86, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: 90, y: 78, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: 101, y: 68, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: 110, y: 56, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: 117, y: 43, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: 122, y: 29, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: 127, y: 16, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: -53, y: 130, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: -68, y: 125, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: -81, y: 117, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: -81, y: 102, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: -67, y: 93, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: -53, y: 82, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: -67, y: 74, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: -82, y: 68, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: -93, y: 60, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: -100, y: 48, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: -8, y: 49, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: -9, y: 35, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: -11, y: 21, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: -13, y: 5, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: -17, y: -11, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: 26, y: 50, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: 29, y: 35, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: 36, y: 19, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: 40, y: 5, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: 44, y: -10, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: -106, y: -11, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: -95, y: -21, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: -85, y: -32, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 0, x: -85, y: -46, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 3, x: -118, y: 52, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 3, x: -134, y: 47, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 3, x: -145, y: 39, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 3, x: -157, y: 29, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 3, x: -167, y: 17, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 3, x: -165, y: 0, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 3, x: -154, y: -9, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 3, x: -138, y: -14, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 3, x: -122, y: -12, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 3, x: 57, y: -67, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 3, x: 70, y: -78, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 3, x: 79, y: -90, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 3, x: 90, y: -100, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 3, x: 105, y: -104, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 3, x: 117, y: -96, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 3, x: 122, y: -82, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 3, x: 118, y: -67, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 3, x: 112, y: -50, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 3, x: 119, y: -35, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 3, x: 133, y: -41, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 3, x: 152, y: -44, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 3, x: 167, y: -37, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 3, x: 165, y: -19, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 3, x: 155, y: -4, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 3, x: 142, y: 11, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 4, x: -90, y: -59, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 4, x: -93, y: -74, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 4, x: -93, y: -91, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 4, x: -93, y: -107, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 4, x: -84, y: -122, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 4, x: -74, y: -133, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 4, x: -43, y: -126, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 4, x: -57, y: -136, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 4, x: -35, y: -107, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 4, x: -30, y: -91, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 4, x: -30, y: -73, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 4, x: -12, y: -78, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 4, x: -8, y: -93, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 4, x: -3, y: -108, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 4, x: 4, y: -123, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 4, x: 14, y: -134, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 4, x: 31, y: -136, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 4, x: 43, y: -126, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 4, x: 48, y: -109, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 4, x: 46, y: -89, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 4, x: 42, y: -72, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 1, x: -108, y: 35, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 1, x: -113, y: 21, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 1, x: -118, y: 5, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 1, x: 38, y: -53, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 1, x: 55, y: -50, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 1, x: 73, y: -51, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 1, x: 91, y: -42, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 1, x: 132, y: 2, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 1, x: 129, y: -12, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 1, x: 117, y: -22, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 1, x: 100, y: -27, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 2, x: -74, y: -56, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 2, x: -60, y: -64, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 2, x: -43, y: -62, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 2, x: -28, y: -57, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 2, x: -10, y: -59, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 2, x: 7, y: -65, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
        { type: 2, x: 25, y: -62, frame: Assets.Graphic.Roulette.Frames.LAMP, effFrame: Assets.Graphic.Roulette.Frames.LAMP_EFF },
    ];
}