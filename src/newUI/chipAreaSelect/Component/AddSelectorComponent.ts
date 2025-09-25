export class AddSelectorComponent {
  private image = new Image();
  width = 53;
  height = 53;

  constructor() {
    this.image.src = "assects/selectedchip/selectAcept.png";
  }

  draw(
    c: CanvasRenderingContext2D,
    x: number,
    y: number,
    frameX: number
  ): void {
    c.drawImage(
      this.image,
      frameX * this.width,
      0,
      this.width,
      this.height,
      x,
      y,
      this.width + 8,
      this.height
    );
  }
}
