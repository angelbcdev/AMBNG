import { PlayerState } from ".";
import Player from "../Player";

export class HealState extends PlayerState {
  constructor(player: Player) {
    super("Heal", player);
  }
  enter(): void {
    super.enter();
    this.player.effectChargeY = 2;
    this.player.effectChargeX = 0;
    setTimeout(() => {
      this.player.changeState(this.player.states.idle);
    }, 250);
  }
  update(_: CanvasRenderingContext2D, __: number): void {
    this.player.effectChargeY = 2;
    this.player.canShowEffect = true;
    if (this.player.effectChargeX > this.player.effectChargeMaxFrame) {
      // this.player.changeState(this.player.states.idle);
    }
  }
  whichtKeyDown(_: string, newMatrixY: number, newMatrixX: number) {
    return { newMatrixY, newMatrixX };
  }
  exit(): void {
    this.player.canShowEffect = false;
  }
}
