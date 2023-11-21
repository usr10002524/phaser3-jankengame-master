import "phaser";
import { GameConfig } from "./config"
import { Consts } from "./consts";

/*
 *  html から呼ばれるファイル
 *  ここからゲームを起動する 
 */

window.addEventListener("load", () => {
    const text = `${Consts.TITLE}:${Consts.VERSION}`;
    console.log(text);
    var game: Phaser.Game = new Phaser.Game(GameConfig);
});

