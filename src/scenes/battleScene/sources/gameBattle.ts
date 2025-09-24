import { FLOOR_MANAGER } from "./floorManager";
import { Mettols } from "@/data/enemys/Character/mettol/mettol";
// import BeeTank from "@/data/enemys/Character/beeTank/beetank";
// import { CannonDumb } from "@/data/enemys/Character/cannon/cannonDumb";
// import { ToleteEnemy } from "@/data/enemys/tolete";
import { GAME } from "../../sceneManager";
import { BattleScene } from "../battleScene";

import { BackGround } from "@/newUI/backGround/backGroundShow";
import { ENTITY_MANAGER } from "./entityManager";
// import { ToleteEnemy } from "@/data/enemys/tolete";

// const allEnemies = [Mettols, BeeTank, CannonDumb, ToleteEnemy];

export class BatleGame {
  bg = new BackGround(3);

  gameIsPaused = true;

  // effect = [];
  // npc = [];

  // gameUI = new GameUI(this);
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
  constructor(battleScene: BattleScene) {
    this.battleScene = battleScene;
  }

  startNewBattle({ backGround = 0, floorImage = 0 }) {
    this.bg.updateBackGround(backGround);
    ENTITY_MANAGER.initBattle();

    // this.gameUI.clearImagePosition = {
    //   x: -this.gameUI.clearImageViewPort,
    //   y: this.gameUI.clearImagePosition.y,
    // };
    this.timeInBattle = 0;
    this.totalTimeInBattle = 0;
    this.currentTimeForSelectShip = 0;
    this.canvasTime = 0;
    this.gameIsPaused = true;
    this.isCompletedBarShip = false;

    setTimeout(() => {
      this.gameIsPaused = false;
    }, 3000);

    FLOOR_MANAGER.updateImageFloors(floorImage);

    // const randomeEnemy =
    //   allEnemies[Math.floor(Math.random() * allEnemies.length)];
    // const randomPosition = {
    //   x: Math.floor(Math.random() * 2),
    //   y: Math.floor(Math.random() * 2),
    // };
    // const randomLevel = Math.floor(Math.random() * 3 + 1);

    ENTITY_MANAGER.addNewEnemy({
      newEnemy: Mettols,
      position: { x: 1, y: 1 },
      level: 1,
    });
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
      ENTITY_MANAGER.levelToPaintAttack(
        c,
        deltaTime,
        indexY,
        this.gameIsPaused
      );
    });

    ENTITY_MANAGER.validateCollisionEnemys();

    ENTITY_MANAGER.runFilters();
    ENTITY_MANAGER.extractAttacks();
    c.restore();
    // this.gameUI.draw(c, deltaTime);
  }
  update(deltaTime: number, c: CanvasRenderingContext2D) {
    // ENTITY_MANAGER.runFilters();

    if (!GAME.hasFocus()) {
      this.gameIsPaused = true;
      return;
    } else {
      this.gameIsPaused = false;
    }

    this.hasEnemys = ENTITY_MANAGER.npc.length > 0;
    if (!this.hasEnemys) {
      // this.gameUI.clearStateImg(c, deltaTime, this.totalTimeInBattle);
      setTimeout(() => {
        GAME.changeScene(GAME.statesKeys.world);
      }, 2000);
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
