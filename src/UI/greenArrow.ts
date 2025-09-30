import { getImageFromAssetsManager } from "@/core/assetshandler/assetHelpers";

export class GreenArrow {
  img: HTMLImageElement;
  position: { x: number; y: number };
  width: number;
  height: number;
  maxTime = 400;
  time = 0;
  gotToRight = true;

  constructor() {
    this.img = getImageFromAssetsManager("ui:arrowGreen");
    this.position = { x: 0, y: 12 };
    this.width = 20;
    this.height = 20;
  }

  draw(
    c: CanvasRenderingContext2D,
    position: { x: number; y: number },
    deltaTime: number
  ) {
    if (document.hasFocus()) {
      this.time += deltaTime;
    }
    if (this.time >= this.maxTime) {
      this.time = 0;
    }
    if (this.time < this.maxTime / 2) {
      this.position.x = 20;
    } else {
      this.position.x = 10;
    }

    c.drawImage(
      this.img,
      position.x - this.position.x,
      position.y + this.position.y,
      this.width,
      this.height
    );
  }
}
