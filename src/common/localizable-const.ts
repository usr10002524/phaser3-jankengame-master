import { Assets, Consts } from "../consts";

export class LocalizableConst {
    public static GetLocalizableFile(type: number): string {
        switch (type) {
            case Consts.Localizable.ENGLISH: return Assets.Localizable.File.ENGLISH;
            case Consts.Localizable.JAPANEASE: return Assets.Localizable.File.JAPANEASE;
            default: return Assets.Localizable.File.ENGLISH;
        }
    }
}