import { Entity } from "@/entities/entity.js";
import { FireShoot } from "@/data/attacks/fireShoot.js";
import { StaticEnemy } from "../staticEnemy.js";
import { GAME_IS_PAUSE } from "@/core/gameState.js";
import {
  GospelWolfAttack,
  GospelWolfCooldown,
  GospelWolfHit,
  GospelWolfIdle,
  GospelWolfPrepareAttack,
  GospelWolfState,
} from "./states.js";

export class GospelWolfEnemy extends StaticEnemy {
  timeForChangeWorld: any;
  timeExplode = 1000;
  menyExplode = 18;
  sizeExplotion = 150;
  explosion = null;

  // Máquina de estados
  statesMachineRef = {
    idle: 0,
    prepareAttack: 1,
    attack: 2,
    cooldown: 3,
    hit: 4,
  };

  statesMachine: GospelWolfState[];
  stateMachineIndex = 0;
  currentState: GospelWolfState;

  constructor({ possition, sideToPlay }) {
    super({ possition, sideToPlay });
    this.possition = possition;
    this.image.src = "/assects/enemy/wolfBoss.png";
    this.frameWidth = 240;
    this.frameHeight = 281;
    this.live = 500;
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

    // Inicializar máquina de estados
    this.statesMachine = [
      new GospelWolfIdle(this),
      new GospelWolfPrepareAttack(this),
      new GospelWolfAttack(this),
      new GospelWolfCooldown(this),
      new GospelWolfHit(this),
    ];

    this.currentState = this.statesMachine[this.stateMachineIndex];
    this.currentState.enter();
  }

  changeState(newState: number) {
    if (this.delete || GAME_IS_PAUSE()) return;

    this.currentState.exit();
    this.stateMachineIndex = newState;
    this.currentState = this.statesMachine[this.stateMachineIndex];
    this.currentState.enter();
  }

  draw(c: CanvasRenderingContext2D, deltaTime: number) {
    super.draw(c, deltaTime);

    // Actualizar el estado actual
    this.currentState.update(c, deltaTime);

    if (this.live <= 10) {
      clearInterval(this.timeForChangeWorld);
      this.timeForChangeWorld = null;
    }
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

  collisionArea(player: Entity) {
    if (this.side === player.side) {
      return;
    }
    this.onDetectedPlayer(player);
  }

  onDetectedPlayer(player: Entity) {
    if (this.side === player.side || this.delete || !this.canMove) {
      return;
    }
    if (GAME_IS_PAUSE()) return;

    // Solo cambiar a estado de ataque si está en idle
    // NO cambiar si está en cooldown, prepareAttack o attack
    if (this.stateMachineIndex === this.statesMachineRef.idle) {
      this.changeState(this.statesMachineRef.prepareAttack);
    }
  }

  // Método para cuando recibe daño
  takeDamage(damage: number) {
    this.live -= damage;

    if (this.live > 10) {
      this.changeState(this.statesMachineRef.hit);
    }
  }
}
