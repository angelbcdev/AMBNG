import { GAME_IS_DEV, GAME_IS_PAUSE } from "@/core/gameState";
import Attack from "../../../attacks/attacks";
import { BasicBomb } from "../../../attacks/megamanAttack/basicBomp";

import { StaticAttack } from "../../../attacks/statickAttack";
import PlayerBlue from "../../../player/player/Player";

import Enemy from "../../enemys";
import { Idle, MoveDown, MoveUp, AttackS } from "./state";

const enemyLevel = {
  1: {
    img: "assects/enemy/boomtank1.png",
    speed: 0.06,
    damage: 5,
    live: 60,
  },
  2: {
    img: "assects/enemy/boomtank2.png",
    speed: 0.07,
    damage: 10,
    live: 80,
  },
  3: {
    img: "assects/enemy/boomtank3.png",
    speed: 0.08,
    damage: 15,
    live: 100,
  },
};

export default class BeeTank extends Enemy {
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
  };
  statesMachine = [
    new Idle(this),
    new MoveDown(this),
    new MoveUp(this),
    new AttackS(this),
  ];
  stateMacnineIndex = 0;

  currentState = this.statesMachine[this.stateMacnineIndex];
  enemyTarget: PlayerBlue;
  constructor({ possition, sideToPlay, level = 3 }) {
    super({
      possition,
      sideToPlay,
    });
    this.states = {
      idle: 0,
      moveDown: 0,
      moveUp: 0,
      attack: 1,
      hit: 0,
    };
    this.frameX = 0;
    this.frameY = 0;
    this.incialFrameX = 0;
    this.maxFrame = 4;
    this.frameWidth = 209;
    this.frameHeight = 168;
    this.frameAjustX = 50;
    this.frameAjustY = 70;
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
    this.proyoectile = BasicBomb;
    this.damage = 1;
    this.timeForAttack = 3000;
  }
  update(c: CanvasRenderingContext2D, deltaTime: number): void {
    this.currentState.update(c, deltaTime);

    super.update(c, deltaTime);
  }
  collisionArea(player) {
    if (this.side === player.sides) {
      return;
    }

    this.onDetectedPlayer(player);
  }

  onDetectedPlayer(player: PlayerBlue) {
    if (
      this.side === player.side ||
      this.delete ||
      !this.canMove ||
      GAME_IS_PAUSE()
    ) {
      return;
    }
    if (this.canAttack && this.currentState.state !== "attack") {
      this.enemyTarget = player;

      this.changeState(this.statesMachineRef.attack);
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
      this.blockSize.w + 60,
      this.blockSize.h + 50
    );
    if (GAME_IS_DEV()) {
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
    if (this.matrix == null || !this.setEnemey) {
      return;
    }
    this.matrix.forEach((row: number[], y: number) => {
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

          this.buttomFloor = this.matrix.length * 97;
          this.possition = {
            x: x * this.jump + this.blockSize.w / 2 - this.width + 12,
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
      isAvailable = this.matrix[this.matrixY][this.matrixX]?.side == this.side;
    } catch (_) {
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
  addAttack({
    typeElemetns,
    damage,
    type = "nadda",
  }: {
    typeElemetns: any;
    damage: number;
    type?: string | number;
  }) {
    this.AllattackToShow.push(
      new typeElemetns({
        possition: {
          x: this.possition.x,
          y: this.possition.y,
          initialMatrixY: this.enemyTarget.matrixY,
        },
        sideToPlay: this.side,
        color: this.color,
        damage,
        origin: this.side,
        attackOuwner: this,
        type,
      })
    );
  }
  addMultiAttack(x, y) {
    [-60, 0, 60].forEach((ax) => {
      if (y - ax < 140 || y - ax > 300) {
        return;
      }
      this.AllattackToShow.push(
        new StaticAttack({
          possition: {
            x: x - 100,
            y: y - ax,
            initialMatrixY: this.enemyTarget.matrixY,
          },
          sideToPlay: this.side,
          color: this.color,
          damage: this.damage,
          origin: this.side,
          attackOuwner: this,
        })
      );
    });

    // this.AllattackToShow.push(
    //   new StaticAttack({
    //     possition: {
    //       x: this.enemyTarget.possition.x - 60,
    //       y: this.enemyTarget.possition.y - 60,
    //       initialMatrixY: this.enemyTarget.matrixY,
    //     },
    //     sideToPlay: this.side,
    //     color: this.color,
    //     damage: this.damage,
    //     origin: this.side,
    //     attackOuwner: this,
    //   })
    // );
  }
}
