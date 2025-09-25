export class BaseImageComponent {
  private image = new Image();
  width = 320;
  height = 420;

  constructor() {
    this.image.src = "assects/selectedchip/chipSelector.png";
  }

  draw(c: CanvasRenderingContext2D, x: number, y: number): void {
    c.drawImage(this.image, x - 20, y, this.width, this.height);
  }
}
