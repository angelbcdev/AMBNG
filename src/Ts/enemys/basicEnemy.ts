import { DashShoot } from "../attacks/dashShoot";
import Enemy from "./enemys";

type MOVES = "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown" | "f";
export class BasicEnemy extends Enemy {
  move: MOVES[];
  timeMoveRandom: number;

  constructor({ possition, sideToPlay }) {
    super({ possition, sideToPlay });
    this.image.src = `../../assects/enemy/guard.png`;
    this.frameWidth = 181;
    this.frameHeight = 181;
    this.liveTotal = 100;
    this.live = 100;
    this.damage = 10;
    this.timeForAttack = 2000;

    this.move = ["ArrowUp", "ArrowDown"];

    this.states = {
      idle: 1,
      shoot: 0,
      hit: 2,
      move: 3,
      death: 99,
      open: 100,
      close: 200,
    };
    this.timeFinalAnimationAttack = 700;
    this.timeMoveRandom = 1000;
    this.proyoectile = DashShoot;

    this.frameY = this.states.idle;
    this.maxFrame = 8;
    this.frameTime = 100;
    this.moveRandom();

    this.blockSize = {
      w: 100,
      h: 140,
    };
    this.frameAjustY = 92;
    this.frameAjustX = 50;
  }
  update(c: CanvasRenderingContext2D, deltaTime: number): void {
    super.update(c, deltaTime);
    if (this.frameY == this.states.shoot && this.frameX == 5 && this.canShoot) {
      this.canShoot = false;
      this.game.addNewEffect({
        effect: this.proyoectile,
        possition: {
          x: this.possition.x,
          y: this.possition.y,
          initialMatrixY: this.matrixY,
        },
        sideToPlay: this.faceToLeft,
        color: this.color,

        damage: this.damage,
      });
      this.canMove = false;
    }
  }

  acctionKeyDown(key) {
    if (this.frameY == this.states.hit) {
      return;
    }

    let newMatrixY = this.matrixY;
    let newMatrixX = this.matrixX;

    const handleEvents = {
      ArrowUp: () => {
        newMatrixY -= 1;
      },
      ArrowDown: () => {
        newMatrixY += 1;
      },
      ArrowLeft: () => {
        newMatrixX -= 1;
      },

      ArrowRight: () => {
        newMatrixX += 1;
      },
    };

    if (handleEvents[key]) {
      handleEvents[key]();
    }

    setTimeout(() => {
      this.frameY = this.states.idle;
    }, 300);
    try {
      if (this.game.matrix[newMatrixY][newMatrixX]?.ocupated) {
        return;
      }
    } catch (_) {}

    if (
      newMatrixY < 0 ||
      newMatrixY >= this.game.matrix.length ||
      newMatrixX < 0 ||
      newMatrixX >= this.game.matrix[0].length ||
      this.game.matrix[newMatrixY][newMatrixX].side !== this.side
    ) {
      return;
    }

    if (this.frameY != this.states.move) {
      this.frameY = this.states.move;
    }
    this.game.matrix[this.matrixY][this.matrixX].ocupated = false;

    this.matrixY = newMatrixY;
    this.matrixX = newMatrixX;

    this.game.matrix[this.matrixY][this.matrixX].ocupated = true;
  }

  moveRandom() {
    setInterval(() => {
      const random = this.move[Math.floor(Math.random() * this.move.length)];
      if (this.canMove && !this.game.gameIsPaused) {
        this.acctionKeyDown(random);
      }
    }, this.timeMoveRandom);
  }
  makeAttack() {
    if (this.canShoot) {
      this.goingToShoot = false;

      // setTimeout(() => {
      //   this.frameY = this.states.idle;
      //   setTimeout(() => {
      //     this.canShoot = true;
      //   }, this.timeForShoot);
      // }, this.timeFinalAnimationAttack);
    }
  }
}
