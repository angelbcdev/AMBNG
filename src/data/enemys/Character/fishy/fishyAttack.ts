import Attack from "../../../attacks/attacks";
import { Nodo } from "../../../master";
import Fishy from "./fishy";

export class FishyAttackDash extends Attack {
  constructor(data: any) {
    delete data.image;
    super(data as any);
    this.image.src = `/assects/megaman/megamanAttacks.png`;
    this.frameY = 0;
    this.maxFrame = 0;
    this.frameAjustY = 50;
    this.frameAjustX = 62;
    this.frameWidth = this.attackOuwner.frameWidth;
    this.frameHeight = this.attackOuwner.frameHeight;
    this.heightSprite = 90;
    this.widthSprite = 90;
    this.frameY = 0;
    this.speed = 0.28;

    // this.attackOuwner.isVisible = false;
  }
  draw(c: CanvasRenderingContext2D, deltaTime: number): void {
    if (this.isVisible) {
      this.updateframe(deltaTime);
      this.drawSprite(c);
    } else {
      if (this.explosion != null) {
        this.explosion.draw(c, deltaTime);
        if (this.explosion.isFinished) {
          this.delete = true;
        }
      }
    }
  }
  update(c: CanvasRenderingContext2D, deltaTime: number) {
    super.update(c, deltaTime);
    if (this.possition.x > 430 || this.possition.x < -30) {
      if (this.attackOuwner instanceof Fishy) {
        this.attackOuwner.changeState(this.attackOuwner.statesMachineRef.fall);

        this.attackOuwner.isVisible = true;
        this.delete = true;
      }

      // this.attackOuwner.isVisible = true;
    }
  }
  attackCollision(_: Nodo) {}
  drawSprite(c: any): void {
    c.drawImage(
      this.attackOuwner.image,
      this.frameX * this.frameWidth,
      this.frameY * this.frameHeight,
      this.frameWidth,
      this.frameHeight,

      this.possition.x - this.frameAjustX,
      this.possition.y - this.frameAjustY,
      this.widthSprite,
      this.heightSprite
    );
  }
}
