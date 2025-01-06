import BackGround from "../data/backGround";

import { ToleteEnemy } from "./enemys/tolete";
import { FloorBase } from "./floors/floor";
import PlayerBlue from "./player/playerBlue";
import { GameUI } from "./UI";

import { ubicateFloors } from "./utils";
import Attack from "./attacks/attacks";
import { Nodo } from "./master";
import { CannonDumb } from "./enemys/Character/cannon/cannonDumb";
// import { allChipsA } from "./player/chips/chipData";
// import { BattleShip } from "./player/chips";

import { ShowChipAreaWithChip } from "./UI/chipAreaSelector";

const matrix = [
  [
    { side: 0, ocupated: false, effect: "none", isAttack: false },
    { side: 0, ocupated: false, effect: "none" },
    { side: 0, ocupated: false, effect: "none" },
    { side: 1, ocupated: false, effect: "none" },
    { side: 1, ocupated: false, effect: "none" },
    { side: 1, ocupated: false, effect: "none" },
  ],
  [
    { side: 0, ocupated: false, effect: "none", isAttack: false },
    { side: 0, ocupated: false, effect: "none", isAttack: false },
    { side: 0, ocupated: false, effect: "none" },
    { side: 1, ocupated: false, effect: "none" },
    { side: 1, ocupated: false, effect: "none" },
    { side: 1, ocupated: false, effect: "none" },
  ],
  [
    { side: 0, ocupated: false, effect: "none", isAttack: false },
    { side: 0, ocupated: false, effect: "none" },
    { side: 0, ocupated: false, effect: "none" },
    { side: 1, ocupated: false, effect: "none", isVisible: false },
    { side: 1, ocupated: false, effect: "none" },
    { side: 1, ocupated: false, effect: "none" },
  ],
  // [
  //   { side: 0, ocupated: false, effect: "none", isAttack: false },
  //   { side: 0, ocupated: false, effect: "none", isAttack: false },
  //   { side: 0, ocupated: false, effect: "none" },
  //   { side: 1, ocupated: false, effect: "none" },
  //   { side: 1, ocupated: false, effect: "none" },
  //   { side: 1, ocupated: false, effect: "none" },
  // ],
];
const currentPlayers = new PlayerBlue({
  possition: { x: 1, y: 1 },
  sideToPlay: 0,
});
export const Torretas = [
  new CannonDumb({
    possition: { x: 2, y: 0 },
    sideToPlay: 1,
    level: 1,
  }),
  new CannonDumb({
    possition: { x: 2, y: 2 },
    sideToPlay: 1,
    level: 2,
  }),
  new CannonDumb({
    possition: { x: 2, y: 1 },
    sideToPlay: 1,
    level: 3,
  }),
];
// export const mettols = [
//   new Mettols({ possition: { x: 2, y: 1 }, sideToPlay: 1, level: 1 }),
//   new Mettols({ possition: { x: 1, y: 2 }, sideToPlay: 1, level: 2 }),
//   new Mettols({ possition: { x: 0, y: 0 }, sideToPlay: 1, level: 3 }),
// ];
export const tolete = [
  new ToleteEnemy({
    possition: { x: 2, y: 0 },
    sideToPlay: 1,
  }),
  new ToleteEnemy({
    possition: { x: 2, y: 1 },
    sideToPlay: 1,
  }),
  new ToleteEnemy({
    possition: { x: 2, y: 2 },
    sideToPlay: 1,
  }),
];

export class TestGame {
  protected matrix = matrix;
  effect: any[] = [];
  npc: any[] = [];
  background: BackGround;
  floors: FloorBase[] = [];
  players: PlayerBlue[];
  gameIsPaused = true;
  bossStage: any;
  hasEnemys = false;
  isDev = false;
  isPlayerSelectChip = false; // para saber si el jugador selecciono un chip
  isCompletedBarShip = false;
  gameUI = new GameUI(this);

  timeForSelectShip = 1000;
  currentTimeForSelectShip = 0;
  tembleCanvas: number;
  canTembleCanvas = false;
  canvasTime = 0;
  chipSelected = new ShowChipAreaWithChip(this);

  currentMove = 50;
  constructor() {
    this.effect = [];
    this.players = [currentPlayers];
    this.npc = [
      // ...Torretas,
      // ...tolete,
      // ...mettols,
      // new Fishy({ possition: { x: 2, y: 1 }, sideToPlay: 1 }),
      // new Fishy({ possition: { x: 0, y: 0 }, sideToPlay: 1 }),
      // new BeeTank({ possition: { x: 0, y: 1 }, sideToPlay: 1 }),
      // new BeeTank({ possition: { x: 1, y: 1 }, sideToPlay: 1, level: 1 }),
      // new BeeTank({ possition: { x: 0, y: 1 }, sideToPlay: 1, level: 2 }),
      // new BeeTank({ possition: { x: 2, y: 1 }, sideToPlay: 1, level: 3 }),
    ];
    this.bossStage = null; // new GospelWolfEnemy({ possition: { x: 0, y: 1 }, playerEnemy: player }),
    this.background = new BackGround({ width: 420, height: 400 }, 2);
    this.floors = ubicateFloors({ array: matrix, blockSize: 64, gapX: 6.5 });
    this.initGame();

    this.makeLittlePause();
    this.tembleCanvas = 0;
  }

  makeLittlePause() {
    // this.gameIsPaused = true;
    setTimeout(() => {
      this.playerSelectedChip();
    }, 500);
  }
  playerOnSelectShip() {
    this.isPlayerSelectChip = true;
    this.gameIsPaused = true;
  }
  playerSelectedChip() {
    this.isPlayerSelectChip = false;
    this.gameIsPaused = false;
    this.currentTimeForSelectShip = 0;
    this.isCompletedBarShip = false;
  }
  initGame() {
    [...this.npc, ...this.players].forEach((entity) => {
      entity.game = this;
    });
  }
  pauseGame() {
    this.gameIsPaused = true;
  }
  resumeGame() {
    this.gameIsPaused = false;
  }
  draw(c: CanvasRenderingContext2D, deltaTime: number) {
    this.background.draw(c, deltaTime);
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
    if (this.chipSelected.showChipArea) {
      if (this.currentMove < 100) {
        this.currentMove += 2;
      }
    } else {
      if (this.currentMove > 50) {
        this.currentMove -= 2;
      }
    }
    c.translate(0, this.currentMove);

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

    this.floors
      .sort((a, b) => b.y + a.y)
      .forEach((entity: any) => {
        entity.draw(c, deltaTime);
        entity.floors = this.floors;
        entity.validateAttack(this.effect);

        entity.game = this;
      });

    this.matrix.forEach((_, indexY) => {
      this.levelToPaint(c, deltaTime, indexY);
      this.levelToPaintAttack(c, deltaTime, indexY);
    });

    [...this.npc, this.bossStage].forEach((entity: any) => {
      entity?.collisionArea(this.players[0]);
    });
    c.restore();
    this.gameUI.draw(c, deltaTime);
    this.chipSelected.draw(c, deltaTime);
  }
  update(c: CanvasRenderingContext2D, deltaTime: number) {
    if (this.gameIsPaused) return;
    this.npc.length > 0 ? (this.hasEnemys = true) : (this.hasEnemys = false);

    this.npc = this.npc.filter((enemy: any) => {
      if (enemy.delete) {
        this.matrix[enemy.matrixY][enemy.matrixX].ocupated = false;
      }
      return enemy.delete !== true;
    });
    this.effect = this.effect.filter((effect: any) => effect.delete !== true);
    this.floors.forEach((floor: any) => {
      floor.update(c, deltaTime);
    });
    if (!this.isPlayerSelectChip) {
      if (this.currentTimeForSelectShip > this.timeForSelectShip) {
        this.isCompletedBarShip = true;
      } else {
        this.currentTimeForSelectShip += deltaTime;
      }
    }
  }
  showAreaSelecteShip() {
    if (this.isCompletedBarShip) {
      this.playerOnSelectShip();
    } else {
      console.log("need wait more");
    }
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
  addNewEffect(attack: Attack) {
    console.log("attack", attack);
    attack.game = this;
    this.npc.push(attack);
  }
  addNewEnemy({ newEnemy, position, level }) {
    const enemy = new newEnemy({
      possition: { x: position.x, y: position.y },
      sideToPlay: this.players[0].side == 0 ? 1 : 0,
      level: level,
    });

    if (this.npc.length < 2) {
      enemy.game = this;

      this.npc.push(enemy);

      this.makeLittlePause();
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
  brackAllFloor(characterData: Nodo, _: number) {
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
  destroyEspecificFloor(characterData: Nodo, tipe: 1 | 3) {
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
  destroyRandomFloor(characterData: Nodo, _: number) {
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

  checkClick(mouseX: number, mouseY: number) {
    this.gameUI.checkClick(mouseX, mouseY);
  }
}
