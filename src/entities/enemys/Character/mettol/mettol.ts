import { GAME_IS_DEV, GAME_IS_PAUSE } from "@/core/gameState";
import { DashShoot } from "@/data/attacks/dashShoot";
import { Entity } from "../../../../entities/entity";

import Enemy from "../../enemys";
import {
  Mettolstates,
  MettolstatesAttack,
  MettolstatesHit,
  MettolstatesIDLE,
  MettolstatesMove,
} from "./states";

type MOVES = "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown" | "f";
const levelsInfo = {
  1: {
    img: `../../assects/enemy/mettols/mettols1.png`,
    damge: 5,
    live: 40,
    timeForShoot: 4000,
    timeOfStuns: 500,
  },
  2: {
    img: `../../assects/enemy/mettols/mettols2.png`,
    damge: 10,
    live: 60,
    timeForShoot: 3500,
    timeOfStuns: 475,
  },
  3: {
    img: `../../assects/enemy/mettols/mettols3.png`,
    damge: 20,
    live: 100,
    timeForShoot: 3000,
    timeOfStuns: 450,
  },
};

export class Mettols extends Enemy {
  move: MOVES[];
  canAttack = true;

  finiteStatesMachine = [];
  currentState: Mettolstates;
  currentStateIndex: number;
  countTimerForAttack = false;
  timerForAttack = 0;

  finiteStates = {
    idle: 0,
    move: 1,
    attack: 2,
    hit: 3,
  };
  states: Record<string, number> = {};
  constructor({ possition, sideToPlay, level = 1 }) {
    super({ possition, sideToPlay });
    this.image.src = levelsInfo[level].img;
    this.frameWidth = 181;
    this.frameHeight = 181;
    this.live = levelsInfo[level].live;

    this.damage = levelsInfo[level].damge;
    this.timeForAttack = levelsInfo[level].timeForShoot;
    this.side = sideToPlay;
    this.move = ["ArrowUp", "ArrowDown"];
    this.possitionShowLiveY = 44;
    this.states = {
      idle: 1,
      shoot: 0,
      hit: 2,
      move: 3,
      death: 99,
      open: 100,
      close: 200,
    };

    this.finiteStatesMachine = [
      new MettolstatesIDLE(this),
      new MettolstatesMove(this),
      new MettolstatesAttack(this),
      new MettolstatesHit(this),
    ];
    this.currentStateIndex = 0;
    this.currentState = this.finiteStatesMachine[this.currentStateIndex];
    this.proyoectile = DashShoot;
    this.frameY = this.states.idle;
    this.maxFrame = 8;
    this.frameTime = 0;
    this.fps = 6;
    this.frameInterval = 1000 / this.fps;
    this.frameWidth = 181;
    this.frameHeight = 181;
    this.blockSize = {
      w: 100,
      h: 100,
    };
    this.frameAjustY = 62;
    this.frameAjustX = 45;

    this.currentState.enter();
  }
  update(c: CanvasRenderingContext2D, deltaTime: number): void {
    if (GAME_IS_DEV()) {
      c.fillStyle = "#ff005450";
      c.fillRect(this.possition.x, this.possition.y, this.width, this.height);
    }
    this.currentState.update(deltaTime);
    this.checkCollision();

    if (this.currentStateIndex === this.finiteStates.attack) {
      this.countTimerForAttack = true;
      if (this.frameX == this.maxFrame) {
        this.changeState(this.finiteStates.idle);
      }
    }
    if (this.countTimerForAttack) {
      this.timerForAttack += deltaTime;

      if (this.timerForAttack > this.timeForAttack) {
        this.countTimerForAttack = false;
        this.canAttack = true;
        this.timerForAttack = 0;
      }
    }
  }

  acctionKeyDown(key: string) {
    let newMatrixY = this.matrixY;
    const newMatrixX = this.matrixX;

    const handleEvents = {
      ArrowUp: () => {
        newMatrixY -= 1;
      },
      ArrowDown: () => {
        newMatrixY += 1;
      },
    };

    if (handleEvents[key]) {
      handleEvents[key]();
    }

    if (
      newMatrixY < 0 ||
      newMatrixY >= this.matrix.length ||
      newMatrixX < 0 ||
      newMatrixX >= this.matrix[0].length ||
      this.matrix[newMatrixY][newMatrixX].side !== this.side ||
      this.matrix[newMatrixY][newMatrixX]?.ocupated
    ) {
      return;
    }
    this.matrix[this.matrixY][this.matrixX].ocupated = false;
    this.matrixY = newMatrixY;
    this.matrixX = newMatrixX;
    setTimeout(() => {
      this.matrix[this.matrixY][this.matrixX].ocupated = true;
      this.changeState(this.finiteStates.idle);
    }, 500);
  }

  moveRandom() {}

  makeAttack() {}

  changeState(state: number) {
    this.currentStateIndex = state;
    this.currentState.exit();
    this.currentState = this.finiteStatesMachine[this.currentStateIndex];
    this.currentState.enter();
  }
  onDetectedPlayer(player) {
    if (
      this.side === player.side ||
      this.delete ||
      !this.canMove ||
      GAME_IS_PAUSE()
    ) {
      return;
    }

    this.changeState(this.finiteStates.attack);
  }
  collisionArea(player) {
    if (this.canAttack) {
      this.currentState.onCollision(player);
    }
  }
  resiveDamage(attack: Entity) {
    if (this.live <= 0) {
      return;
    }
    this.live -= attack.damage;
    attack.delete = true;
    this.changeState(this.finiteStates.hit);
    setTimeout(() => {
      if (this.live > 0) {
        this.frameY = this.states.idle;
      }
    }, this.timeOfStuns);
    if (this.live <= 0) {
      this.makeDeath();
    }
  }
}
