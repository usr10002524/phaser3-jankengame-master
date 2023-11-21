import { Log } from "../service/logwithstamp";
import { LoginBonusData } from "../bonus/login-bonus-data";
import { Behavior } from "../service/behavior";
import { AtsumaruBase, AtsumaruConsts, AtsumaruServerDataSave } from "../atsumaru/atsumaru";
import { Globals } from "../globals";
import { Sheet } from "../objects/sheet/sheet";
import { SceneMain } from "../scene/scene-main";
import { LocalStorage } from "../common/local-storage";

/**
 * ログインボーナス表示
 */
export class LoginBonus extends Behavior {

    private scene: SceneMain;
    private loginBonus: LoginBonusData;
    private serverDataSave: AtsumaruServerDataSave;
    private sheet: Sheet | null;
    private currentIndex: number;
    private currentBonus: number;
    private step: number;
    private isEnd: boolean;
    private debugAtsumaruCheckSkip: boolean = false; //trueの場合デバッグでアツマール有効状態


    private static Step = {
        INIT: 0,

        SHEET_IN: 10,
        SHEET_IN_WAIT: 11,

        STAMP_ON: 20,
        STAMP_ON_WAIT: 21,

        SAVE_DATA: 30,
        SAVE_DATA_WAIT: 31,

        SHEET_CHANGE: 40,
        SHEET_CHANGE_WAIT: 41,

        NEXT_BONUS: 50,
        NEXT_BONUS_WAIT: 51,

        NOTICE: 60,
        NOTICE_WAIT: 61,

        SHEET_OUT: 70,
        SHEET_OUT_WAIT: 71,

        END: 1000,
    }

    /**
     * コンストラクタ
     * @param scene シーン
     */
    constructor(scene: SceneMain) {
        super('LoginBonus');

        this.scene = scene;
        this.loginBonus = new LoginBonusData();
        this.serverDataSave = new AtsumaruServerDataSave();
        this.currentIndex = 0;
        this.currentBonus = 0;
        this.sheet = null;
        this.step = LoginBonus.Step.INIT;
        this.isEnd = false;
    }

    //extends Behavior
    /**
     * 更新処理
     */
    initialize(): void {
        //アツマール有効チェック
        // if (!AtsumaruBase.isValid() && !this.debugAtsumaruCheckSkip) {
        //     //アツマールが使えない場合はとりあえず100枚配る
        //     Globals.get().setMedal(100);
        //     this._onEnd();
        //     return;
        // }

        //ログボデータのセットアップ
        this._initLoginBonusData();
        if (!this.loginBonus.isReceitable()) {
            Log.put('today bonus already receipt.', 'LoginBonus');
            const serverData = Globals.get().getServerData();
            //メダル復帰
            {
                const value = serverData.get(AtsumaruConsts.Data.MEDAL);
                if (value != null) {
                    const medal = parseInt(value);
                    Globals.get().setMedal(medal);
                }
            }

            //本日受領済みの場合は終了
            this._onEnd();
            return;
        }
        else {
            Log.put('today bonus not receipt.', 'LoginBonus');
        }

        this.sheet = new Sheet(this.scene, this.loginBonus);
        this.step = LoginBonus.Step.INIT;
    }

    /**
     * 更新処理
     */
    update(): void {
        switch (this.step) {
            case LoginBonus.Step.INIT: {
                this._stepInit();
                break;
            }

            case LoginBonus.Step.SHEET_IN: {
                this._stepSheetIn();
                break;
            }
            case LoginBonus.Step.SHEET_IN_WAIT: {
                this._stepSheetInWait();
                break;
            }

            case LoginBonus.Step.STAMP_ON: {
                this._stepStampOn();
                break;
            }
            case LoginBonus.Step.STAMP_ON_WAIT: {
                this._stepStampOnWait();
                break;
            }

            case LoginBonus.Step.SAVE_DATA: {
                this._stepSaveData();
                break;
            }
            case LoginBonus.Step.SAVE_DATA_WAIT: {
                // this._stepSaveDataWait();
                break;
            }

            case LoginBonus.Step.SHEET_CHANGE: {
                this._stepSheetChange();
                break;
            }
            case LoginBonus.Step.SHEET_CHANGE_WAIT: {
                this._stepSheetChangeWait();
                break;
            }

            case LoginBonus.Step.NEXT_BONUS: {
                this._stepNextBonus();
                break;
            }
            case LoginBonus.Step.NEXT_BONUS_WAIT: {
                this._stepNextBonusWait();
                break;
            }

            case LoginBonus.Step.NOTICE: {
                this._stepNotice();
                break;
            }
            case LoginBonus.Step.NOTICE_WAIT: {
                this._stepNoticeWait();
                break;
            }

            case LoginBonus.Step.SHEET_OUT: {
                this._stepSheetOut();
                break;
            }
            case LoginBonus.Step.SHEET_OUT_WAIT: {
                this._stepSheetOutWait();
                break;
            }

            case LoginBonus.Step.END: {
                break;
            }
        }
    }

    /**
     * 終了処理
     */
    finalize(): void {

    }

    /**
     * 表示が終了したかチェックする
     * @returns 表示が終了した場合は true 、そうでない場合は false を返す。
     */
    isFinished(): boolean {
        return this.isEnd;
    }

    // 初期化ステップ
    private _stepInit(): void {
        this.step = LoginBonus.Step.SHEET_IN;
    }

    // シートがスライドして入ってくるステップ
    private _stepSheetIn(): void {
        this.sheet?.setupStart();
        this.sheet?.startSheetIn();
        this.step = LoginBonus.Step.SHEET_IN_WAIT;
    }

    // シードスライドまちステップ
    private _stepSheetInWait(): void {
        if (this.sheet != null) {
            if (this.sheet.isEnd()) {
                this.step = LoginBonus.Step.STAMP_ON;
            }
        }
        else {
            this.step = LoginBonus.Step.STAMP_ON;
        }
    }

    // スタンプアニメ開始ステップ
    private _stepStampOn(): void {
        this.sheet?.setupStamp();
        this.sheet?.startStamp();
        this.step = LoginBonus.Step.STAMP_ON_WAIT;
    }

    // スタンプアニメ終了まちステップ
    private _stepStampOnWait(): void {
        if (this.sheet != null) {
            if (this.sheet.isEnd()) {
                this.step = LoginBonus.Step.SAVE_DATA;
            }
        }
        else {
            this.step = LoginBonus.Step.SAVE_DATA;
        }
    }

    // ログボデータをセーブするステップ
    private _stepSaveData(): void {
        this.step = LoginBonus.Step.SAVE_DATA_WAIT;

        //ログインデータを更新
        this.loginBonus.next();
        const jsonLoginBonus = this.loginBonus.toJson();
        const jsonMedal = this.currentBonus.toString();

        const serverData = Globals.get().getServerData();
        serverData.set(AtsumaruConsts.Data.BONUS, jsonLoginBonus);
        serverData.set(AtsumaruConsts.Data.MEDAL, jsonMedal);
        // serverData.set(AtsumaruConsts.Data.HIGHEST, jsonMedal);

        const storageItem = serverData.getDirtyData();
        storageItem.forEach(element => {
            Log.put(`key:${element.key} value:${element.value}`, 'LoginBonus._stepSaveData');
        });

        if (AtsumaruBase.isValid()) {
            this.serverDataSave.save(storageItem, (stat: number) => {
                this._stepSaveDataWait(stat);
            });
        }
        else {
            LocalStorage.saveLocalData(storageItem, (stat: number) => {
                this._stepSaveDataWait(stat);
            });
        }

    }

    // ログボデータセーブまちステップ
    private _stepSaveDataWait(stat: number): void {
        //通信の成功可否は見ない。失敗しても先に進ませる
        Log.put(`saveServerData result:${stat}.`, 'LoginBonus._stepSaveDataWait');

        //変更フラグを下ろす
        const serverData = Globals.get().getServerData();
        serverData.resetDirty(AtsumaruConsts.Data.BONUS);
        serverData.resetDirty(AtsumaruConsts.Data.MEDAL);
        // serverData.resetDirty(AtsumaruConsts.Data.HIGHEST);

        //メダルをセット
        Globals.get().setMedal(this.currentBonus);

        const bonusCount = this.loginBonus.getBonusCount();
        if (this.currentIndex + 1 >= bonusCount) {
            //シートが溜まったので、次のシートに切り替える
            this.step = LoginBonus.Step.SHEET_CHANGE;
        }
        else {
            //次のボーナス
            this.step = LoginBonus.Step.NEXT_BONUS;
        }
    }

    // シートを切り替えるステップ
    private _stepSheetChange(): void {
        this.sheet?.startSheetChange();
        this.step = LoginBonus.Step.SHEET_CHANGE_WAIT;
    }

    // シート切り替えまちステップ
    private _stepSheetChangeWait(): void {
        if (this.sheet != null) {
            if (this.sheet.isEnd()) {
                this.step = LoginBonus.Step.NEXT_BONUS;
            }
        }
        else {
            this.step = LoginBonus.Step.NEXT_BONUS;
        }
    }

    // 次回ボーナス表示ステップ
    private _stepNextBonus(): void {
        this.sheet?.startNextBonus();
        this.step = LoginBonus.Step.NEXT_BONUS_WAIT;
    }

    // 次回ボーナス表示まちステップ
    private _stepNextBonusWait(): void {
        if (this.sheet != null) {
            if (this.sheet.isEnd()) {
                this.step = LoginBonus.Step.NOTICE;
            }
        }
        else {
            this.step = LoginBonus.Step.NOTICE;
        }
    }

    // 注意表示ステップ
    private _stepNotice(): void {
        this.step = LoginBonus.Step.NOTICE_WAIT;

    }

    // 注意表示まちステップ
    private _stepNoticeWait(): void {
        this.step = LoginBonus.Step.SHEET_OUT;
    }


    // シートがスライドして出ていくステップ
    private _stepSheetOut(): void {
        this.sheet?.startSheetOut();
        this.step = LoginBonus.Step.SHEET_OUT_WAIT;
    }

    // シートスライドまちステップ
    private _stepSheetOutWait(): void {
        if (this.sheet != null) {
            if (this.sheet.isEnd()) {
                this._onEnd();
                this.step = LoginBonus.Step.END;
            }
        }
        else {
            this._onEnd();
            this.step = LoginBonus.Step.END;
        }
    }

    // ログボデータを初期化する
    private _initLoginBonusData(): void {
        const serverDate = Globals.get().getServerData();
        let bonus = serverDate.get(AtsumaruConsts.Data.BONUS);
        if (bonus == null) {
            bonus = ''; //データがまだない場合は空文字列を入れておく
        }

        //データの復帰を行う
        this.loginBonus.restore(bonus);
        //整合性チェック
        if (!this.loginBonus.isValid()) {
            //不正なデータの場合はリセット
            this.loginBonus.reset();
            Log.put('loginBonus Invalid. data reset.', 'LoginBonus');

        }
        //連続プレーチェック
        if (this.loginBonus.isReceitable()) {
            if (!this.loginBonus.isSeries()) {
                //連続プレーが途切れているのでリセット
                this.loginBonus.reset();
                Log.put('loginBonus.isSeries() flase. data reset.', 'LoginBonus');
            }
        }


        const cur = this.loginBonus.getCurrentBonus();
        this.currentIndex = cur.index;
        this.currentBonus = cur.bonus;
    }

    // 終了時の処理
    private _onEnd(): void {
        this.step = LoginBonus.Step.END;
        this.isEnd = true;
    }
}