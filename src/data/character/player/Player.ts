import {
  BasicPunsh,
  MegamanAttackBasic,
  MegamanAttackDash,
} from "../../attacks/basicAttack.ts";

import { Entity } from "../entity";

import { BattleShip } from "./chips/index.ts";
import { ShootStateMax } from "./states/chargeMaxState.ts";
import { ShootStateCharge } from "./states/chargeShootState.ts.ts";
import { HealState } from "./states/healState.ts";
import { HitState } from "./states/hitState.ts";
import { IdleState } from "./states/idleState.ts";

import { MoveState } from "./states/moveState.ts";
import { ShieldState } from "./states/shieldState.ts";
import { ShootState } from "./states/shootState.ts";
import { UseShip } from "./states/useShip.ts";

export class Player extends Entity {
  state: number;
  defense: number;

  states = {
    idle: 0,
    shoot: 2,
    move: 1,
    hit: 3,
    dash: 4,
    swords: 5,
    punsh: 6,
    maze: 7,
    shield: 8,
    cannon1: 9,
    cannon2: 10,
    bomb: 11,
    pickaxe1: 12,
    pickaxe2: 13,
  };
  stateIndex = 0;
  frameX = 0;
  frameY = this.states.idle;
  maxFrame = 5;
  frameWidth = 104;
  frameHeight = 107;
  makeShoot = false;
  timeForShoot = 1000;
  timeOfStuns = 500;
  stateReference = {
    IDLE: 0,
    MOVE: 1,
    SHOOT: 2,
    SHOOT_CHARGE: 3,
    SHOOT_MAX: 4,
    HIT: 5,
    USESHIP: 6,
    HEAL: 7,
    SHIELD: 8,
  };
  chipType: string | number;
  statesClass = [
    new IdleState(this),
    new MoveState(this),
    new ShootState(this),
    new ShootStateCharge(this),
    new ShootStateMax(this),
    new HitState(this),
    new UseShip(this),
    new HealState(this),
    new ShieldState(this),
  ];

  currentState = this.statesClass[this.stateIndex];
  effectCharge = new Image();

  effectPhase = 1;
  effectChargeX = 0;
  effectChargeY = 0;
  effectChargeWidth = 82;
  effectChargeHeight = 78;
  damageExtra: number = 0;
  spriteToShip: number = 0;
  effectChargeMaxFrame = 6;
  canShowEffect = false;
  allChips: BattleShip[] = [];

  constructor({ possition: { x, y }, sideToPlay }) {
    super({ x, y, sideToPlay });
    this.height = 35;
    this.handleInput();

    //   allChipsA.map(
    //   (chip) => new BattleShip({ title: chip.title })
    // );
    // Array(14)
    //   .fill(0)
    //   .map(() => new BattleShip({ title: "pannel3" }));

    this.matrixY = y;

    this.state = this.states.idle;
    this.live = 100;
    this.liveTotal = this.live;
    this.defense = 30;

    this.damage = 1;

    this.image = new Image();
    this.image.src = `assects/megaman/megamanAllStates.png`;

    this.collisionAttacks = [];
    this.blockSize = {
      h: 110,
      w: 90,
    };
    this.effectCharge.src = `assects/megaman/chargeEfect.png`;
  }

  update(c: CanvasRenderingContext2D, deltaTime: number) {
    super.update(c, deltaTime);
    this.currentState.update(c, deltaTime);
    if (!this.isVisible && this.AllattackToShow.length == 0) {
      this.isVisible = true;
    }
    this.showAnimation(c, deltaTime);
  }

  onCollision(attack: any) {
    super.onCollision(attack);
    const defefense = attack.damage * (this.defense / 100);

    this.live -= attack.damage - defefense;
    attack.delete = true;
    this.frameY = this.states.hit;
    setTimeout(() => {
      this.frameY = this.states.idle;
    }, this.timeOfStuns);
  }

  draw(c: CanvasRenderingContext2D, deltaTime: number) {
    super.draw(c, deltaTime);
    // this.showAnimation(c, deltaTime);
  }
  showAnimation(c: CanvasRenderingContext2D, _: number) {
    if (!this.isVisible || !this.canShowEffect) {
      return;
    }
    if (this.frameTime >= this.frameInterval) {
      if (this.effectChargeX < this.effectChargeMaxFrame) {
        this.effectChargeX++;
      } else {
        this.effectChargeX = 0;
      }
    }

    c.drawImage(
      this.effectCharge,
      this.effectChargeX * this.effectChargeWidth,
      this.effectChargeY * this.effectChargeHeight,
      this.effectChargeWidth,
      this.effectChargeHeight,
      this.possition.x - 55,
      this.possition.y - 90,
      150,
      150
    );
  }
  showChipts(c: CanvasRenderingContext2D, deltaTime: number) {
    this.allChips.forEach((chip, x) => {
      chip.draw(c, x, deltaTime);
    });
  }
  paintLive(_: CanvasRenderingContext2D) {}

  drawSprite(c: CanvasRenderingContext2D) {
    if (this.game.isDev) {
      c.fillStyle = this.color;
      c.fillRect(
        this.possition.x + this.width / 2,
        this.possition.y,
        this.width,
        this.height
      );
    }

    c.save(); // Guardar el estado actual del contexto

    // Invertir el eje X si `faceToLeft` es verdadero
    c.scale(this.faceToLeft ? -1 : 1, 1);

    // Ajustar la posición en X para que la imagen se pinte correctamente
    const drawX = this.faceToLeft
      ? -this.possition.x - this.width - 35
      : this.possition.x - 50;

    // Dibujar la imagen del sprite'
    this.drawFilter(c);
    c.drawImage(
      this.image,
      this.frameX * this.frameWidth,
      this.frameY * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      drawX,
      this.possition.y - 125,
      this.blockSize.w * 2,
      this.blockSize.h * 2
    );

    c.restore(); // Restaurar el estado del contexto
  }

  handleInput() {
    document.addEventListener("keydown", (event) => {
      this.currentState.acctionKeyDown(event.key);
    });

    document.addEventListener("keyup", (event) => {
      this.currentState.acctionKeyUp(event.key);
    });
  }

  makeAttack(attack: string) {
    this.allAttack(attack);
    this.damageExtra = 0;
  }
  allAttack(type = "basic") {
    const allAttackAvailable = {
      [playerAllAttacks.BASIC]: () => {
        const damage = this.damage + this.damageExtra;
        this.addAttack({
          typeElemetns: MegamanAttackBasic,
          damage,
        });
      },
      [playerAllAttacks.BASIC_CHARGE]: () => {
        const damage = this.damage + this.damageExtra;
        this.addAttack({
          typeElemetns: MegamanAttackBasic,
          damage,
          type: MegamanAttackBasic.type.CHARGE,
        });
      },
      [playerAllAttacks.BASIC_MAX]: () => {
        const damage = this.damage + this.damageExtra;
        this.addAttack({
          typeElemetns: MegamanAttackBasic,
          damage,
          type: MegamanAttackBasic.type.MAX_CHARGE,
        });
      },
      [playerAllAttacks.DASH]: () => {
        const damage = this.damage * 10;
        this.addAttack({
          typeElemetns: MegamanAttackDash,
          damage,
        });
      },
      [playerAllAttacks.PUNSH_BASIC]: () => {
        this.damageExtra = 50;
        const damage = this.damage + this.damageExtra;
        this.addAttack({
          typeElemetns: BasicPunsh,
          damage,
          type: this.chipType,
        });
        //BasicSword  SWORD
      },
    };
    if (allAttackAvailable[type]) {
      allAttackAvailable[type]();
    }
  }

  changeState(state: number) {
    this.currentState.exit();
    this.currentState = this.statesClass[state];
    this.currentState.enter();
  }

  resiveDamage(attack: any) {
    attack.canMakeDamage = false;

    if (this.currentState.name === "Shield") {
      attack.delete = true;
    } else {
      this.live -= attack.damage;
      this.changeState(this.stateReference.HIT);

      if (attack?.attackCollision) {
        attack?.attackCollision(this);
      }

      if (this.live <= 0) {
        this.makeDeath();
      }
    }
  }
  addChip(chips: BattleShip[]) {
    console.log("chips", chips);

    this.allChips = chips;
  }
  clearShips() {
    this.allChips = [];
  }
}

export const playerAllAttacks = {
  BASIC: "basic",
  DASH: "dash",
  PUNSH_BASIC: "punshBasic",
  PUNSH_EXTRA: "punshExtra",
  SWORD: "sword",
  SWORD_LONG: "swordLong",
  BOMB: "bomb",
  CANNON: "cannon",
  BASIC_CHARGE: "basicCharge",
  BASIC_MAX: "basicMax",
};

class PlayerBlue extends Player {
  constructor({ possition, sideToPlay }) {
    super({ possition, sideToPlay });
    this.color = "#0000ff";
    this.side = 0;

    this.faceToLeft = this.side == 0 ? false : true;
    this.matrixX = this.side == 0 ? possition.x : possition.x + 3;
  }
}
export default PlayerBlue;
