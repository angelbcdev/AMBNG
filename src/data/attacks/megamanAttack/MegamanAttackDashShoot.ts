import { Entity } from "../../player/entity";
import Attack from "../attacks";

export class MegamanAttackDashShoot extends Attack {
  constructor(data: any) {
    super(data as any);
    // this.possition = { x: data.possition.x - 30, y: data.possition.y };
    this.image.src = `/assects/megaman/megamanAttacks.png`;
    this.frameY = 5;
    this.maxFrame = 8;
    this.frameAjustY = 104;
    this.frameAjustX = 32;
    this.frameWidth = 104;
    this.frameHeight = 108;
    this.heightSprite = 180;
    this.widthSprite = 180;

    // this.isVisible = true;
    this.speed = 0.2;
  }
  // draw(c: CanvasRenderingContext2D, deltaTime: number): void {
  //   // if (this.isVisible) {
  //   this.updateframe(deltaTime);
  //   this.drawSprite(c);

  //   // } else {
  //   //   if (this.explosion != null) {
  //   //     this.explosion.draw(c, deltaTime);
  //   //     if (this.explosion.isFinished) {
  //   //       this.delete = true;
  //   //     }
  //   //   }
  //   // }
  // }

  update(c: CanvasRenderingContext2D, deltaTime: number) {
    super.update(c, deltaTime);
    if (this.possition.x > 430 || this.possition.x < -30) {
      this.attackOuwner.isVisible = true;
      // this.delete = true;
    }
  }
  attackCollision(_: Entity) {
    // if (!this.attackOuwner.isVisible) {
    //   this.attackOuwner.isVisible = true;
    //   this.isVisible = false;
    //   if (this.explosion == null) {
    //     this.explosion = new ExplotionsBombs({
    //       possition: {
    //         x: this.possition.x + 50,
    //         y: this.possition.y,
    //       },
    //       sideToPlay: this.sideToPlay,
    //       game: this.game,
    //     });
    //   }
    // }
  }
}
