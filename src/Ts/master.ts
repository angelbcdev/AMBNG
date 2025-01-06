import Attack from "./attacks/attacks.js";
import { BasicAttack } from "./attacks/basicAttack.js";
import { ExplotionsEffect } from "./StaticAnimations.js";

export class Nodo {
  matrixX: number;
  matrixY: number;
  possition: { x: number; y: number };
  jump = 70;
  blockSize: { w: number; h: number };

  color: string;
  frameX: number;
  frameY: number;
  faceToLeft: boolean;
  frameTime: number;
  frameInterval: number;
  maxFrame: number;
  incialFrameX: number;
  incialFrameY: number;
  image: HTMLImageElement;
  widthAreaRango: number;
  heightAreaRango: number;
  possitionXAreaRango: number;
  liveTotal: number;
  live: number;
  collisionAttacks: any[];
  detectedPlayers: any[];
  timeOfStuns: number;
  timeFinalAnimationAttack: number;
  timeForShoot: number;
  damage: number;
  x: number;
  y: number;
  side: number;
  drawxStings: { ll: number; rl: number; xl: number };
  goingToShoot: boolean;
  AllattackToShow: Nodo[] = [];
  canShoot: boolean;
  states: any;
  explosion: ExplotionsEffect;
  proyoectile: any;
  width: number;
  height: number;
  frameWidth = 70;
  frameHeight = 50;
  timeToDie = 800;
  allExplotions = [];
  frameAjustY = 10;
  frameAjustX = 0;
  game: any;
  fps = 12;
  delete = false;
  canMove = true;
  isVisible = true;
  sideToPlay: 1 | 0;
  constructor({
    x,
    y,
    sideToPlay,
  }: {
    x: number;
    y: number;
    sideToPlay: number;
  }) {
    this.x = x;
    this.y = y;
    this.matrixX = 0;
    this.matrixY = 0;

    this.frameTime = 0;
    this.frameY = 0;
    this.frameX = 0;

    this.frameInterval = 1000 / this.fps;
    this.maxFrame = 3;
    this.incialFrameX = 0;
    this.incialFrameY = 0;
    this.live = 100;
    this.liveTotal = 100;
    this.side = sideToPlay;
    this.possition = {
      x: this.x,
      y: this.y,
    };
    this.explosion = null;
    this.proyoectile = BasicAttack;
    this.canShoot = true;
    this.timeForShoot = 2000;
    this.collisionAttacks = [];
    this.widthAreaRango = 0;
    this.width = 32;
    this.height = 45;
    this.blockSize = {
      h: 65,
      w: 32,
    };
    this.timeOfStuns = 2000;
    this.states = {
      idle: 0,
      shoot: 1,
      move: 2,
      hit: 3,
      death: 4,
      open: 5,
      close: 6,
    };
    this.drawxStings = {
      xl: 25,
      rl: 15,
      ll: -15,
    };
    this.image = new Image();
  }

  draw(c: CanvasRenderingContext2D, deltaTime: number) {
    if (this.explosion) {
      this.explosion.possition = this.possition;
      this.explosion.draw(c, deltaTime);
    }
    this.updateframe(deltaTime);
    if (!this.isVisible) {
      return;
    }

    this.calculateMatrix();
    this.drawSprite(c);
    this.paintLive(c, this.possition.x, this.possition.y);
    try {
      if (this.isVisible) {
        this.game.matrix[this.matrixY][this.matrixX].ocupated = true;
      } else {
        this.game.matrix[this.matrixY][this.matrixX].ocupated = false;
      }
    } catch (error) {}
  }

  update(_: CanvasRenderingContext2D, __: number) {
    this.checkCollision();
  }

  calculateMatrix() {
    if (this.game.matrix == null) {
      return;
    }
    this.game.matrix.forEach((row: number[], y: number) => {
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
          this.possition = {
            x: x * this.jump + this.blockSize.w / 2 - this.width,
            y: y * this.jump + gap + 15,
          };
        }
      });
    });
  }

  paintLive(c: CanvasRenderingContext2D, x: number, y: number, w = 40, h = 5) {
    const sixe = h;
    c.fillStyle = "#000";
    c.fillRect(x - 1, y - 1, w, sixe);
    c.fillStyle = "#fff";
    c.fillRect(x, y, w - 2, sixe - 2);
    c.fillStyle = "green";
    const live = (this.live / this.liveTotal) * w;

    if (live > 0) {
      c.fillRect(x, y, live, sixe - 2);
    }
  }

  validCollision(attack: Nodo) {
    if (
      attack.possition.x + attack.width >= this.possition.x &&
      attack.possition.x <= this.possition.x + this.width &&
      attack.possition.y + attack.height >= this.possition.y &&
      attack.possition.y <= this.possition.y + this.height
    ) {
      this.beforeDamage(attack as Attack);
    }
  }

  checkCollision() {
    this.collisionAttacks.forEach((attack: Attack) => {
      if (
        attack.attackOuwner === this &&
        attack.attackOuwner.matrixY === this.matrixY
      ) {
        return;
      }

      this.validCollision(attack);
    });
  }

  updateframe(deltaTime: number) {
    if (this.frameTime > this.frameInterval) {
      this.frameTime = 0;
      this.frameX =
        this.frameX < this.maxFrame ? this.frameX + 1 : this.incialFrameX;
    } else {
      this.frameTime += deltaTime;
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
      this.blockSize.w,
      this.blockSize.h
    );
  }

  makeAttack(_?: string) {}
  collisionArea(_: Nodo) {}
  onCollision(_: Nodo) {}

  resiveDamage(attack: Attack) {
    attack.canMakeDamage = false;
    this.live -= attack.damage;

    if (attack?.attackCollision) {
      attack?.attackCollision(this);
    }
    if (attack?.attackEnemyEfect) {
      attack?.attackEnemyEfect(this);
    }

    setTimeout(() => {
      if (this.live > 0) {
        this.frameY = this.states.idle;
      }
    }, this.timeOfStuns);
    if (this.live <= 0) {
      this.makeDeath();
    }
  }
  beforeDamage(attack: Attack) {
    if (this.live <= 0) {
      return;
    }
    if (this.matrixY !== attack.initialMatrixY || this.side === attack.side) {
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

  drawFilter(_: CanvasRenderingContext2D) {}

  makeDeath() {
    this.frameY = this.states.hit;

    if (this.explosion) {
      return;
    }
    // this.explosion = new ExplotionsEffect({
    //   possition: {
    //     x: this.sideToPlay == 1 ? this.possition.x + 60 : this.possition.x - 60,
    //     y: this.possition.y,
    //   },
    //   sideToPlay: this.sideToPlay,
    //   color: this.color,
    // });
    this.isVisible = false;
    this.canMove = false;

    setTimeout(() => {
      this.delete = true;
      this.game.matrix[this.matrixY][this.matrixX].ocupated = false;
      // this.game.breackFloor(this.matrixX, this.matrixY);
    }, this.timeToDie);
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
          initialMatrixY: this.matrixY,
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

  addMoreExplotion() {}
}
