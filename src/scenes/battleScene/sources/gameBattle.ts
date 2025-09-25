import { FLOOR_MANAGER } from "./floorManager";
import { GAME } from "../../sceneManager";
import { BattleScene } from "../battleScene";

import { BackGround } from "@/newUI/backGround/backGroundShow";
import { ENTITY_MANAGER } from "./entityManager";
import {
  GAME_IS_BATTLE,
  GAME_IS_PAUSE,
  GAME_SET_PAUSE,
  GAME_SET_UNPAUSE,
} from "./gameState";
import { BATTLE_MANAGER } from "./battleManager";
// import { ToleteEnemy } from "@/data/enemys/tolete";

// const allEnemies = [Mettols, BeeTank, CannonDumb, ToleteEnemy];

export class BatleGame {
  bg = new BackGround(3);
  timeForSelectShip = 1000;
  currentTimeForSelectShip = 0;
  isCompletedBarShip = false;

  tembleCanvas = 0;
  canvasTime = 0;
  currentMove = 50;
  hasEnemys = false;
  timeInBattle = 0;
  totalTimeInBattle = 0;
  battleScene: BattleScene;

  timeForBattleStart = 3;
  localIsBattle = false;

  constructor(battleScene: BattleScene) {
    this.battleScene = battleScene;
  }

  initBattle() {
    this.localIsBattle = true;
    this.timeForBattleStart = 2;
    const timeForBattleStart = setInterval(() => {
      this.timeForBattleStart--;
      if (this.timeForBattleStart == 0) {
        clearInterval(timeForBattleStart);
        GAME_SET_UNPAUSE();
        this.localIsBattle = false;
      }
    }, 1000);
  }

  draw(deltaTime: number, c: CanvasRenderingContext2D) {
    c.save();
    if (FLOOR_MANAGER.canTembleCanvas) {
      if (this.canvasTime > 50) {
        this.tembleCanvas++;
        this.canvasTime = 0;
      } else {
        c.translate(this.tembleCanvas % 2 ? 1.8 : -1.8, 0);
        this.canvasTime += deltaTime;
      }
    }
    if (this.battleScene.chipAreaSelect.showChipArea) {
      if (this.currentMove < 100) {
        this.currentMove += 2;
      }
      c.fillStyle = "rgba(0,0,0,0.6)";
      c.fillRect(0, 0, 430, 400);
    } else {
      if (this.currentMove > 50) {
        this.currentMove -= 2;
      }
      c.globalAlpha = 1;
    }
    c.translate(0, this.currentMove);

    this.drawFloors(c, deltaTime);

    // draw entities and effects per row
    FLOOR_MANAGER.matrix.forEach((_, indexY) => {
      ENTITY_MANAGER.levelToPaint(c, deltaTime, indexY);
      ENTITY_MANAGER.levelToPaintAttack(c, deltaTime, indexY);
    });

    ENTITY_MANAGER.validateCollisionEnemys();

    ENTITY_MANAGER.runFilters();
    ENTITY_MANAGER.extractAttacks();
    c.restore();

    if (this.localIsBattle) {
      this.showMessage(c, "BATTLE START", true);
      this.showMessage(c, this.timeForBattleStart.toString(), false);
    }
    if (!this.localIsBattle && GAME_IS_PAUSE()) {
      this.showMessage(c, "PAUSE", true);
    }
    BATTLE_MANAGER.draw(c, deltaTime);
    // this.gameUI.draw(c, deltaTime);
  }
  showMessage(c: CanvasRenderingContext2D, message: string, head?: boolean) {
    c.fillText(message, 430 / 2, 430 / 2 - (head ? 50 : 20));
  }
  update(deltaTime: number, c: CanvasRenderingContext2D) {
    // ENTITY_MANAGER.runFilters();

    if (!GAME.hasFocus()) {
      GAME_SET_PAUSE();
      return;
    }

    //* FINISHED BATTLE
    this.hasEnemys = ENTITY_MANAGER.npc.length > 0;
    if (!this.hasEnemys) {
      //* this.gameUI.clearStateImg(c, deltaTime, this.totalTimeInBattle);
      if (GAME_IS_BATTLE()) {
        BATTLE_MANAGER.outBattle();
      }
    } else {
      if (this.timeInBattle > 1000) {
        this.timeInBattle = 0;
        this.totalTimeInBattle++;
      } else {
        this.timeInBattle += deltaTime;
      }
      if (!ENTITY_MANAGER.playerIsLive()) {
        GAME.changeScene(GAME.statesKeys.home);
      }
    }

    FLOOR_MANAGER.updateFloors(c, deltaTime);

    if (!this.isCompletedBarShip) {
      if (this.currentTimeForSelectShip > this.timeForSelectShip) {
        this.isCompletedBarShip = true;
      } else {
        this.currentTimeForSelectShip += deltaTime;
      }
    }
  }
  drawFloors(c: CanvasRenderingContext2D, deltaTime: number) {
    FLOOR_MANAGER.drawFloors(c, deltaTime, ENTITY_MANAGER.effect);
  }

  checkClick(mouseX: number, mouseY: number) {
    // this.gameUI.checkClick(mouseX, mouseY);
  }
}
