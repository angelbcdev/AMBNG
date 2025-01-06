import Fishy from "./fishy";

class FishyState {
  enemy: Fishy;
  state: string;
  savePositionY = 0;
  constructor(enemy: Fishy, state: string) {
    this.enemy = enemy;
    this.state = state;
  }
  enter() {}
  update(_: CanvasRenderingContext2D, __: number) {}
  exit() {}
}

export class FishyIdle extends FishyState {
  constructor(enemy: Fishy) {
    super(enemy, "idle");
    setTimeout(() => {
      this.enemy.changeState(this.enemy.statesMachineRef.moveDown);
    }, 500);
  }
  enter(): void {
    this.enemy.isVisible = true;
    this.enemy.canAttack = true;

    setTimeout(() => {
      this.enemy.changeState(this.enemy.statesMachineRef.moveDown);
    }, 500);
  }
  update(_: CanvasRenderingContext2D, __: number) {
    super.update(_, __);
  }
}

export class FishyMoveDown extends FishyState {
  constructor(enemy: Fishy) {
    super(enemy, "moveDown");
  }
  enter(): void {
    this.enemy.maxFrame = 0;
    this.enemy.frameY = this.enemy.states.moveDown;
  }
  update(_: CanvasRenderingContext2D, deltaTime: number) {
    this.enemy.possition.y += this.enemy.speed * deltaTime;

    if (this.enemy.possition.y > this.enemy.buttomFloor) {
      this.enemy.changeState(this.enemy.statesMachineRef.moveUp);
    }
    if (
      !this.enemy.getMatrixIndices(
        this.enemy.possition.x,
        this.enemy.possition.y
      )
    ) {
      this.enemy.changeState(this.enemy.statesMachineRef.moveUp);
    }
  }
}
export class FishyMoveUp extends FishyState {
  constructor(enemy: Fishy) {
    super(enemy, "moveUp");
  }
  enter(): void {
    this.enemy.maxFrame = 0;
    this.enemy.frameY = this.enemy.states.moveUp;
  }
  update(_: CanvasRenderingContext2D, deltaTime: number) {
    this.enemy.possition.y -= this.enemy.speed * deltaTime;
    if (this.enemy.possition.y < this.enemy.topFloor) {
      this.enemy.changeState(this.enemy.statesMachineRef.moveDown);
    }
    if (
      !this.enemy.getMatrixIndices(
        this.enemy.possition.x,
        this.enemy.possition.y
      )
    ) {
      this.enemy.changeState(this.enemy.statesMachineRef.moveDown);
    }
  }
}

export class FishyAttack extends FishyState {
  makeAttack = true;
  constructor(enemy: Fishy) {
    super(enemy, "attack");
  }
  enter(): void {
    this.enemy.maxFrame = 4;
    this.enemy.incialFrameX = 4;
    this.enemy.frameY = this.enemy.states.attack;
  }
  update(_: CanvasRenderingContext2D, __: number) {
    if (this.enemy.frameX >= this.enemy.maxFrame) {
      if (this.enemy.canAttack && this.makeAttack) {
        this.enemy.canAttack = false;
        this.enemy.isVisible = false;
        this.enemy.addAttack({
          typeElemetns: this.enemy.proyoectile,
          damage: this.enemy.damage,
        });
      }
    }
  }
  exit(): void {
    this.enemy.frameX = 0;
    this.enemy.maxFrame = 0;
    this.enemy.incialFrameX = 0;
    this.makeAttack = true;
  }
}

export class FishyStatateFall extends FishyState {
  constructor(enemy: Fishy) {
    super(enemy, "fall");
  }
  enter(): void {
    this.enemy.frameY = this.enemy.states.idle;
    this.savePositionY = this.enemy.possition.y;
    this.enemy.possition.y -= 190;
  }
  update(_: CanvasRenderingContext2D, deltaTime: number) {
    if (this.enemy.possition.y < this.savePositionY) {
      this.enemy.possition.y += this.enemy.speed * 2 * deltaTime;
      if (this.enemy.possition.y >= this.savePositionY) {
        setTimeout(() => {
          this.enemy.changeState(this.enemy.statesMachineRef.idle);
        }, 1000);
      }
    }
  }
}
