import { keyBindings } from "@/config/keyBindings";
import { PlayerState } from ".";
import Player, { playerAllAttacks } from "../player";

export class ShootStateCharge extends PlayerState {
  timeForCharge = 2000;
  timer = 0;
  canCountTimer = false;
  timerForIdle = 1000;
  constructor(player: Player) {
    super("shoot charge", player);
  }
  enter(): void {
    super.enter();
    this.timer = 0;
    this.player.damageExtra = 20;
    this.player.makeShoot = false;
    this.player.effectPhase = 0;
    this.player.canShoot = false;
    this.player.effectChargeY = 0;
  }
  update(_: CanvasRenderingContext2D, deltaTime: number): void {
    if (this.canCountTimer) {
      this.player.canShowEffect = true;
      this.player.frameY = this.player.states.idle;

      if (this.timer >= this.timeForCharge) {
        this.timer = 0;
        this.canCountTimer = false;
        this.player.changeState(this.player.stateReference.SHOOT_MAX);
      } else {
        this.timer += deltaTime;
      }
    }
    if (!this.canCountTimer && this.player.makeShoot) {
      if (this.timer > this.timerForIdle) {
        this.timer = 0;
      } else {
        this.timer += deltaTime;
      }
    }
  }

  acctionKeyUp(key: string): void {
    const handleEvents = {
      [keyBindings.singleShoot]: () => {
        this.player.frameY = this.player.states.shoot;
        this.player.makeShoot = true;
        this.player.canShoot = true;
        this.canCountTimer = false;
        this.player.makeAttack(playerAllAttacks.BASIC_CHARGE);
        setTimeout(() => {
          this.player.changeState(this.player.stateReference.IDLE);
        }, 300);
      },
    };
    if (handleEvents[key]) {
      handleEvents[key]();
    }
  }

  exit(): void {
    this.player.canShowEffect = false;
  }
  whichtKeyDown(key: string, newMatrixY: number, newMatrixX: number) {
    const handleEvents = {
      ArrowUp: () => {
        newMatrixY -= 1;
      },
      ArrowDown: () => {
        newMatrixY += 1;
      },
      ArrowLeft: () => {
        newMatrixX -= 1;
      },
      ArrowRight: () => {
        newMatrixX += 1;
      },
      [keyBindings.singleShoot]: () => {
        this.canCountTimer = true;
      },
    };

    if (handleEvents[key]) {
      handleEvents[key]();
    }

    return { newMatrixY, newMatrixX };
  }
}
