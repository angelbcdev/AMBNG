import { GAME_IS_DEV } from "@/core/gameState";
import Attack from "@/data/attacks/attacks";

export class CannonDumpAttack extends Attack {
  onCollisionPlayer = false;
  constructor(data) {
    super(data);
    this.matrix = data.matrix;

    this.color = "#ff0070" + "80";
    this.width = 30;
    this.height = 35;
    this.ajustY = 70;
    this.frameX = 0;
    this.frameTime = 100 / 1060;
    this.frameWidth = 40;
    this.frameHeight = 55;
    this.maxFrame = 2;
    this.initialMatrixY = data.initialMatrixY;
    this.isToLeft = data.sideToPlay ? "left" : "right";
    this.delete = false;
    this.speed = 0.2;
    this.attackOuwner = data.attackOuwner;
    this.image.src = `/assects/enemy/cannonDumb/miraCannon.png`;
    this.drawxStings = {
      xl: 50,
      rl: 10,
      ll: -1,
    };
  }
  update(c: CanvasRenderingContext2D, deltaTime: number) {
    super.update(c, deltaTime);
    if (this.possition.x > 480 || this.possition.x < -30) {
      this.delete = true;
    }

    if (GAME_IS_DEV()) {
      c.fillStyle = this.color;
      c.fillRect(this.possition.x, this.possition.y, this.width, this.height);
    }
  }
  updateframe(deltaTime: number) {
    if (!this.onCollisionPlayer) {
      return;
    }
    if (this.frameTime > this.frameInterval) {
      this.frameTime = 0;
      this.frameX =
        this.frameX < this.maxFrame ? this.frameX + 1 : this.incialFrameX;
    } else {
      this.frameTime += deltaTime;
    }
  }
  drawSprite(c: CanvasRenderingContext2D) {
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

      this.possition.x - 15,
      this.possition.y - this.ajustY,
      this.width + 20,
      this.height + 50
    );

    c.restore();
  }
  attackCollision(_: any) {
    this.onCollisionPlayer = true;
    this.speed = 0;
    this.possition.x = this.possition.x + 0;

    setTimeout(() => {
      this.delete = true;
    }, 350);

    // this.onCollisionPlayer = true;
  }
  getMatrixIndices = (_: number, __: number, ___: number) => {
    return true;
  };
}
