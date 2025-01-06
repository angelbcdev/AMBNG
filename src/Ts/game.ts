import { FloorBlue, FloorRed } from "./floors/floor.ts";
import PlayerBlue from "./player/playerBlue.ts";
// import PlayerRed from "./player/playerRed.ts";

import levels, { standWorld } from "./levels.ts";
import {
  createObjectsFrom2D,
  getdataLocalStorage,
  KEY_DATA,
  savedataLocalStorage,
} from "./utils.ts";
import BackGround from "../data/backGround/index.ts";

const canvas = {
  width: 420,
  height: 420,
};
export class Game {
  BackGround: BackGround;
  left: boolean;
  blockSize: number;
  players: any;
  gamePoints: number;
  npc: any;
  isDev: boolean;
  gameIsStarted: boolean;
  gameIsPaused: boolean;
  stageClear: boolean;
  sfageFail: boolean;
  timeForStartGame: number;
  currentLevel: number;
  leverComplete: number;
  limitLevel: number;
  blockElements: any;
  matrixPanels: any;
  mundo: any;
  effect: any;
  ui: any;
  timer: number;
  minutes: number;
  seconds: number;
  finalLevel: boolean;
  constructor({ left }) {
    this.BackGround = new BackGround(canvas);
    this.left = left;
    this.blockSize = 70;
    this.players = [];
    this.gamePoints = 0;
    this.npc = [];
    this.isDev = false;
    this.gameIsStarted = true;
    this.gameIsPaused = true;
    this.stageClear = false;
    this.sfageFail = false;
    this.timeForStartGame = 800;
    this.currentLevel = 1;
    this.leverComplete = getdataLocalStorage(KEY_DATA) || 1;
    this.limitLevel = 6;
    this.blockElements = {
      collisionBlockFull: {
        id: this.left ? 0 : 1,
        classElement: this.left ? FloorBlue : FloorRed,
      },
      collisionBlockTop: {
        id: this.left ? 1 : 0,
        classElement: this.left ? FloorRed : FloorBlue,
      },
    };
    this.matrixPanels = [];
    this.mundo = null;
    this.effect = [];

    this.onLoadingWorld();
    this.timer = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.finalLevel = false;
    setInterval(() => {
      this.timer++;
    }, 1000);
  }
  pauseGame() {
    this.gameIsPaused = true;
  }
  resumeGame() {
    this.gameIsPaused = false;
  }

  onLoadingWorld() {
    this.matrixPanels = levels[this.currentLevel]?.matrix
      ? levels[this.currentLevel]?.matrix(this.left)
      : standWorld(this.left);
    //  || ;

    this.mundo = createObjectsFrom2D({
      array: this.matrixPanels,
      blockSize: this.blockSize,
      blockElements: this.blockElements,
    });
  }

  startGame() {
    this.npc = [];
    if (this.players.length == 0) {
      this.players = [
        new PlayerBlue({ possition: { x: 0, y: 2 }, sideToPlay: this.left }),
      ];
    }

    // const currentPlayer = this.players[0]?.constructor?.name;

    levels[this.currentLevel].enemys.forEach((enemy: any) => {
      const ENEMY = {
        PlayerBlue: {
          sideToPlay: this.left,
          aliado: "playerRed",
        },
        PlayerRed: {
          sideToPlay: !this.left,
          aliado: "playerBlue",
        },
      };
      this.npc.push(
        new enemy.type({
          possition: enemy.possition,
          playerEnemy: ENEMY.PlayerBlue,
        })
      );
    });

    if (this.gameIsStarted) {
      setTimeout(() => {
        this.gameIsStarted = false;
        this.gameIsPaused = false;
      }, this.timeForStartGame);
    }
  }

  changeLevel() {}
  setLevelEspecific(level: number) {
    this.currentLevel = level;
    this.gameIsPaused = true;
    this.gameIsStarted = true;
    this.stageClear = false;
    this.sfageFail = false;
    this.npc = [];
    this.effect = [];
    this.timeForStartGame = 3000;
    this.onLoadingWorld();
    this.startGame();
  }
  addLevel() {
    // const allLevels = Object.keys(levels).length;

    if (this.currentLevel + 1 < this.limitLevel) {
      savedataLocalStorage(KEY_DATA, this.currentLevel + 1);
      this.leverComplete++;
      this.players[0].live += 10;
      this.players[0].damage += 2;
      this.players[0].defense += 5;

      this.setLevelEspecific(this.currentLevel + 1);
    } else {
      this.finalLevel = true;

      this.minutes = Math.floor(this.timer / 60);
      this.seconds = this.timer - this.minutes * 60;
    }
  }
  clearStage() {
    if (!this.stageClear && !this.gameIsStarted) {
      if (this.npc.length === 0) {
        this.stageClear = true;
        this.effect = [];
        setTimeout(() => {
          this.gameIsPaused = true;
        }, 800);
      }
    }
  }
  restart() {
    this.gameIsPaused = true;
    this.gameIsStarted = true;
    this.stageClear = false;
    this.sfageFail = false;
    this.players = [];
    this.npc = [];
    this.effect = [];
    this.timeForStartGame = 3000;
    this.onLoadingWorld();
    this.startGame();
  }

  update(c: CanvasRenderingContext2D, deltaTime: number) {
    this.clearStage();
    this.npc = this.npc.filter((enemy: any) => enemy.delete !== true);
    this.effect = this.effect.filter((effect: any) => effect.delete !== true);

    if (this.players[0]?.live <= 0) {
      this.sfageFail = true;
      this.gameIsPaused = true;
      this.effect = [];
    }
    this.players.forEach((player) => {
      player.collisionAttacks = [...this.effect, ...this.npc];
      player.update(c, deltaTime);
    });
    this.npc.forEach((enemy) => {
      enemy.matrix = this.matrixPanels;
      enemy.collisionAttacks = this.effect;

      try {
        enemy.collisionArea(this.players[0]);
        enemy.collisionArea(this.players[1]);
      } catch (error) {}

      enemy.update(c, deltaTime);
    });
    this.effect
      .sort((a, b) => b.y - a.y) // Ordenamos en orden descendente según `y`
      .forEach((effect) => {
        effect.update(c, deltaTime);
      });
  }

  draw(c: CanvasRenderingContext2D, deltaTime: number) {
    this.BackGround.draw(c, deltaTime);

    this.mundo
      .sort((a, b) => b.y + a.y)
      .forEach((entity: any) => {
        entity.effect = this.effect;
        entity.draw(c);
      });

    [...this.players, ...this.npc, ...this.effect]
      .sort((a, b) => b.y + a.y)
      .forEach((entity) => {
        entity.matrix = this.matrixPanels;

        entity.gameIsPaused = this.gameIsPaused;
        entity.draw(c, deltaTime);
      });

    this.ui.draw({
      c,
      gameIsPaused: this.gameIsPaused,
      gameIsStarted: this.gameIsStarted,
      stageClear: this.stageClear,
      stageFail: this.sfageFail,
    });
    this.ui.paintLever({
      c,
      paintLever: {
        currentLevel: this.currentLevel,
        x: 220,
        y: 30,
      },
    });
  }
  updatePanels() {
    this.mundo = createObjectsFrom2D({
      array: this.matrixPanels,
      blockSize: this.blockSize,
      blockElements: this.blockElements,
    });
  }

  addNewEffect({ possition, effect, sideToPlay, color, origin, damage }) {
    this.effect.push(
      new effect({
        possition,
        sideToPlay,
        color,
        origin,
        damage,
        matrix: this.matrixPanels,
      })
    );
  }
  changeSideLevel() {
    let y1, x1, y2, x2;

    // Buscamos una celda vacía para la primera pareja (ocupated: false)
    do {
      y1 = Math.floor(Math.random() * 4);
      x1 = Math.floor(Math.random() * 2);
    } while (this.matrixPanels[y1][x1].ocupated); // Verifica que la celda no esté ocupada

    // Buscamos una celda vacía para la segunda pareja (ocupated: false)
    do {
      y2 = Math.floor(Math.random() * 4);
      x2 = Math.floor(Math.random() * 2);
    } while (this.matrixPanels[y2][x2].ocupated || (y1 === y2 && x1 === x2)); // Verifica que la celda no esté ocupada y que no sea la misma que la primera

    // Asignamos las celdas con el nuevo valor
    this.matrixPanels[y1][x1] = { side: 4, ocupated: true, effect: "none" };
    this.matrixPanels[y2][x2] = { side: 4, ocupated: true, effect: "none" };

    // Actualizamos los paneles
    this.updatePanels();

    // Llamamos al método onLoadingWorld después de 2 segundos
    setTimeout(() => {
      this.onLoadingWorld();
    }, 2500);
  }
}

const playSideBlue = true;

const game = new Game({ left: playSideBlue });

export default game;
