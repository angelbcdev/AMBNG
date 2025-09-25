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
