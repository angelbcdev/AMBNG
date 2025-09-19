export class FloorRoad {
  width = 32;
  height = 32;
  x: number;
  y: number;
  isDelete = false;

  color = "green";

  isCollision = true;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = this.color;
    c.fillRect(this.x, this.y, this.width, this.height);

    // c.fillRect(this.x, this.y, this.width, this.height);
  }
}

export class EnemyZone extends FloorRoad {
  width = 64;
  height = 32;
  isCollision = false;
  constructor(x: number, y: number) {
    super(x, y);
    this.color = "red";
  }
}
