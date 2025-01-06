import Player from "../../../player/player";
import { StaticEnemy } from "../../staticEnemy";
import { CannonDumpAttack } from "./cannonDumpAttacl";

const levelsInfo = {
  1: {
    img: `/assects/enemy/cannonDumb/canondumpall1.png`,
    damge: 10,
    live: 50,
    timeForShoot: 4000,
    timeOfStuns: 500,
  },
  2: {
    img: `/assects/enemy/cannonDumb/canondumpall2.png`,
    damge: 15,
    live: 80,
    timeForShoot: 3500,
    timeOfStuns: 475,
  },
  3: {
    img: `/assects/enemy/cannonDumb/canondumpall3.png`,
    damge: 20,
    live: 120,
    timeForShoot: 3000,
    timeOfStuns: 450,
  },
};
class CannonDumb extends StaticEnemy {
  imageForAttack: HTMLImageElement;
  imageForAttackX: number = 0;
  imageForAttackY: number = 0;
  imageForAttackWidth: number = 35;
  imageForAttackHeight: number = 70;
  attackShort: CannonDumpAttack;
  constructor({ possition, sideToPlay, level = 1 }) {
    super({ possition, sideToPlay });
    this.image.src = levelsInfo[level].img;
    this.imageForAttack = new Image();
    this.imageForAttack.src = `/assects/enemy/cannonDumb/attack-Cannon.png`;
    this.proyoectile = CannonDumpAttack;
    this.timeFinalAnimationAttack = 300;
    this.damage = levelsInfo[level].damge;
    this.live = levelsInfo[level].live;
    this.frameAjustY = 65; //52;
    this.frameAjustX = 20; // 50;

    this.maxFrame = 6;
    this.fps = 30;
    this.frameInterval = 1000 / this.fps;
    this.blockSize = {
      w: 90,
      h: 100,
    };
    this.frameY = 1;
    this.frameWidth = 50;
    this.frameHeight = 60;
    this.states = {
      shoot: 1,
      open: 99,
      close: 2,
      idle: 0,
      hit: 2,
      death: 99,
      move: 98,
    };
    this.attackShort = null;
    this.timeForShoot = levelsInfo[level].timeForShoot;
    this.canAttack = true;
    this.timeForAttack = 0;
    this.frameY = this.states.idle;
    this.timeOfStuns = levelsInfo[level].timeOfStuns;
    this.possitionShowLiveY = 62;
    this.possitionShowLiveX = 14;
  }
  update(c: CanvasRenderingContext2D, deltaTime: number): void {
    super.update(c, deltaTime);
    if (!this.canAttack) {
      if (this.timeForAttack > this.timeForShoot) {
        this.canAttack = true;
        this.timeForAttack = 0;
      } else {
        this.timeForAttack += deltaTime;
      }
    }
    if (this.attackShort) {
      this.attackShort.draw(c, deltaTime);
      this.attackShort.update(c, deltaTime);

      this.game.players[0].validCollision(this.attackShort);
      if (this.attackShort.delete) {
        this.attackShort = null;
      }
      if (this.attackShort?.onCollisionPlayer) {
        this.frameY = this.states.shoot;
      } else if (
        !this.attackShort?.onCollisionPlayer &&
        this.frameY != this.states.hit
      ) {
        this.frameY = this.states.idle;
      }
    }
  }
  draw(c: CanvasRenderingContext2D, deltaTime: number): void {
    super.draw(c, deltaTime);
    if (this.frameY == this.states.shoot) {
      c.drawImage(
        this.imageForAttack,
        this.frameX * this.imageForAttackWidth,
        this.imageForAttackY,
        this.imageForAttackWidth,
        this.imageForAttackHeight,
        this.possition.x - 43,
        this.possition.y - 85,
        this.blockSize.w / 2,
        this.blockSize.h
      );
    }
  }
  onDetectedPlayer(_: Player) {
    if (this.delete || !this.canMove || this.game.gameIsPaused) {
      return;
    }
    if (this.frameY == this.states.idle && this.canAttack) {
      this.canAttack = false;
      if (!this.attackShort) {
        this.attackShort = new CannonDumpAttack({
          possition: this.possition,
          sideToPlay: this.side,
          color: this.color,
          damage: this.damage,
          game: this.game,
          attackOuwner: this,
          initialMatrixY: this.matrixY,
        });
      }
    }
  }
  makeAttack() {}
}
export { CannonDumb };
