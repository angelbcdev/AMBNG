import { PlayerState } from ".";
import Player from "../player";

export class IdleState extends PlayerState {
  constructor(player: Player) {
    super("idle", player);
  }
  enter(): void {
    super.enter();
    this.player.frameInterval = 1000 / 6;
    this.player.frameY = this.player.states.idle;
  }
  update(_: CanvasRenderingContext2D, __: number): void {}
  exit(): void {
    this.player.frameInterval = 1000 / this.player.fps;
  }
}
