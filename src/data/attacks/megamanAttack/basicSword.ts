import { GAME_IS_DEV } from "@/scenes/battleScene/sources/gameState";
import { Entity } from "../../player/entity";
import Attack from "../attacks";

export class BasicSword extends Attack {
  sixe = 1;
  constructor(data: any) {
    const { type = 1 } = data;

    super(data as any);
    this.sixe = type;
    this.width = 30 * (1 + this.sixe);
    this.height = 20;
    this.ajustY = 23;
    this.frameX = 0;

    this.delete = false;
    this.speed = 0.5;

    this.frameAjustY = 10;
    this.frameAjustX = 10;
    this.heightSprite = 40;
    this.widthSprite = 40;

    setTimeout(() => {
      this.delete = true;
    }, 150);
  }
  update(c: CanvasRenderingContext2D, deltaTime: number) {
    super.update(c, deltaTime);
  }
  drawSprite(c) {
    if (GAME_IS_DEV()) {
      c.fillStyle = this.color;
      c.fillRect(this.possition.x, this.possition.y, this.width, this.height);
    }
  }
  limitByMatrix(_: number) {
    // if (this.isToLeft === "left") {
    //   this.possition.x -= this.speed * deltaTime;
    // } else {
    //   this.possition.x += this.speed * deltaTime;
    // }
  }
  attackEnemyEfect(_: Entity) {
    // if (character.side === 1) {
    //   character.matrixX += this.backMove;
    // } else {
    //   character.matrixX -= this.backMove;
    // }
  }
}
