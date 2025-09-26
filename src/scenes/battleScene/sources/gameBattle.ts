import { FLOOR_MANAGER } from "@/core/floorManager";
import { GAME } from "@/scenes/sceneManager";
import { ENTITY_MANAGER } from "@/core/entityManager";
import {
  GAME_IS_BATTLE,
  GAME_SET_PAUSE,
  GAME_SET_UNBATTLE,
} from "@/core/gameState";
import { BATTLE_MANAGER } from "@/core/battleManager";

export class BatleGame {
  tembleCanvas = 0;
  canvasTime = 0;
  currentMove = 50;
  hasEnemys = false;
  timeInBattle = 0;
  totalTimeInBattle = 0;

  timeForBattleStart = 3;
  localIsBattle = false;

  constructor() {}

  draw(deltaTime: number, c: CanvasRenderingContext2D) {
    // draw background
    BATTLE_MANAGER.drawBackground(c, deltaTime);

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

    if (BATTLE_MANAGER.chipAreaSelect.showChipArea) {
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

    // draw floors
    FLOOR_MANAGER.drawFloors(c, deltaTime, ENTITY_MANAGER.effect);

    // draw entities and effects per row
    FLOOR_MANAGER.matrix?.forEach((_, indexY) => {
      ENTITY_MANAGER.levelToPaint(c, deltaTime, indexY);
      ENTITY_MANAGER.levelToPaintAttack(c, deltaTime, indexY);
    });

    ENTITY_MANAGER.validateCollisionEnemys();

    ENTITY_MANAGER.runFilters();
    ENTITY_MANAGER.extractAttacks();
    c.restore();

    BATTLE_MANAGER.draw(c, deltaTime);
  }
  showMessage(c: CanvasRenderingContext2D, message: string, head?: boolean) {
    c.fillText(message, 430 / 2, 430 / 2 - (head ? 50 : 20));
  }
  update(deltaTime: number, c: CanvasRenderingContext2D) {
    if (!GAME.hasFocus()) {
      GAME_SET_PAUSE();
      return;
    }

    //* FINISHED BATTLE

    if (!ENTITY_MANAGER.hasEnemys()) {
      //* this.gameUI.clearStateImg(c, deltaTime, this.totalTimeInBattle);
      if (GAME_IS_BATTLE()) {
        GAME_SET_UNBATTLE();
        BATTLE_MANAGER.completeScreen.showScreen();
      }
    } else {
      if (this.timeInBattle > 1000) {
        this.timeInBattle = 0;
        this.totalTimeInBattle++;
      } else {
        this.timeInBattle += deltaTime;
      }
      if (!ENTITY_MANAGER.playerIsLive()) {
        //* IS DEATH
        GAME.changeScene(GAME.statesKeys.home);
      }
    }

    FLOOR_MANAGER.updateFloors(c, deltaTime);
  }

  checkClick(_: number, __: number) {
    // this.gameUI.checkClick(mouseX, mouseY);
  }
}
