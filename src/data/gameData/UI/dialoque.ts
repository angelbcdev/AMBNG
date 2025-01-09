export class Dialogue {
  text: string;
  bgcolor = "#efe8cb";
  position = { x: 0, y: 430 };
  width = 430;
  height = 200;
  limitTime = 0;
  tinker = 0;
  imagen = new Image();
  frameX = 0;
  initialFrameX = 0;
  maxFrame = 2;
  frameWidth = 126;
  frameHeight = 147;
  frameTime = 0;
  frameInterval = 1000 / 12;
  isHidden = true;
  constructor(text: string) {
    this.text = text;
    this.imagen.src = "assects/person/lan.png";
  }
  draw(c: CanvasRenderingContext2D, deltaTime: number) {
    c.fillStyle = this.bgcolor;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
    c.font = "20px Arial";
    c.fillStyle = "#6c6c6c";
    c.fillText(this.text, this.position.x + 300, this.position.y + 50);
    if (this.tinker % 2 == 0) {
      c.fillStyle = "#6c6c6c";
      c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    this.drawSprite(c, deltaTime);
    if (this.limitTime > 100) {
      this.tinker++;
      this.limitTime = 0;
    } else {
      this.limitTime += deltaTime;
    }
    if (!this.isHidden) {
      if (this.position.y > 250) {
        this.position.y -= 5;
      }
    } else {
      if (this.position.y < 430) {
        this.position.y += 5;
      }
    }
  }
  drawSprite(c: CanvasRenderingContext2D, deltaTime: number) {
    if (this.frameTime > this.frameInterval) {
      this.frameTime = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = this.initialFrameX;
    } else {
      this.frameTime += deltaTime;
    }
    c.drawImage(
      this.imagen,
      this.frameX * this.frameWidth,
      0,
      this.frameWidth - 4,
      this.frameHeight,
      this.position.x + 20,
      this.position.y + 30,
      100,
      100
    );
  }
  showDialogue() {
    this.isHidden = false;
  }
  hideDialogue() {
    this.isHidden = true;
  }
}
