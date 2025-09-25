import {
  GAME_IS_BATTLE,
  GAME_SET_PAUSE,
  GAME_SET_BATTLE,
  GAME_SET_UNBATTLE,
  GAME_SET_UNPAUSE,
  GAME_IS_PAUSE,
} from "./gameState";
import { GAME } from "../../sceneManager";
import { FLOOR_MANAGER } from "../sources/floorManager";
import { ENTITY_MANAGER } from "../sources/entityManager";
import { Mettols } from "@/data/enemys/Character/mettol/mettol";
import { PauseMenu } from "../../../newUI/menu/pauseMenu";
import { ShowChipAreaWithChip } from "../UI/chipAreaSelect";
import { BattleUI } from "../UI/batleUi";

class BattleManager {
  static instance: BattleManager;

  menuScreen = new PauseMenu();
  chipAreaSelect = new ShowChipAreaWithChip();
  battleUI = new BattleUI();
  isCompletedBarShip = false;
  currentTimeForSelectShip = 0;
  timeForSelectShip = 5000;
  localIsBattle = false;
  timeForBattleStart = 2;

  flashBarTime = 0;

  sizeBar = 256;
  frameHeight = 48;
  static getInstance() {
    if (!BattleManager.instance) {
      BattleManager.instance = new BattleManager();
    }
    return BattleManager.instance;
  }
  constructor() {
    if (!BattleManager.instance) {
      BattleManager.instance = this;
    }
    return BattleManager.instance;
  }
  inBattle({
    backGround,
    floorImage,
  }: {
    backGround: number;
    floorImage: number;
  }) {
    this.localIsBattle = true;
    if (!GAME_IS_BATTLE()) {
      GAME.changeScene(GAME.statesKeys.battle);

      GAME.currentScene.gameBattle.bg.updateBackGround(backGround);

      FLOOR_MANAGER.initFloors();
      ENTITY_MANAGER.initBattle();
      FLOOR_MANAGER.updateImageFloors(floorImage);

      // // GAME_SET_PAUSE();
      if (!GAME_IS_BATTLE()) {
        GAME_SET_PAUSE();
        GAME_SET_BATTLE();
        this.isCompletedBarShip = false;
        this.localIsBattle = true;
        this.timeForBattleStart = 1;
        const timeForBattleStart = setInterval(() => {
          this.timeForBattleStart--;
          if (this.timeForBattleStart == 0) {
            clearInterval(timeForBattleStart);
            GAME_SET_UNPAUSE();
            this.localIsBattle = false;
            this.chipAreaSelect.showArea();
          }
        }, 1000);
      }

      // // this.gameUI.clearImagePosition = {
      // //   x: -this.gameUI.clearImageViewPort,
      // //   y: this.gameUI.clearImagePosition.y,
      // // };
      GAME.currentScene.timeInBattle = 0;
      GAME.currentScene.totalTimeInBattle = 0;
      GAME.currentScene.currentTimeForSelectShip = 0;
      GAME.currentScene.canvasTime = 0;

      ENTITY_MANAGER.addNewEnemy({
        newEnemy: Mettols,
        position: { x: 1, y: 1 },
        level: 1,
      });
    }
  }
  outBattle() {
    GAME_SET_UNBATTLE();
    GAME_SET_UNPAUSE();
    setTimeout(() => {
      GAME.changeScene(GAME.statesKeys.world);
      FLOOR_MANAGER.matrix = null;
      ENTITY_MANAGER.player = null;
      FLOOR_MANAGER.floors = [];
    }, 1000);
  }
  draw(c: CanvasRenderingContext2D, deltaTime: number) {
    this.update(deltaTime, c);

    this.menuScreen.draw(c, deltaTime);
    this.showMessage(c, "Battle UI", 150);

    if (this.localIsBattle) {
      this.showMessage(c, "BATTLE START", 50);
      this.showMessage(c, this.timeForBattleStart.toString(), 20);
    }

    // Draw pause
    if (GAME_IS_PAUSE() && !this.localIsBattle) {
      this.showMessage(c, "PAUSE", 50);
    }

    // this.battleUI.updateFrame(c, deltaTime, this.isCompletedBarShip);
    //
    this.fillBar(c);
  }
  showMessage(c: CanvasRenderingContext2D, message: string, head: number) {
    c.textAlign = "center";
    c.fillText(message, 430 / 2, 430 / 2 - (head || 0));
  }
  update(deltaTime: number, c: CanvasRenderingContext2D) {
    if (!this.isCompletedBarShip && this.timeForBattleStart == 0) {
      this.currentTimeForSelectShip += deltaTime;
      if (this.currentTimeForSelectShip >= this.timeForSelectShip) {
        this.isCompletedBarShip = true;
      }
    }
    this.flashBarTime += deltaTime;
    if (this.flashBarTime >= 400) {
      this.flashBarTime = 0;
    }
  }
  fillBar(c: CanvasRenderingContext2D) {
    if (!GAME_IS_BATTLE()) {
      return;
    }
    this.battleUI.paintBarContainer(c);
    // console.log("this.currentTimeForSelectShip", this.currentTimeForSelectShip);

    const currentProgressBarr =
      (this.currentTimeForSelectShip / this.timeForSelectShip) * this.sizeBar;
    c.fillStyle = this.isCompletedBarShip
      ? this.flashBarTime < 200
        ? "#ffff0090"
        : "#ff003099"
      : "#ff003059";
    c.fillRect(
      this.battleUI.position.x + 22,
      this.battleUI.position.y + 28,
      currentProgressBarr,
      this.frameHeight - 33
    );
    if (this.isCompletedBarShip) {
      this.battleUI.showMSJBar(c);
    }
  }
}

export const BATTLE_MANAGER = BattleManager.getInstance();
