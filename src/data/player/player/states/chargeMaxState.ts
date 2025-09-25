import { keyBindings } from "@/config/keyBindings";
import { PlayerState } from ".";
import Player, { playerAllAttacks } from "../Player";

export class ShootStateMax extends PlayerState {
  canCountTimer: boolean;
  constructor(player: Player) {
    super("shoot Max", player);
  }
  enter(): void {
    super.enter();
    this.canCountTimer = true;
    this.player.damageExtra = 50;
    this.player.makeShoot = false;
    this.player.effectPhase = 1;
    this.player.canShoot = false;
    this.player.effectChargeY = 1;
  }
  update(_: CanvasRenderingContext2D, __: number): void {
    if (this.canCountTimer) {
      this.player.canShowEffect = true;
    }
  }

  acctionKeyUp(key: string): void {
    const handleEvents = {
      [keyBindings.singleShoot]: () => {
        if (!this.player.makeShoot) {
          this.player.frameY = this.player.states.shoot;
          this.player.makeShoot = true;
          this.player.canShoot = true;
          this.canCountTimer = false;
          this.player.canShowEffect = false;
          this.player.makeAttack(playerAllAttacks.BASIC_MAX);
          setTimeout(() => {
            this.player.changeState(this.player.stateReference.IDLE);
          }, 500);
        }
      },
    };
    if (handleEvents[key]) {
      handleEvents[key]();
    }
  }
  exit(): void {}
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
    };

    if (handleEvents[key]) {
      handleEvents[key]();
    }

    return { newMatrixY, newMatrixX };
  }
}
