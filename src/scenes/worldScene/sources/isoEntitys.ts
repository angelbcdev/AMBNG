export class mySquare {
  left: number = 0;
  top: number = 0;
  width: number = 0;
  height: number = 0;
  vx: number = 0;
  vy: number = 0;
  dir: number = 0;
  color: string = "";

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
    img?: HTMLImageElement | HTMLCanvasElement,
    z?: number,
    sx?: number,
    sy?: number,
    sw?: number,
    sh?: number
  ): void {
    if (ctx !== undefined) {
      z = z === undefined ? 0 : z;
      if (cam !== undefined) {
        if (img && img.width) {
          ctx.drawImage(
            img,
            sx!,
            sy!,
            sw!,
            sh!,
            this.left / 2 - this.top / 2 - cam.x,
            this.left / 4 + this.top / 4 - z - cam.y,
            this.width,
            this.height
          );
        } else {
          ctx.fillStyle = this.color;
          ctx.fillRect(
            this.left / 2 - this.top / 2 - cam.x,
            this.left / 4 + this.top / 4 - z - cam.y,
            this.width / 2 + 1,
            this.height / 2 + 1
          );
        }
      } else {
        if (img && img.width) {
          ctx.drawImage(
            img,
            sx!,
            sy!,
            sw!,
            sh!,
            this.left / 2 - this.top / 2,
            this.left / 4 + this.top / 4 - z,
            this.width,
            this.height
          );
        } else {
          ctx.fillStyle = this.color;
          ctx.fillRect(
            this.left / 2 - this.top / 2,
            this.left / 4 + this.top / 4 - z,
            this.width,
            this.height
          );
        }
      }
    }
  }
}

export class WalkPath extends mySquare {
  color: string = "#484848";
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
export class Wall extends mySquare {
  color: string = "#00000020";
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
  color: string = "#ff000050";
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
