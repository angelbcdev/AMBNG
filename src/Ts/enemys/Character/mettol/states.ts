import Enemy from "../../enemys";
import { Mettols } from "./mettol";

export class Mettolstates {
  state = "no state";
  enemy: Mettols;
  timeMoveRandom = 1000;
  timeOut = null;
  interval = null;
  constructor(sate, enemy) {
    this.state = sate;
    this.enemy = enemy;
  }
  enter() {
    this.enemy.frameX = 0;
  }
  update(_: number) {}
  onCollision(player: any): void {
    if (this.enemy.side === player.side) {
      return;
    }

    if (
      player.possition.x <
        this.enemy.possitionXAreaRango + this.enemy.widthAreaRango &&
      player.possition.x + player.width > this.enemy.possitionXAreaRango &&
      player.possition.y <
        this.enemy.possition.y + this.enemy.heightAreaRango &&
      player.possition.y + player.height > this.enemy.possition.y
    ) {
      this.enemy.onDetectedPlayer(player);
    }
  }
  exit() {
    this.enemy.frameX = 0;

    clearInterval(this.interval);
    clearTimeout(this.timeOut);
    this.interval = null;
    this.timeOut = null;
  }
}
export class MettolstatesIDLE extends Mettolstates {
  constructor(enemy: Enemy) {
    super("idle", enemy);
  }
  enter() {
    super.enter();
    this.timeOut = this.enemy.frameY = this.enemy.states.idle;
    setTimeout(() => {
      this.enemy.changeState(this.enemy.finiteStates.move);
    }, this.timeMoveRandom);
  }
  exit(): void {
    super.exit();
  }
  onCollision(_: any): void {
    super.onCollision(_);
  }
}
export class MettolstatesMove extends Mettolstates {
  constructor(enemy: Enemy) {
    super("Move", enemy);
  }
  enter() {
    super.enter();

    this.interval = setInterval(() => {
      if (!this.enemy.isVisible) {
        return;
      }
      const random =
        this.enemy.move[Math.floor(Math.random() * this.enemy.move.length)];
      if (this.enemy.canMove && !this.enemy?.game?.gameIsPaused) {
        this.enemy.acctionKeyDown(random);
        // this.enemy.changeState(this.enemy.finiteStates.idle);
      }
    }, this.timeMoveRandom * 2);
  }
  update(_: number) {}
  onCollision(_: any): void {
    super.onCollision(_);
  }
  exit() {
    super.exit();
  }
}
export class MettolstatesAttack extends Mettolstates {
  canAttack = true;
  timeForOut = 0;
  constructor(enemy: Enemy) {
    super("Attack", enemy);
  }
  enter() {
    super.enter();
    this.enemy.frameY = this.enemy.states.shoot;
  }
  update(_: number) {}
  onCollision(_: any): void {
    if (this.canAttack && this.enemy.frameX == 6) {
      this.canAttack = false;

      this.enemy.addAttack({
        typeElemetns: this.enemy.proyoectile,
        damage: this.enemy.damage,
      });

      this.enemy.timerForAttack = 0;

      this.enemy.canAttack = false;
    }
  }
  exit(): void {
    super.exit();
    this.canAttack = true;
    this.enemy.frameY = this.enemy.states.idle;
  }
}
export class MettolstatesHit extends Mettolstates {
  constructor(enemy: Enemy) {
    super("Hit", enemy);
  }
  enter() {
    super.enter();
    this.enemy.frameY = this.enemy.states.hit;
    this.timeOut = setTimeout(() => {
      this.enemy.changeState(this.enemy.finiteStates.idle);
    }, 2000);
  }
  exit(): void {
    super.exit();
    this.enemy.countTimerForAttack = true;
    this.enemy.timerForAttack = 0;
  }
  onCollision(_: any): void {}
}
