export class AddButtonComponent {
  private image = new Image();
  width = 65;
  height = 62;
  maxFrame = 2;
  frameTime = 0;
  frameInterval = 1000 / 6;
  frameX = 0;
  visible = true;

  constructor() {
    this.image.src = "assects/selectedchip/addButon.png";
  }

  setVisible(visible: boolean): void {
    this.visible = visible;
  }

  draw(c: CanvasRenderingContext2D, x: number, y: number): void {
    if (!this.visible) return;

    c.drawImage(this.image, x + 205, y + 345, this.width, this.height);
  }
}

// ChipSelectorComponent.ts
export class ChipSelectorComponent {
  private image = new Image();
  width = 46;
  height = 46;
  maxFrame = 1;
  frameTime = 0;
  frameInterval = 1000 / 6;
  frameX = 0;

  constructor() {
    this.image.src = "assects/selectedchip/selectedChip.png";
  }

  update(deltaTime: number): void {
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
    c.drawImage(
      this.image,
      this.frameX * this.width,
      0,
      this.width,
      this.height,
      x - 3,
      y - 3,
      this.width - 6,
      this.height - 6
    );
  }
}
