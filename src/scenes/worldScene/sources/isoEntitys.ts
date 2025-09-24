export class mySquare {
  left: number = 0;
  top: number = 0;
  width: number = 0;
  height: number = 0;
  vx: number = 0;
  vy: number = 0;
  dir: number = 0;
  color: string = "#0ff000";
  image: HTMLImageElement | HTMLCanvasElement = new Image();

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    createFromTopLeft?: boolean
  ) {
    this.width = width;
    this.height = height;

    if (createFromTopLeft) {
      this.left = x;
      this.top = y;
    } else {
      this.left = x;
      this.top = y;
    }
  }

  get x(): number {
    return this.left + this.width / 2;
  }

  set x(value: number) {
    this.left = value - this.width / 2;
  }

  get y(): number {
    return this.top + this.height / 2;
  }

  set y(value: number) {
    this.top = value - this.height / 2;
  }

  get right(): number {
    return this.left + this.width;
  }

  set right(value: number) {
    this.left = value - this.width;
  }

  get bottom(): number {
    return this.top + this.height;
  }

  set bottom(value: number) {
    this.top = value - this.height;
  }

  intersects(rect?: mySquare): boolean {
    if (rect !== undefined) {
      return (
        this.left < rect.right &&
        this.right > rect.left &&
        this.top < rect.bottom &&
        this.bottom > rect.top
      );
    }
    return false;
  }

  drawIsoImageArea(
    ctx?: CanvasRenderingContext2D,
    cam?: { x: number; y: number },

    z?: number
  ): void {
    if (ctx !== undefined) {
      z = z === undefined ? 0 : z;
      if (cam !== undefined) {
        const x = this.left / 2 - this.top / 2 - cam.x;
        const y = this.left / 4 + this.top / 4 - z - cam.y;
        const TILE_W = 16;
        const TILE_H = 8;
        if (this.image.width > 0) {
          ctx.drawImage(this.image, x - 8.2, y + 0.2, TILE_W, TILE_H + 3);
        } else {
          ctx.fillStyle = this.color + "50";
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + TILE_W / 2, y + TILE_H / 2);
          ctx.lineTo(x, y + TILE_H);
          ctx.lineTo(x - TILE_W / 2, y + TILE_H / 2);
          ctx.closePath();
          ctx.fill();
        }
        //
      }
    }
  }
}

export class WalkPath extends mySquare {
  image = new Image();

  color: string = "#484848";
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    createFromTopLeft?: boolean
  ) {
    super(x, y, width, height, createFromTopLeft);
    this.image.src = "/assects/isoFloorTest.png";
  }
}
export class Wall extends mySquare {
  color: string = "#000000";
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    createFromTopLeft?: boolean
  ) {
    super(x, y, width, height, createFromTopLeft);
  }
}

export class EnemyZone extends mySquare {
  color: string = "#ff0000";
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    createFromTopLeft?: boolean
  ) {
    super(x, y, width, height, createFromTopLeft);
  }
}
