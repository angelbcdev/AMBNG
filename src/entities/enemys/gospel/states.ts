// import { Entity } from "@/entities/entity.js";
// import { FireShoot } from "@/data/attacks/fireShoot.js";
// import { StaticEnemy } from "../staticEnemy.js";
// import { GAME_IS_PAUSE } from "@/core/gameState.js";
import { GospelWolfEnemy } from "./gospel.js";

// ===== MÁQUINA DE ESTADOS =====

export class GospelWolfState {
  enemy: GospelWolfEnemy;
  state: string;

  constructor(enemy: GospelWolfEnemy, state: string) {
    this.enemy = enemy;
    this.state = state;
  }

  enter() {}
  update(_: CanvasRenderingContext2D, __: number) {}
  exit() {}
}

// Estado: Idle (Espera)
export class GospelWolfIdle extends GospelWolfState {
  idleTimer: any;

  constructor(enemy: GospelWolfEnemy) {
    super(enemy, "idle");
  }

  enter(): void {
    this.enemy.frameY = this.enemy.states.idle;

    // Tiempo aleatorio antes de atacar (1-3 segundos)
    const waitTime = Math.random() * 2000 + 1000;

    this.idleTimer = setTimeout(() => {
      if (!this.enemy.delete && this.enemy.live > 10) {
        this.enemy.changeState(this.enemy.statesMachineRef.prepareAttack);
      }
    }, waitTime);
  }

  update(_: CanvasRenderingContext2D, __: number) {
    super.update(_, __);
  }

  exit(): void {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
  }
}

// Estado: Preparar Ataque
export class GospelWolfPrepareAttack extends GospelWolfState {
  prepareTimer: any;

  constructor(enemy: GospelWolfEnemy) {
    super(enemy, "prepareAttack");
  }

  enter(): void {
    this.enemy.frameY = this.enemy.states.shoot;

    // Tiempo aleatorio de preparación (600-1500ms)
    const margin = { start: 1500, end: 600 };
    const randomTime =
      Math.floor(Math.random() * (margin.start - margin.end + 1)) + margin.end;

    this.prepareTimer = setTimeout(() => {
      if (!this.enemy.delete && this.enemy.live > 10) {
        this.enemy.changeState(this.enemy.statesMachineRef.attack);
      }
    }, randomTime);
  }

  update(_: CanvasRenderingContext2D, __: number) {
    super.update(_, __);
  }

  exit(): void {
    if (this.prepareTimer) {
      clearTimeout(this.prepareTimer);
      this.prepareTimer = null;
    }
  }
}

// Estado: Atacar
export class GospelWolfAttack extends GospelWolfState {
  attackTimer: any;

  constructor(enemy: GospelWolfEnemy) {
    super(enemy, "attack");
  }

  enter(): void {
    this.enemy.frameY = this.enemy.states.shoot;

    // Ejecutar el ataque
    this.executeAttack();

    // Volver a idle después de la animación
    this.attackTimer = setTimeout(() => {
      if (!this.enemy.delete && this.enemy.live > 10) {
        this.enemy.changeState(this.enemy.statesMachineRef.cooldown);
      }
    }, this.enemy.timeFinalAnimationAttack);
  }

  executeAttack() {
    const sideToPlay = this.enemy.faceToLeft;

    // Número aleatorio de ataques (1-4)
    const minAttacks = 1;
    const maxAttacks = 4;
    const numberOfAttacks =
      Math.floor(Math.random() * (maxAttacks - minAttacks + 1)) + minAttacks;

    // Variaciones posibles para las posiciones Y
    const variationsY = [-60, -10, 40];

    // Crear un array de posiciones Y únicas para cada proyectil
    const usedPositions: number[] = [];

    for (let i = 0; i < numberOfAttacks; i++) {
      let randomY;
      let matrixY;
      let attempts = 0;
      const maxAttempts = 10;

      // Buscar una posición Y que no se haya usado
      do {
        const randomIndex = Math.floor(Math.random() * variationsY.length);
        randomY = variationsY[randomIndex];
        attempts++;
      } while (
        usedPositions.includes(randomY) &&
        attempts < maxAttempts &&
        numberOfAttacks <= variationsY.length
      );

      // Agregar la posición usada al array
      usedPositions.push(randomY);

      // Determinar matrixY según la posición
      if (randomY === -60) {
        matrixY = 0;
      } else if (randomY === -10) {
        matrixY = 1;
      } else {
        matrixY = 2;
      }

      // Delay entre proyectiles (100-300ms)
      const shootDelay = 100 + Math.random() * 700;

      setTimeout(() => {
        if (!this.enemy.delete) {
          const attack = new this.enemy.proyoectile({
            possition: {
              x: sideToPlay
                ? this.enemy.possition.x - 140
                : this.enemy.possition.x + 170,
              y: this.enemy.possition.y + randomY,
              initialMatrixY: this.enemy.matrixY,
            },
            sideToPlay: this.enemy.side,
            color: this.enemy.color,
            damage: this.enemy.damage,
            origin: this.enemy.side,
            attackOuwner: this.enemy,
            type: this.enemy.proyoectile,
          });
          attack.matrix = this.enemy.matrix;
          attack.initialMatrixY = matrixY;
          this.enemy.AllattackToShow.push(attack);
        }
      }, shootDelay * i);
    }
  }

  update(_: CanvasRenderingContext2D, __: number) {
    super.update(_, __);
  }

  exit(): void {
    if (this.attackTimer) {
      clearTimeout(this.attackTimer);
      this.attackTimer = null;
    }
  }
}

// Estado: Cooldown (Enfriamiento después de atacar)
export class GospelWolfCooldown extends GospelWolfState {
  cooldownTimer: any;

  constructor(enemy: GospelWolfEnemy) {
    super(enemy, "cooldown");
  }

  enter(): void {
    this.enemy.frameY = this.enemy.states.idle;

    // Cooldown de 2-4 segundos
    const cooldownTime = Math.random() * 2000 + 2000;

    this.cooldownTimer = setTimeout(() => {
      if (!this.enemy.delete && this.enemy.live > 10) {
        this.enemy.changeState(this.enemy.statesMachineRef.idle);
      }
    }, cooldownTime);
  }

  update(_: CanvasRenderingContext2D, __: number) {
    super.update(_, __);
  }

  exit(): void {
    if (this.cooldownTimer) {
      clearTimeout(this.cooldownTimer);
      this.cooldownTimer = null;
    }
  }
}

// Estado: Hit (Recibir daño)
export class GospelWolfHit extends GospelWolfState {
  hitTimer: any;

  constructor(enemy: GospelWolfEnemy) {
    super(enemy, "hit");
  }

  enter(): void {
    this.enemy.frameY = this.enemy.states.hit;

    this.hitTimer = setTimeout(() => {
      if (!this.enemy.delete && this.enemy.live > 10) {
        this.enemy.changeState(this.enemy.statesMachineRef.idle);
      }
    }, 300);
  }

  update(_: CanvasRenderingContext2D, __: number) {
    super.update(_, __);
  }

  exit(): void {
    if (this.hitTimer) {
      clearTimeout(this.hitTimer);
      this.hitTimer = null;
    }
  }
}
