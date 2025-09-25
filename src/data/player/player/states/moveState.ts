import { PlayerState } from ".";
import Player from "../Player";

export class MoveState extends PlayerState {
  constructor(player: Player) {
    super("move", player);
  }
  enter(): void {
    super.enter();
    this.player.frameY = this.player.states.move;
    setTimeout(() => {
      this.player.changeState(this.player.states.idle);
    }, 200);
  }
  acctionKeyDown(_: string): void {}
}
