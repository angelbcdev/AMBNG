import { keyBindings } from "@/config/keyBindings";
import { PlayerState } from ".";
import { Player } from "../Player";

export class ShootState extends PlayerState {
  timeForCharge = 2000;
  timer = 0;
  canCountTimer = false;

  constructor(player: Player) {
    super("shoot2", player);
  }
  enter(): void {
    super.enter();
    this.player.frameY = this.player.states.shoot;
    this.player.frameX = 0;
    this.player.canShoot = false;
  }
  update(_: CanvasRenderingContext2D, deltaTime: number): void {
    if (!this.player.makeShoot) {
      this.player.makeShoot = true;
    }
    if (
      this.player.frameY == this.player.states.shoot &&
      this.player.frameX == this.player.maxFrame
    ) {
      // this.player.frameY = this.player.states.idle;
    }

    if (this.canCountTimer) {
      // this.player.frameY = this.player.states.idle;

      if (this.timer >= this.timeForCharge) {
        this.timer = 0;
        this.canCountTimer = false;
        this.player.changeState(this.player.stateReference.SHOOT_CHARGE);
      } else {
        this.timer += deltaTime;
      }
    }
  }

  acctionKeyUp(key: string) {
    const handleEvents = {
      [keyBindings.singleShoot]: () => {
        this.player.canShoot = true;
        this.canCountTimer = false;
        this.player.makeShoot = false;
        setTimeout(() => {
          this.player.changeState(this.player.stateReference.IDLE);
        }, 500);
      },
    };
    if (handleEvents[key]) {
      handleEvents[key]();
    }
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
