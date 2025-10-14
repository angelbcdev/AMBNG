// import { GAME_IS_PAUSE } from "@/core/gameState";
import { FLOOR_MANAGER } from "@/core/floorManager";
import { Gustman } from "./gustman";

export class Gustmanstates {
  navy: Gustman;
  state: string;

  static timerForMove = 0;
  static maxTimeForMove = 1000;

  static timeForAttackSmash = 0;
  static maxTimeForAttackSmash = 1500;

  static timeForAttackPush = 0;
  static maxTimeForAttackPush = 1500;

  static timeForAttackSmashBroken = 0;
  static maxTimeForAttackSmashBroken = 1500;

  constructor(navy: Gustman, state: string) {
    this.navy = navy;
    this.state = state;
  }

  enter() {}
  update(_: CanvasRenderingContext2D, __: number) {}
  countTimeForMove(deltaTime: number) {
    Gustmanstates.timerForMove += deltaTime;

    if (Gustmanstates.timerForMove >= Gustmanstates.maxTimeForMove) {
      this.navy.changeState("move");
      Gustmanstates.timerForMove = 0;
      Gustmanstates.maxTimeForMove = getTimebetweenSeconds(250, 1500);
    }
  }
  countTimeForAttackSmash(deltaTime: number) {
    Gustmanstates.timeForAttackSmash += deltaTime;

    if (
      Gustmanstates.timeForAttackSmash >= Gustmanstates.maxTimeForAttackSmash
    ) {
      this.navy.acctionMoveNavy("Smash");
      this.navy.changeState("attackSmash");

      Gustmanstates.timeForAttackSmash = 0;
      Gustmanstates.maxTimeForAttackSmash = getTimebetweenSeconds(3000, 5000);
    }
  }
  countTimeForAttackPush(deltaTime: number) {
    Gustmanstates.timeForAttackPush += deltaTime;

    if (Gustmanstates.timeForAttackPush >= Gustmanstates.maxTimeForAttackPush) {
      this.navy.changeState("attackPush");
      Gustmanstates.timeForAttackPush = 0;
      Gustmanstates.maxTimeForAttackPush = getTimebetweenSeconds(3000, 5000);
    }
  }
  countTimeForAttackSmashBroken(deltaTime: number) {
    Gustmanstates.timeForAttackSmashBroken += deltaTime;

    if (
      Gustmanstates.timeForAttackSmashBroken >=
      Gustmanstates.maxTimeForAttackSmashBroken
    ) {
      this.navy.acctionMoveNavy("Broken");
      this.navy.changeState("attackSmashBroken");
      Gustmanstates.timeForAttackSmashBroken = 0;
      Gustmanstates.maxTimeForAttackSmashBroken = getTimebetweenSeconds(
        3000,
        5000
      );
    }
  }
  exit() {}
}

export class GustmanstatesIDLE extends Gustmanstates {
  constructor(navy: Gustman) {
    super(navy, "idle");
  }
  enter() {
    this.navy.canAttack = true;

    this.navy.frameY = this.navy.states.idle;
  }
  update(_: CanvasRenderingContext2D, __: number) {
    this.countTimeForMove(__);
    // this.countTimeForAttackSmash(__);
    // this.countTimeForAttackPush(__);
    this.countTimeForAttackSmashBroken(__);
  }

  exit() {}
}

export class GustmanstatesMove extends Gustmanstates {
  constructor(navy: Gustman) {
    super(navy, "move");
  }
  enter() {
    super.enter();

    this.navy.acctionMoveNavy("Movemen");
    const timeOut = setTimeout(() => {
      this.navy.changeState("idle");
      clearTimeout(timeOut);
    }, 300);
  }
  update(_: CanvasRenderingContext2D, __: number) {}
  exit() {}
}

export class GustmanstatesAttackPush extends Gustmanstates {
  constructor(navy: Gustman) {
    super(navy, "attackPush");
  }
  enter() {
    super.enter();

    this.navy.frameY = this.navy.states.punch;
  }
}
export class GustmanstatesAttackSmashBroken extends Gustmanstates {
  constructor(navy: Gustman) {
    super(navy, "Smash B");
  }
  enter() {
    super.enter();
    this.navy.frameX = 0;

    this.navy.frameY = this.navy.states.mash;
  }
  update(_: CanvasRenderingContext2D, __: number) {
    if (this.navy.canAttack && this.navy.maxFrame == this.navy.frameX) {
      this.navy.canAnimate = false;
      FLOOR_MANAGER.brokeOneLine(this.navy);

      this.navy.canAttack = false;
      setTimeout(() => {
        this.navy.changeState("idle");
        this.navy.canAnimate = true;
      }, 1200);
    }
  }
  exit() {
    this.navy.canAnimate = true;
  }
}
export class GustmanstatesAttackSmash extends Gustmanstates {
  constructor(navy: Gustman) {
    super(navy, "Smash");
  }
  enter() {
    super.enter();
    this.navy.frameX = 0;

    this.navy.frameY = this.navy.states.mash;
  }
  update(_: CanvasRenderingContext2D, __: number) {
    if (this.navy.canAttack && this.navy.maxFrame == this.navy.frameX) {
      this.navy.canAnimate = false;
      // this.navy.changeState("idle");
      this.navy.smashAttack();

      this.navy.canAttack = false;
      setTimeout(() => {
        this.navy.changeState("idle");
        this.navy.canAnimate = true;
      }, 500);
    }
  }
  exit() {
    this.navy.canAnimate = true;
  }
}

export class GustmanstatesHit extends Gustmanstates {
  constructor(navy: Gustman) {
    super(navy, "hit");
  }
  enter() {
    this.navy.frameY = this.navy.states.hit;
    this.navy.frameX = 0;
    setTimeout(() => {
      // this.navy.changeState("idle");
    }, this.navy.timeOfStuns);
  }
  update(_: CanvasRenderingContext2D, __: number) {
    if (this.navy.maxFrame == this.navy.frameX) {
      this.navy.changeState("idle");
    }
  }
}

const getTimebetweenSeconds = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
