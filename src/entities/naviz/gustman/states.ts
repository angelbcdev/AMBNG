// import { GAME_IS_PAUSE } from "@/core/gameState";
import { FLOOR_MANAGER } from "@/core/floorManager";
import { Gustman } from "./gustman";
import { ENTITY_MANAGER } from "@/core/entityManager";
import { getTimebetweenSeconds } from "@/scenes/worldScene/sources/utils";

const SETUP = {
  MOVE: {
    init: 250,
    max: 1000,
  },
  ATTACK_SMASH: {
    init: 250,
    max: 1500,
  },
  ATTACK_PUSH: {
    init: 500,
    max: 1000,
  },
  ATTACK_SMASH_BROKEN: {
    init: 750,
    max: 2500,
  },
};

export class Gustmanstates {
  navy: Gustman;
  state: string;

  static timerForMove = 0;
  static maxTimeForMove = SETUP.MOVE.max;

  static timeForAttackSmash = 0;
  static maxTimeForAttackSmash = SETUP.ATTACK_SMASH.max;

  static timeForAttackPush = 0;
  static maxTimeForAttackPush = SETUP.ATTACK_PUSH.max;

  static timeForAttackSmashBroken = 0;
  static maxTimeForAttackSmashBroken = SETUP.ATTACK_SMASH_BROKEN.max;

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
      Gustmanstates.maxTimeForMove = getTimebetweenSeconds(
        SETUP.MOVE.init,
        SETUP.MOVE.max,
      );
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
      Gustmanstates.maxTimeForAttackSmash = getTimebetweenSeconds(
        SETUP.ATTACK_SMASH.init,
        SETUP.ATTACK_SMASH.max,
      );
    }
  }
  countTimeForAttackPush(deltaTime: number) {
    Gustmanstates.timeForAttackPush += deltaTime;

    if (Gustmanstates.timeForAttackPush >= Gustmanstates.maxTimeForAttackPush) {
      this.navy.acctionMoveNavy("Punch");
      this.navy.changeState("attackPush");
      Gustmanstates.timeForAttackPush = 0;
      Gustmanstates.maxTimeForAttackPush = getTimebetweenSeconds(
        SETUP.ATTACK_PUSH.init,
        SETUP.ATTACK_PUSH.max,
      );
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
        SETUP.ATTACK_SMASH_BROKEN.init,
        SETUP.ATTACK_SMASH_BROKEN.max,
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
    this.countTimeForAttackSmash(__);
    if (ENTITY_MANAGER.player.matrixX == 2) {
      this.countTimeForAttackPush(__);
    }
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
    this.navy.frameX = 0;
    this.navy.frameY = this.navy.states.punch;
  }
  update(_: CanvasRenderingContext2D, __: number) {
    if (this.navy.canAttack && this.navy.frameX == this.navy.maxFrame - 2) {
      this.navy.canAnimate = false;
      //   FLOOR_MANAGER.brokeOneLine(this.navy);
      this.navy.addAttack({ type: "Punch" });
      this.navy.frameX = this.navy.maxFrame - 1;
      this.navy.canAttack = false;
      setTimeout(() => {
        this.navy.changeState("idle");
        this.navy.canAnimate = true;
      }, 600);
    }
  }
  exit() {
    // this.navy.canAnimate = true;
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
      this.navy.addAttack({ type: "Smash" });

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
