import { Assets } from "../../consts";

/**
 * パネル表示の各種定数
 */
export class PanelsConst {
    static panelProp: { x: number, y: number, frame: string }[] = [
        { x: 0, y: -64, frame: Assets.Graphic.Panels.Frames.PANEL_START },
        { x: -256, y: 0, frame: Assets.Graphic.Panels.Frames.PANEL_GU },
        { x: 0, y: 64, frame: Assets.Graphic.Panels.Frames.PANEL_CHOKI },
        { x: 256, y: 0, frame: Assets.Graphic.Panels.Frames.PANEL_PA },
    ];

    static decidePosition: { x: number, y: number } = { x: 0, y: 0 };
}