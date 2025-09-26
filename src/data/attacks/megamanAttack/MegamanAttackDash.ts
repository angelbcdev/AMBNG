import { Entity } from "../../../entities/entity";
import { Player } from "../../player/player/Player";
import Attack from "../attacks";
import { DashShoot } from "../dashShoot";

export class MegamanAttackDash extends Attack {
  constructor(data: any) {
    // const newPossition = { x: data.possition.x - 30, y: data.possition.y };

    super(data as any);
    // this.possition = { x: newPossition.x, y: newPossition.y };
    this.image.src = `/assects/megaman/megamanAttacks.png`;
    this.frameY = 0;
    this.maxFrame = 0;
    this.frameAjustY = 104;
    this.frameAjustX = 62;
    this.frameWidth = 104;
    this.frameHeight = 108;
    this.heightSprite = 180;
    this.widthSprite = 180;

    this.frameY = 0;
    this.speed = 0.28;

    this.attackOuwner.isVisible = false;
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
      this.attackOuwner.isVisible = true;
      // this.delete = true;
    }
  }
  attackCollision(character: Entity) {
    if (!this.attackOuwner.isVisible) {
      if (this.attackOuwner instanceof Player) {
        this.attackOuwner.changeState(this.attackOuwner.states.idle);
      }

      this.attackOuwner.isVisible = true;
      this.isVisible = false;

      character.addAttack({
        typeElemetns: DashShoot,
        damage: 1,
      });

      if (this.explosion == null) {
        // this.explosion = new ExplotionsBombs({
        //   possition: {
        //     x: this.possition.x + 50,
        //     y: this.possition.y,
        //   },
        //   sideToPlay: this.sideToPlay,
        // });
      }
    }
  }
}
