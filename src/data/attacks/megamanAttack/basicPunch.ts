import { GAME_IS_DEV } from "@/core/gameState";
import Attack from "../attacks";
import { Entity } from "@/entities/entity";

export class BasicPunch extends Attack {
  backMove = 1;
  constructor(data: any) {
    const { type = 1 } = data;

    super(data as any);
    this.backMove = type;
    this.width = 25;
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
    }, 500);
  }
  update(c: CanvasRenderingContext2D, deltaTime: number) {
    super.update(c, deltaTime);
    this.drawSprite(c);
  }
  drawSprite(c) {
    if (GAME_IS_DEV()) {
      c.fillStyle = this.color;
      c.fillRect(this.possition.x, this.possition.y, this.width, this.height);
    }
  }
  limitByMatrix(_: number) {}
  attackEnemyEfect(character: Entity) {
    if (character.side === 1) {
      character.matrixX += this.backMove;
    } else {
      character.matrixX -= this.backMove;
    }
  }
}
