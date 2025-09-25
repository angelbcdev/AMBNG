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

class BattleManager {
  static instance: BattleManager;

  menuScreen = new PauseMenu();
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
        GAME.currentScene.gameBattle.initBattle();
      }

      // // this.gameUI.clearImagePosition = {
      // //   x: -this.gameUI.clearImageViewPort,
      // //   y: this.gameUI.clearImagePosition.y,
      // // };
      GAME.currentScene.timeInBattle = 0;
      GAME.currentScene.totalTimeInBattle = 0;
      GAME.currentScene.currentTimeForSelectShip = 0;
      GAME.currentScene.canvasTime = 0;

      GAME.currentScene.isCompletedBarShip = false;

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
    this.menuScreen.draw(c, deltaTime);
    this.showMessage(c, "Battle UI");

    // Draw pause
    if (GAME_IS_PAUSE()) {
      this.showMessage(c, "PAUSE");
    }
  }
  showMessage(c: CanvasRenderingContext2D, message: string) {
    c.textAlign = "center";
    c.fillText(message, 430 / 2, 430 / 2);
  }
  update(deltaTime: number, c: CanvasRenderingContext2D) {}
}

export const BATTLE_MANAGER = new BattleManager();
