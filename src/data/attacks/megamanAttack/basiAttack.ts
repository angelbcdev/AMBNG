import Attack from "../attacks";
import { ASSET_MANAGER } from "@/core/assetManager";
import { ASSET_SOURCES } from "@/core/assetshandler/assetSources";

export class BasicAttack extends Attack {
  constructor(data: any) {
    super(data as any);

    this.width = 25;
    this.height = 20;
    this.ajustY = 23;
    this.frameX = 0;

    this.delete = false;
    this.speed = 0.5;
    {
      const key = "attack:basicBullet";
      if (ASSET_MANAGER.has(key)) this.image = ASSET_MANAGER.get(key);
      else {
        const def = (ASSET_SOURCES.attacks || []).find((d) => d.key === key);
        if (def) this.image.src = def.url;
      }
    }
    this.frameAjustY = 10;
    this.frameAjustX = 10;
    this.heightSprite = 40;
    this.widthSprite = 40;
  }
  update(c: CanvasRenderingContext2D, deltaTime: number) {
    super.update(c, deltaTime);
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
      this.possition.y - this.frameAjustY - 32,
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
}
