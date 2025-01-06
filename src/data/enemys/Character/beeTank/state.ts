import BeeTank from "./beetank";

class BeeTankState {
  enemy: BeeTank;
  state: string;
  savePositionY = 0;
  constructor(enemy: BeeTank, state: string) {
    this.enemy = enemy;
    this.state = state;
  }
  enter() {}
  update(_: CanvasRenderingContext2D, __: number) {}
  exit() {}
}

export class Idle extends BeeTankState {
  constructor(enemy: BeeTank) {
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

export class MoveDown extends BeeTankState {
  constructor(enemy: BeeTank) {
    super(enemy, "moveDown");
  }
  enter(): void {
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
export class MoveUp extends BeeTankState {
  constructor(enemy: BeeTank) {
    super(enemy, "moveUp");
  }
  enter(): void {
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

export class AttackS extends BeeTankState {
  makeAttack = true;
  constructor(enemy: BeeTank) {
    super(enemy, "attack");
  }
  enter(): void {
    this.enemy.frameX = 0;

    this.enemy.frameY = this.enemy.states.attack;
  }
  update(_: CanvasRenderingContext2D, __: number) {
    if (this.enemy.frameX >= this.enemy.maxFrame) {
      this.enemy.incialFrameX = this.enemy.maxFrame;
      if (this.enemy.canAttack && this.makeAttack) {
        this.enemy.canAttack = false;

        this.enemy.addAttack({
          typeElemetns: this.enemy.proyoectile,
          damage: this.enemy.damage,
        });
        setTimeout(() => {
          this.makeAttack = true;
          this.enemy.changeState(this.enemy.statesMachineRef.idle);
        }, this.enemy.timeForAttack);
      }
    }
  }
  exit(): void {
    this.enemy.frameX = 0;
    this.enemy.incialFrameX = 0;
    this.makeAttack = true;
  }
}
