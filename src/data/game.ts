import { BackGround } from "./backGround";
import { Entity } from "./character/entity";
import PlayerBlue from "./character/player/Player";

import { FloorBase } from "./floor";
import { matrix } from "./gameData/matrix";

import { ubicateFloors } from "./gameData/ubicateFloors";
import { GameUI } from "./gameData/UI";

export class Game {
  floors: FloorBase[] = [];
  gameIsPaused = false;
  isDev = true;
  effect = [];
  npc = [];
  bg = new BackGround({ width: 430, height: 400 }, 3);
  matrix = matrix;
  players = [
    new PlayerBlue({
      possition: { x: 1, y: 1 },
      sideToPlay: 0,
    }),
  ];
  gameUI = new GameUI(this);
  timeForSelectShip = 1000;
  currentTimeForSelectShip = 0;
  isCompletedBarShip = false;
  canTembleCanvas = false;
  tembleCanvas = 0;
  canvasTime = 0;
  currentMove = 50;
  constructor() {
    this.floors = ubicateFloors({ array: matrix, blockSize: 64, gapX: 6.5 });
    this.initGame();
  }
  initGame() {
    [...this.npc, ...this.players].forEach((entity) => {
      entity.game = this;
    });
  }
  draw(c: CanvasRenderingContext2D, deltaTime: number) {
    this.bg.draw(c, deltaTime);
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
    if (this.gameUI.chipSelected.showChipArea) {
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

    [...this.npc].forEach((entity: Entity) => {
      entity?.collisionArea(this.players[0]);
    });
    this.showAllAttacks();
    c.restore();
    this.gameUI.draw(c, deltaTime);
  }
  update(c: CanvasRenderingContext2D, deltaTime: number) {
    if (this.gameIsPaused) return;

    this.npc = this.npc.filter((enemy: Entity) => {
      if (enemy.delete) {
        this.matrix[enemy.matrixY][enemy.matrixX].ocupated = false;
      }
      return enemy.delete !== true;
    });
    this.effect = this.effect.filter(
      (effect: Entity) => effect.delete !== true
    );
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
        entity.validateAttack(this.effect);

        entity.game = this;
      });
  }
  levelToPaint(c: CanvasRenderingContext2D, deltaTime: number, row: number) {
    [...this.npc, ...this.players]
      .filter((entity) => entity.matrixY == row)
      .sort((a, b) => b.y - a.y)
      .forEach((entity: any) => {
        entity.collisionAttacks = this.effect;
        entity.draw(c, deltaTime);
        if (this.gameIsPaused) return;
        entity.update(c, deltaTime);
        // entity.
      });
  }
  levelToPaintAttack(
    c: CanvasRenderingContext2D,
    deltaTime: number,
    row: number
  ) {
    this.effect
      .filter((effect: any) => effect.initialMatrixY == row)
      .forEach((effect) => {
        effect.draw(c, deltaTime);
        if (this.gameIsPaused) return;
        effect.update(c, deltaTime);
      });
  }
  showAllAttacks() {
    this.players.forEach((player) => {
      player.AllattackToShow = player.AllattackToShow.filter(
        (attack) => attack.delete !== true
      );
    });

    const attacksPlayers = this.players
      .map((player) => player.AllattackToShow)
      .flat(1);

    this.npc.forEach((enemy) => {
      enemy.AllattackToShow = enemy.AllattackToShow.filter(
        (attack) => attack.delete !== true
      );
    });
    const attacksNpc = this.npc.map((npc) => npc.AllattackToShow).flat(1);

    this.effect = [...attacksPlayers, ...attacksNpc];
  }
  checkClick(mouseX: number, mouseY: number) {
    this.gameUI.checkClick(mouseX, mouseY);
  }
  addNewEnemy({ newEnemy, position, level }) {
    const enemy = new newEnemy({
      possition: { x: position.x, y: position.y },
      sideToPlay: this.players[0].side == 0 ? 1 : 0,
      level: level,
    });

    if (this.npc.length < 3) {
      enemy.game = this;

      this.npc.push(enemy);
    } else {
      alert("por el momento no se pueden agregar mas enemigos limitados a 2");
    }
  }
  addPlayerElement({ element, player }) {
    const newElement = new element({
      possition: { x: player.matrixX + 1, y: player.matrixY },
      sideToPlay: player.side,
    });
    newElement.game = this;
    newElement.sideToPlay = player.side;
    console.log("newElement", newElement);

    this.npc.push(newElement);
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
