import { Consts } from "./consts";
import { SceneLoading } from "./scene/scene-loading";
import { SceneMain } from "./scene/scene-main";
import { SceneTest } from "./scene/scene-test";
import { SceneTitle } from "./scene/scene-title";

export const GameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    title: Consts.TITLE,
    version: Consts.VERSION,
    width: Consts.Screen.WIDTH,
    height: Consts.Screen.HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: true
        }
    },
    scale: {
        mode: Phaser.Scale.ScaleModes.FIT,
        autoCenter: Phaser.Scale.Center.CENTER_BOTH,
        max: {
            width: Consts.Screen.WIDTH,
            height: Consts.Screen.HEIGHT
        }
    },
    backgroundColor: Consts.Screen.BGCOLOR,
    audio: {
        disableWebAudio: false,
    },
    // scene: [SceneLoading, SceneTitle, SceneMain, SceneGameClear, SceneGameOver],
    scene: [SceneLoading, SceneTitle, SceneMain],
};
