import Attack from "../../../attacks/attacks";
import Enemy from "../../enemys";
import { FishyAttackDash } from "./fishyAttack";
import {
  FishyAttack,
  FishyIdle,
  FishyMoveDown,
  FishyMoveUp,
  FishyStatateFall,
} from "./states";

let enemyLevel = {
  1: {
    img: "assects/enemy/fisht/fisht1.png",
    speed: 0.06,
    damage: 5,
    live: 60,
  },
  2: {
    img: "assects/enemy/fisht/fisht2.png",
    speed: 0.09,
    damage: 10,
    live: 80,
  },
  3: {
    img: "assects/enemy/fisht/fisht3.png",
    speed: 0.12,
    damage: 15,
    live: 100,
  },
};

export default class Fishy extends Enemy {
  speed = 0.09;
  setEnemey = true;
  buttomFloor = 0;
  topFloor = 0;
  goDown = true;
  statesMachineRef = {
    idle: 0,
    moveDown: 1,
    moveUp: 2,
    attack: 3,
    fall: 4,
  };
  statesMachine = [
    new FishyIdle(this),
    new FishyMoveDown(this),
    new FishyMoveUp(this),
    new FishyAttack(this),
    new FishyStatateFall(this),
  ];
  stateMacnineIndex = 0;

  currentState = this.statesMachine[this.stateMacnineIndex];
  constructor({ possition, sideToPlay, level = 1 }) {
    super({
      possition,
      sideToPlay,
    });
    this.states = {
      idle: 0,
      moveDown: 2,
      moveUp: 3,
      attack: 1,
      hit: 0,
    };
    this.frameX = 0;
    this.frameY = 0;
    this.incialFrameX = 0;
    this.maxFrame = 0;
    this.frameWidth = 62;
    this.frameHeight = 60;
    this.frameAjustX = 10;
    this.frameAjustY = 50;
    this.blockSize = {
      h: 62,
      w: 60,
    };
    this.image.src = enemyLevel[level].img;
    this.speed = enemyLevel[level].speed;
    this.damage = enemyLevel[level].damage;
    this.live = enemyLevel[level].live;
    this.topFloor = 0;
    this.buttomFloor = 0;
    this.proyoectile = FishyAttackDash;
  }
  update(c: CanvasRenderingContext2D, deltaTime: number): void {
    this.currentState.update(c, deltaTime);

    super.update(c, deltaTime);
  }
  collisionArea(player) {
    if (this.side === player.sides) {
      return;
    }

    if (
      player.possition.x < this.possitionXAreaRango + this.widthAreaRango &&
      player.possition.x + player.width > this.possitionXAreaRango &&
      player.possition.y < this.possition.y + 10 &&
      player.possition.y + 5 > this.possition.y
    ) {
      this.onDetectedPlayer(player);
    }
  }

  onDetectedPlayer(player) {
    if (
      this.side === player.side ||
      this.delete ||
      !this.canMove ||
      this.game.gameIsPaused
    ) {
      return;
    }
    if (this.canAttack && this.currentState.state !== "attack") {
      this.changeState(this.statesMachineRef.attack);
      // this.makeAttack();
    }
  }
  drawSprite(c: CanvasRenderingContext2D) {
    c.drawImage(
      this.image,
      this.frameX * this.frameWidth,
      this.frameY * this.frameHeight,
      this.frameWidth,
      this.frameHeight,

      this.possition.x - this.frameAjustX,
      this.possition.y - this.frameAjustY,
      this.blockSize.w + 30,
      this.blockSize.h + 30
    );
    if (this.game.isDev) {
      c.fillStyle = "red";
      c.font = "20px Arial";
      c.fillText(
        `${this.currentState.state} `,
        this.possition.x + 10,
        this.possition.y - 20
      );
    }
  }
  calculateMatrix() {
    if (this.game.matrix == null || !this.setEnemey) {
      return;
    }
    this.game.matrix.forEach((row: number[], y: number) => {
      if (y === 0) {
        this.topFloor = y * this.jump + 160;
      }
      row.forEach((_, x: number) => {
        if (this.matrixY == y && this.matrixX == x) {
          let gap = 130;
          if (y === 0) {
            gap += 30;
          }
          if (y === 1) {
            gap += 11;
          }
          if (y === 2) {
            gap -= 8;
          }
          if (y === 3) {
            gap -= 20;
          }

          this.buttomFloor = this.game.matrix.length * 97;
          this.possition = {
            x: x * this.jump + this.blockSize.w / 2 - this.width,
            y: y * this.jump + gap + 15,
          };
        }
      });
    });
    this.setEnemey = false;
  }
  changeState(newState: number) {
    this.currentState.exit();
    this.stateMacnineIndex = newState;
    this.currentState = this.statesMachine[this.stateMacnineIndex];
    this.currentState.enter();
  }
  getMatrixIndices = (xPos: number, __: number) => {
    let matrixX = Math.floor(xPos / this.jump);

    let matrixY;
    if (matrixX < 0) matrixX = 0;

    if (this.currentState.state === "moveDown") {
      if (this.possition.y < 180) {
        matrixY = 0;
      } else if (this.possition.y >= 180 && this.possition.y < 235) {
        matrixY = 1;
      } else if (this.possition.y >= 235) {
        matrixY = 2;
      }
    }
    if (this.currentState.state === "moveUp") {
      if (this.possition.y < 210) {
        matrixY = 0;
      } else if (this.possition.y >= 210 && this.possition.y < 270) {
        matrixY = 1;
      } else if (this.possition.y >= 270) {
        matrixY = 2;
      }
    }

    if (matrixY === -1) matrixY = 0;
    if (matrixX === -1) matrixX = 0;

    this.matrixY = matrixY;
    let isAvailable;
    try {
      isAvailable =
        this.game.matrix[this.matrixY][this.matrixX]?.side == this.side;
    } catch (error) {
      this.matrixX = 0;
    }

    return isAvailable;
  };
  beforeDamage(attack: Attack) {
    if (this.live <= 0) {
      return;
    }
    if (this.side === attack.side) {
      return;
    }

    if (attack?.attackCollision) {
      attack?.attackCollision(this);
    }
    if (!attack.canMakeDamage) {
      return;
    }

    this.resiveDamage(attack);
  }
  resiveDamage(attack: Attack) {
    attack.canMakeDamage = false;
    this.live -= attack.damage;

    if (attack?.attackCollision) {
      attack?.attackCollision(this);
    }
    if (attack?.attackEnemyEfect) {
      attack?.attackEnemyEfect(this);
    }

    if (this.live <= 0) {
      this.makeDeath();
    }
  }
}
