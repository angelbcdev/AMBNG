import { FLOOR_MANAGER } from "@/core/floorManager";
import { PlayerState } from ".";
import Player from "../Player";

export class UseShip extends PlayerState {
  timeKeepImage = 500;
  time = 0;
  attackPress = false;
  isDashAttack = false;
  constructor(player: Player) {
    super("use ship", player);
  }
  enter(): void {
    super.enter();
    this.player.frameX = 0;
    this.player.frameY = this.player.spriteToShip;
    switch (this.player.spriteToShip) {
      case this.player.states.swords:
        this.timeKeepImage = 15;
        break;
      case this.player.states.dash:
        break;
    }

    this.isDashAttack = this.player.spriteToShip == this.player.states.dash;
    if (this.isDashAttack) {
      this.timeKeepImage = 500;
    }
  }
  update(_: CanvasRenderingContext2D, deltaTime: number): void {
    switch (this.player.spriteToShip) {
      case this.player.states.cannon1:
        if (this.player.frameX == this.player.maxFrame) {
          this.player.frameX = 0;
          this.player.frameY = this.player.states.cannon2;
          this.player.spriteToShip = this.player.states.cannon2;
          this.timeKeepImage = 10;
        }
        break;
      case this.player.states.pickaxe1:
        if (this.player.frameX == this.player.maxFrame) {
          this.player.frameX = 0;
          this.player.frameY = this.player.states.pickaxe2;
          this.player.spriteToShip = this.player.states.pickaxe2;
          this.timeKeepImage = 10;
        }
        break;

      case this.player.states.maze:
        if (this.player.frameX == this.player.maxFrame) {
          this.player.incialFrameX = this.player.maxFrame;
          FLOOR_MANAGER.makeGameTemble();
          if (this.time >= this.timeKeepImage + 500) {
            this.player.changeState(this.player.states.idle);
            this.time = 0;
          } else {
            this.time += deltaTime;
          }
        }
        break;
      default:
        if (this.player.frameX == this.player.maxFrame) {
          this.player.incialFrameX = this.player.maxFrame;
          if (this.time >= this.timeKeepImage) {
            this.player.changeState(this.player.states.idle);
            this.time = 0;
          } else {
            this.time += deltaTime;
          }
        }
        break;
    }
  }
  whichtKeyDown(key: string, newMatrixY: number, newMatrixX: number) {
    const handleEvents = {
      g: () => {
        this.attackPress = true;
      },
    };

    if (handleEvents[key]) {
      handleEvents[key]();
    }
    return { newMatrixY, newMatrixX };
  }
  exit(): void {
    this.player.incialFrameX = 0;
    this.player.spriteToShip = 99;
    this.timeKeepImage = 500;
  }
  acctionKeyUp(key: string) {
    const handleEvents = {
      g: () => {
        this.attackPress = false;
      },
    };
    if (handleEvents[key]) {
      handleEvents[key]();
    }
  }
}
