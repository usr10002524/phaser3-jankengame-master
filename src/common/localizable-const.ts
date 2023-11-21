import { Assets, Consts } from "../consts";

/**
 * ローカライズ関連の定数クラス
 */
export class LocalizableConst {

    /**
     * 言語タイプから、文字列セットのファイル名を取得する
     * @param type 言語のタイプ(@see Consts.Localizable)
     * @returns 言語タイプに対応した、文字列セットのファイル。
     */
    public static GetLocalizableFile(type: number): string {
        switch (type) {
            case Consts.Localizable.ENGLISH: return Assets.Localizable.File.ENGLISH;
            case Consts.Localizable.JAPANEASE: return Assets.Localizable.File.JAPANEASE;
            default: return Assets.Localizable.File.ENGLISH;
        }
    }
}