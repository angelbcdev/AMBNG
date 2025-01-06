import { PlayerState } from ".";
import Player from "../player";

export class ShieldState extends PlayerState {
  constructor(player: Player) {
    super("Shield", player);
  }
  enter(): void {
    super.enter();
    this.player.frameY = this.player.states.shield;
    setTimeout(() => {
      this.player.changeState(this.player.states.idle);
    }, 750);
  }
  update(_: CanvasRenderingContext2D, __: number): void {}
  whichtKeyDown(_: string, newMatrixY: number, newMatrixX: number) {
    return { newMatrixY, newMatrixX };
  }
  exit(): void {}
}
