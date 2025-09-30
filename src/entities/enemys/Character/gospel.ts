import { Entity } from "@/entities/entity.js";
import { FireShoot } from "@/data/attacks/fireShoot.js";
import { StaticEnemy } from "../staticEnemy.js";
import { GAME_IS_PAUSE } from "@/core/gameState.js";
import { ExplotionsEffect } from "@/data/extra/StaticAnimations.js";

export class GospelWolfEnemy extends StaticEnemy {
  timeForChangeWorld: any;
  timeExplode = 1000;
  menyExplode = 18;
  sizeExplotion = 150;
  explosion = null;
  constructor({ possition, sideToPlay }) {
    super({ possition, sideToPlay });
    this.possition = possition;
    this.image.src = "/assects/enemy/wolfBoss.png";
    this.frameWidth = 240;
    this.frameHeight = 281;
    this.live = 2000;
    this.faceToLeft = true;
    this.liveTotal = this.live;
    this.blockSize = {
      h: 150,
      w: 10,
    };
    this.timeForShoot = 3000;
    this.damage = 45;
    this.frameTime = 500 / 120;
    this.maxFrame = 5;
    this.states = {
      idle: 0,
      shoot: 1,
      hit: 2,
      move: 2,
      death: 2,
      open: 2,
      close: 2,
    };
    this.proyoectile = FireShoot as any;
    this.frameY = this.states.idle;
    this.timeToDie = 2000;

    this.possitionShowLiveY = -100;
  }
  draw(c: CanvasRenderingContext2D, deltaTime: number) {
    super.draw(c, deltaTime);
    if (this.live <= 10) {
      clearInterval(this.timeForChangeWorld);
      this.timeForChangeWorld = null;
    }
    // this.explosion.update(c, deltaTime);
    // this.explosion.drawSprite(c);
  }

  drawSprite(c: CanvasRenderingContext2D) {
    c.drawImage(
      this.image,
      this.frameX * this.frameWidth,
      this.frameY * this.frameHeight,
      this.frameWidth,
      this.frameHeight,

      this.possition.x - 130,
      this.possition.y - 160,
      240,
      280
    );
  }
  makeAttack() {
    if (!this.goingToShoot) {
      this.goingToShoot = true;
      this.frameY = this.states.shoot;
      const margin = { start: 1500, end: 600 };

      const randomNumber =
        Math.floor(Math.random() * (margin.start - margin.end + 1)) +
        margin.end;
      setTimeout(() => {
        this.addRandomAttacks();

        setTimeout(() => {
          this.frameY = this.states.idle;
          setTimeout(() => {
            this.goingToShoot = false;
          }, this.timeForShoot);
        }, this.timeFinalAnimationAttack);
      }, randomNumber);
    }
  }

  collisionArea(player: Entity) {
    if (this.side === player.side) {
      return;
    }

    this.onDetectedPlayer(player);
  }

  // Método para agregar efectos de proyectiles aleatoriamente
  addRandomAttacks() {
    const sideToPlay = this.faceToLeft;
    const minAttacks = 2;
    const maxAttacks = 2;
    // Determinar el número aleatorio de ataques (proyectiles) a disparar entre minAttacks y maxAttacks
    const numberOfAttacks =
      Math.floor(Math.random() * (maxAttacks - minAttacks + 1)) + minAttacks;

    // Variaciones posibles para las posiciones Y de los proyectiles
    const variationsY = [-60, -10, 40];

    let matrixY = 0;

    // Crear los ataques según el número aleatorio
    for (let i = 0; i < numberOfAttacks; i++) {
      // Escoger una posición aleatoria para cada ataque
      const randomY =
        variationsY[Math.floor(Math.random() * variationsY.length)];

      if (randomY == -60) {
        matrixY = 0;
      } else if (randomY == -10) {
        matrixY = 1;
      } else if (randomY == 40) {
        matrixY = 2;
      }

      const attack = new this.proyoectile({
        possition: {
          x: sideToPlay ? this.possition.x - 140 : this.possition.x + 170,
          y: this.possition.y + randomY,
          initialMatrixY: this.matrixY,
        },
        sideToPlay: this.side,
        color: this.color,
        damage: this.damage,
        origin: this.side,
        attackOuwner: this,
        type: this.proyoectile,
      });
      attack.matrix = this.matrix;
      attack.initialMatrixY = matrixY;
      this.AllattackToShow.push(attack);
    }
  }
  onDetectedPlayer(player: Entity) {
    if (this.side === player.side || this.delete || !this.canMove) {
      return;
    }
    if (GAME_IS_PAUSE()) return;
    this.makeAttack();
  }
}
