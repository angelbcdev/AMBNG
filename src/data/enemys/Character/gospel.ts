import { Entity } from "@/entities/entity.js";
import { FireShoot } from "../../attacks/fireShoot.js";
import { StaticEnemy } from "../staticEnemy.js";

import { ENTITY_MANAGER } from "@/core/entityManager.js";

export class GospelWolfEnemy extends StaticEnemy {
  timeForChangeWorld: any;
  timeExplode = 1000;
  menyExplode = 18;
  sizeExplotion = 150;
  constructor({ possition, sideToPlay }) {
    super({ possition, sideToPlay });
    this.possition = possition;
    this.image.src = "/assects/enemy/wolfBoss.png";
    this.frameWidth = 240;
    this.frameHeight = 281;
    this.live = 2000;
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
    this.timeToDie = 8000;

    this.possitionShowLiveY = -114;
  }
  draw(c, deltaTime) {
    super.draw(c, deltaTime);
    if (this.live <= 10) {
      clearInterval(this.timeForChangeWorld);
      this.timeForChangeWorld = null;
    }
  }

  drawSprite(c) {
    c.save(); // Guardar el estado actual del contexto

    // Invertir el eje X si faceToLeft es verdadero
    c.scale(!this.faceToLeft ? -1 : 1, 1);

    // Ajustar la posición en X para que la imagen se pinte correctamente
    const drawX = !this.faceToLeft
      ? -this.possition.x - this.blockSize.w - 225
      : this.possition.x - 160;

    c.drawImage(
      this.image,
      this.frameX * this.frameWidth,
      this.frameY * this.frameHeight,
      this.frameWidth,
      this.frameHeight,

      drawX,
      this.possition.y - 140,
      240,
      280
    );

    c.restore();
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
        this.addRandomAttacks(
          this.faceToLeft,
          this.color || "red",
          "player",
          this.damage,
          this.proyoectile,
          this.possition
        );

        setTimeout(() => {
          this.frameY = this.states.idle;
          setTimeout(() => {
            this.goingToShoot = false;
          }, this.timeForShoot);
        }, this.timeFinalAnimationAttack);
      }, randomNumber);
    }
  }
  // validCollision(attack: Nodo) {
  //   if (
  //     attack.possition.x + attack.width >= this.possition.x &&
  //     attack.possition.x <= this.possition.x + this.width &&
  //     attack.possition.y + attack.height + this.blockSize.h >=
  //       this.possition.y &&
  //     attack.possition.y <= this.possition.y + this.blockSize.h
  //   ) {
  //     this.resiveDamage(attack);
  //   }
  // }

  collisionArea(player: Entity) {
    if (this.side === player.side) {
      return;
    }

    this.onDetectedPlayer(player);
  }

  // Método para agregar efectos de proyectiles aleatoriamente
  addRandomAttacks(
    sideToPlay,
    color,
    layerShoots,
    damage,
    proyoectile,
    position,
    minAttacks = 3,
    maxAttacks = 3
  ) {
    // Determinar el número aleatorio de ataques (proyectiles) a disparar entre minAttacks y maxAttacks
    const numberOfAttacks =
      Math.floor(Math.random() * (maxAttacks - minAttacks + 1)) + minAttacks;

    // Variaciones posibles para las posiciones Y de los proyectiles
    const variationsY = [-60, -10, 40, 90];

    // Crear los ataques según el número aleatorio
    for (let i = 0; i < numberOfAttacks; i++) {
      // Escoger una posición aleatoria para cada ataque
      const randomY =
        variationsY[Math.floor(Math.random() * variationsY.length)];

      ENTITY_MANAGER.addNewEffect({
        effect: proyoectile,
        possition: {
          x: sideToPlay ? position.x - 140 : position.x + 170, // Calcula la posición X dependiendo del lado
          y: position.y + randomY, // Usar la posición Y aleatoria
          initialMatrixY: variationsY.findIndex((y) => y === randomY),
        },
        sideToPlay: sideToPlay,
        color: color,
        origin: layerShoots,
        damage: damage,
      });
    }
  }
  onDetectedPlayer(player: Entity) {
    if (this.side === player.side || this.delete || !this.canMove) {
      return;
    }
    this.makeAttack();
  }
}
