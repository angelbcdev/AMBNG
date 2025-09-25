export class LogoRollComponent {
  private image = new Image();
  width = 47;
  height = 69;
  maxFrame = 3;
  frameTime = 0;
  frameInterval = 1000 / 6;
  frameX = 0;
  isAnimating = false;

  constructor() {
    this.image.src = "assects/selectedchip/logoRoll.png";
  }

  startAnimation(): void {
    this.isAnimating = true;
  }

  stopAnimation(): void {
    this.isAnimating = false;
    this.frameTime = 0;
    this.frameX = 0;
  }

  update(deltaTime: number): void {
    if (!this.isAnimating) return;

    if (this.frameTime > this.frameInterval) {
      this.frameTime = 0;
      if (this.frameX < this.maxFrame) {
        this.frameX++;
      } else {
        this.frameX = 0;
      }
    } else {
      this.frameTime += deltaTime;
    }
  }

  draw(c: CanvasRenderingContext2D, x: number, y: number): void {
    if (!this.isAnimating) return;

    c.drawImage(
      this.image,
      this.frameX * this.width,
      0,
      this.width,
      this.height,
      x + 228,
      y + 4,
      this.width - 6,
      this.height - 10
    );
  }
}
