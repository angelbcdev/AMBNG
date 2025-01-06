import Attack from "./attacks";

export class FireShoot extends Attack {
  constructor(data) {
    super(data);
    const {
      possition: { x, y },
      faceToLeft,
      color,
    } = data;

    this.faceToLeft = faceToLeft;
    this.possition = { x: x, y: y };
    this.color = color + "30";
    this.width = 30;
    this.height = 35;
    this.ajustY = 40;
    this.frameX = 0;
    this.frameTime = 100 / 1060;
    this.frameWidth = 128;
    this.frameHeight = 165;

    this.isToLeft = data.sideToPlay ? "left" : "right";
    this.delete = false;
    this.speed = 1;
    this.image.src = `../../assects/attaks/fireShoot.png`;
    this.drawxStings = {
      xl: 50,
      rl: 10,
      ll: -1,
    };
  }
  update(c: CanvasRenderingContext2D, deltaTime: number) {
    super.update(c, deltaTime);
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

      this.drawX,
      this.possition.y - this.ajustY,
      this.width + 20,
      this.height + 50
    );

    c.restore();
  }
}
