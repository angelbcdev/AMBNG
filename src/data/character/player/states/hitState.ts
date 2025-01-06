import { PlayerState } from ".";
import Player from "../player";

export class HitState extends PlayerState {
  constructor(player: Player) {
    super("Hit", player);
  }
  enter(): void {
    super.enter();
    this.player.frameY = this.player.states.hit;
    setTimeout(() => {
      this.player.changeState(this.player.states.idle);
    }, this.player.timeOfStuns);
  }
  whichtKeyDown(_: string, newMatrixY: number, newMatrixX: number) {
    return { newMatrixY, newMatrixX };
  }
}
