import { FloorBase } from "@/data/floor";

import { ubicateFloors } from "@/data/gameData/ubicateFloors";
// import { GameUI } from "@/data/gameData/UI";
import { Entity } from "@/data/player/entity";

import { Mettols } from "@/data/enemys/Character/mettol/mettol";
// import BeeTank from "@/data/enemys/Character/beeTank/beetank";
// import { CannonDumb } from "@/data/enemys/Character/cannon/cannonDumb";
// import { ToleteEnemy } from "@/data/enemys/tolete";
import { GAME } from "../../sceneManager";
import { BattleScene } from "../battleScene";
import { matrix } from "@/data/floor/matrixForFloor";
import { BackGround } from "@/newUI/backGround/backGroundShow";
import { BATTLE_MANAGER } from "./battleManager";
// import { ToleteEnemy } from "@/data/enemys/tolete";

// const allEnemies = [Mettols, BeeTank, CannonDumb, ToleteEnemy];

export class BatleGame {
  bg = new BackGround(3);
  floors: FloorBase[] = [];
  gameIsPaused = true;
  isDev = true;
  // effect = [];
  // npc = [];

  matrix = matrix;

  // gameUI = new GameUI(this);
  timeForSelectShip = 1000;
  currentTimeForSelectShip = 0;
  isCompletedBarShip = false;
  canTembleCanvas = false;
  tembleCanvas = 0;
  canvasTime = 0;
  currentMove = 50;
  hasEnemys = false;
  timeInBattle = 0;
  totalTimeInBattle = 0;
  battleScene: BattleScene;
  constructor(battleScene: BattleScene) {
    this.floors = ubicateFloors({ array: matrix, blockSize: 64, gapX: 6.5 });
    this.initGame();
    this.battleScene = battleScene;
  }

  startNewBattle({ backGround = 0, floorImage = 0 }) {
    this.bg.updateBackGround(backGround);
    BATTLE_MANAGER.clearEntites();

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

    this.floors.forEach((floor) => {
      floor.updateImageFloor(floorImage);
    });

    // const randomeEnemy =
    //   allEnemies[Math.floor(Math.random() * allEnemies.length)];
    // const randomPosition = {
    //   x: Math.floor(Math.random() * 2),
    //   y: Math.floor(Math.random() * 2),
    // };
    // const randomLevel = Math.floor(Math.random() * 3 + 1);

    this.addNewEnemy({
      newEnemy: Mettols,
      position: { x: 1, y: 1 },
      level: 1,
    });
  }
  initGame() {
    [...BATTLE_MANAGER.npc, BATTLE_MANAGER.player].forEach((entity) => {
      entity.game = this;
    });
  }
  draw(deltaTime: number, c: CanvasRenderingContext2D) {
    c.save();
    if (this.canTembleCanvas) {
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

    this.matrix.forEach((_, indexY) => {
      this.levelToPaint(c, deltaTime, indexY);
      this.levelToPaintAttack(c, deltaTime, indexY);
    });

    BATTLE_MANAGER.validateCollisionEnemys();

    BATTLE_MANAGER.runFilters();
    this.showAllAttacks();
    c.restore();
    // this.gameUI.draw(c, deltaTime);
  }
  update(deltaTime: number, c: CanvasRenderingContext2D) {
    // BATTLE_MANAGER.runFilters();
    console.log(BATTLE_MANAGER.effect);
    if (!GAME.hasFocus()) {
      this.gameIsPaused = true;
      return;
    } else {
      this.gameIsPaused = false;
    }

    this.hasEnemys = BATTLE_MANAGER.npc.length > 0;
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
      if (!BATTLE_MANAGER.playerIsLive()) {
        GAME.changeScene(GAME.statesKeys.home);
      }
    }

    this.floors.forEach((floor: FloorBase) => {
      floor.update(c, deltaTime);
    });
    if (!this.isCompletedBarShip) {
      if (this.currentTimeForSelectShip > this.timeForSelectShip) {
        this.isCompletedBarShip = true;
      } else {
        this.currentTimeForSelectShip += deltaTime;
      }
    }
  }
  drawFloors(c: CanvasRenderingContext2D, deltaTime: number) {
    this.floors
      .sort((a, b) => b.y + a.y)
      .forEach((entity: FloorBase) => {
        entity.draw(c, deltaTime);
        entity.floors = this.floors;
        entity.validateAttack(BATTLE_MANAGER.effect);

        entity.game = this;
      });
  }
  levelToPaint(c: CanvasRenderingContext2D, deltaTime: number, row: number) {
    BATTLE_MANAGER.levelToPaint(c, deltaTime, row, this.gameIsPaused);
  }
  levelToPaintAttack(
    c: CanvasRenderingContext2D,
    deltaTime: number,
    row: number
  ) {
    BATTLE_MANAGER.levelToPaintAttack(c, deltaTime, row, this.gameIsPaused);
  }
  showAllAttacks() {
    BATTLE_MANAGER.extractAttacks();
  }
  checkClick(mouseX: number, mouseY: number) {
    // this.gameUI.checkClick(mouseX, mouseY);
  }
  addNewEnemy({ newEnemy, position, level }) {
    BATTLE_MANAGER.addNewEnemy({ newEnemy, position, level });
  }
  addPlayerElement({ element, player }) {
    const newElement = new element({
      possition: { x: player.matrixX + 1, y: player.matrixY },
      sideToPlay: player.side,
    });
    newElement.game = this;
    newElement.sideToPlay = player.side;

    BATTLE_MANAGER.npc.push(newElement);
  }
  breackFloor(posX: number, posY: number) {
    const findFloor = this.floors.findIndex(
      (floor) => floor.matrixX == posX && floor.matrixY == posY
    );

    this.floors[findFloor]?.breakFloor();
  }
  brackAllFloor(characterData: Entity, _: number) {
    const timeOut = 300;
    const side = characterData.side;
    this.floors.forEach((floor) => {
      let defineTime = 0;
      if (side == 0) {
        defineTime = floor.matrixX * timeOut;
      } else {
        if (floor.matrixX == 0) {
          defineTime = 3 * timeOut;
        }
        if (floor.matrixX == 1) {
          defineTime = 2 * timeOut;
        }
        if (floor.matrixX == 2) {
          defineTime = 1 * timeOut;
        }
      }

      if (floor.side != side) {
        setTimeout(() => {
          floor.breakFloor();
        }, defineTime);
        // floor.breakFloor();
      }
    });
  }
  destroyEspecificFloor(characterData: Entity, tipe: 1 | 3) {
    const side = characterData.side;
    const matrixX = characterData.matrixX;
    const matrixY = characterData.matrixY;
    if (tipe == 1) {
      const nextFloor = side == 0 ? 1 : -1;
      this.destroyFloor(matrixX + nextFloor, matrixY);
    } else if (tipe == 3) {
      const nextFloor = side == 0 ? 1 : -1;
      this.matrix.forEach((_, indexY) => {
        this.destroyFloor(matrixX + nextFloor, indexY);
      });
    }
  }
  addNewLineFloor(characterData: any, _: number) {
    const side = characterData.side;
    if (side == 0) {
      this.matrix.forEach((row, indexY) => {
        let noChangeYet = false;
        row.forEach((floor, indexX) => {
          const findFloor = this.floors.findIndex(
            (floor) => floor.matrixX == indexX && floor.matrixY == indexY
          );
          if (this.floors[findFloor].isChangeFloor) {
            this.floors[findFloor].limitTimeForChangeFloor +=
              this.floors[findFloor].timeToChangeFloor;
          }
          if (floor.side != side && !noChangeYet) {
            noChangeYet = true;

            this.floors[findFloor]?.changeFloor();
          }
        });
      });
    } else if (side == 1) {
      // Iterar de mayor a menor
      for (let indexY = this.matrix.length - 1; indexY >= 0; indexY--) {
        let noChangeYet = false;
        for (
          let indexX = this.matrix[indexY].length - 1;
          indexX >= 0;
          indexX--
        ) {
          const floor = this.matrix[indexY][indexX];
          const findFloor = this.floors.findIndex(
            (floor) => floor.matrixX == indexX && floor.matrixY == indexY
          );
          if (this.floors[findFloor].isChangeFloor) {
            this.floors[findFloor].limitTimeForChangeFloor +=
              this.floors[findFloor].timeToChangeFloor;
          }
          if (floor.side != side && !noChangeYet) {
            noChangeYet = true;
            this.floors[findFloor]?.changeFloor();
          }
        }
      }
    }
  }
  destroyRandomFloor(characterData: Entity, _: number) {
    const side = characterData.side;
    const floors = this.floors.filter(
      (floor) =>
        floor.side != side && floor.characterFloor == null && floor.isVisible
    );

    const random = Math.floor(Math.random() * floors.length);

    floors[random]?.unAvailableFloor();
  }
  destroyFloor(posX: number, posY: number) {
    const findFloor = this.floors.findIndex(
      (floor) => floor.matrixX == posX && floor.matrixY == posY
    );

    this.floors[findFloor]?.unAvailableFloor();
  }
  makeGameTemble(time: number = 1000) {
    this.canTembleCanvas = true;
    setTimeout(() => {
      this.canTembleCanvas = false;
    }, time);
  }
}
