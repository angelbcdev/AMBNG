import { Entity } from "../../character/entity";
import Attack from "../attacks";

export class MegamanAttackBasic extends Attack {
  static type = {
    GROUNDMASH: 1,
    CANNONCHIP: 2,
    CHARGE: 4,
    MAX_CHARGE: 3,
  };
  static addType = "type";
  constructor(data: any) {
    const { type = 2 } = data;
    super(data as any);

    this.width = 25;
    this.height = 20;
    this.ajustY = 23;
    this.frameX = 0;
    this.isVisible = false;
    this.delete = false;
    this.speed = 0.5;
    this.image.src = `/assects/megaman/megamanAttacks.png`;
    this.frameAjustY = 74;
    this.frameAjustX = 32;
    this.frameY = type;
    this.frameWidth = 104;
    this.frameHeight = 108;
    this.heightSprite = 104;
    this.widthSprite = 108;
  }
  draw(c: CanvasRenderingContext2D, deltaTime: number): void {
    if (this.isVisible) {
      this.updateframe(deltaTime);
      this.drawSprite(c);
      if (this.frameX >= this.maxFrame) this.delete = true;
    }
  }
  update(c: CanvasRenderingContext2D, deltaTime: number) {
    if (!this.isVisible) super.update(c, deltaTime);
  }
  drawSprite(c) {
    c.save(); // Guardar el estado actual del contexto

    // Invertir el eje X si `faceToLeft` es verdadero
    c.scale(this.faceToLeft ? -1 : 1, 1);

    // Ajustar la posición en X para que la imagen se pinte correctamente

    c.drawImage(
      this.image,
      this.frameX * this.frameWidth,
      this.frameY * this.frameHeight,
      this.frameWidth,
      this.frameHeight,

      this.drawX - this.frameAjustX,
      this.possition.y - this.frameAjustY,
      this.widthSprite,
      this.heightSprite
    );

    c.restore();
  }
  limitByMatrix(deltaTime: number) {
    if (this.isToLeft === "left") {
      this.possition.x -= this.speed * deltaTime;
    } else {
      this.possition.x += this.speed * deltaTime;
    }
  }
  attackCollision(_: Entity) {
    if (!this.isVisible) {
      this.isVisible = true;
    }
  }
  // attackCollision(_: Entity) {
  //   this.delete = true;
  // }
}
