const canvas = {
  width: 240,
  height: 160,
};

export class Camera {
  x: number = 0;
  y: number = 0;
  worldWidth: number = 0;
  worldHeight: number = 0;

  constructor() {
    this.x = 0;
    this.y = 0;
  }
  focus(x: number, y: number) {
    this.x = x - canvas.width / 2;
    this.y = y - canvas.height / 2;

    if (this.x < 0) {
      this.x = 0;
    } else if (this.x > this.worldWidth - canvas.width) {
      this.x = this.worldWidth - canvas.width;
    }
    if (this.y < 0) {
      this.y = 0;
    } else if (this.y > this.worldHeight - canvas.height) {
      this.y = this.worldHeight - canvas.height;
    }
  }

  isoFocus(x: number, y: number) {
    this.x = x / 2 - y / 2 - canvas.width / 2;
    this.y = x / 4 + y / 4 - canvas.height / 2;
  }
}
