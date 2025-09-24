import { GAME_IS_DEV } from "@/scenes/battleScene/sources/gameState";
import Attack from "./attacks";

export class StaticAttack extends Attack {
  constructor(data: any) {
    super(data as any);
    this.image.src = `assects/enemy/explotion.png`;

    this.frameWidth = 41;
    this.frameHeight = 68;
    this.frameTime = 0;
    this.incialFrameX = 0;
    this.frameX = this.incialFrameX;
    this.frameY = 0;
    this.frameInterval = 1000 / 12;
    this.maxFrame = 12;
    this.blockSize = {
      h: 50,
      w: 70,
    };

    this.width = 41;
    this.height = 28;
    setTimeout(() => {
      this.delete = true;
    }, 1000);
  }

  update(c: CanvasRenderingContext2D, _: number) {
    // this.draw(c, deltaTime);
    // if (this.frameX >= this.maxFrame) {
    //   this.delete = true;
    // }
    if (GAME_IS_DEV()) {
      c.fillStyle = this.color;
      c.fillRect(this.possition.x, this.possition.y, this.width, this.height);
    }
  }

  drawSprite(c: CanvasRenderingContext2D) {
    c.drawImage(
      this.image,
      (this.frameX + 2) * this.frameWidth,
      this.frameY * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      this.possition.x + 15,
      this.possition.y,
      this.blockSize.w,
      this.blockSize.h
    );
    c.drawImage(
      this.image,
      this.frameX * this.frameWidth,
      this.frameY * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      this.possition.x,
      this.possition.y - 15,
      this.blockSize.w,
      this.blockSize.h
    );
    c.drawImage(
      this.image,
      (this.frameX - 2) * this.frameWidth,
      this.frameY * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      this.possition.x - 15,
      this.possition.y,
      this.blockSize.w,
      this.blockSize.h
    );
  }
}
