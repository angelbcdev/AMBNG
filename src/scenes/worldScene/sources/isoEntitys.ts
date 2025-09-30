import { GAME_IS_DEV } from "@/core/gameState";

//TODO channge the name to ISOEntity

export class mySquare {
  left: number = 0;
  top: number = 0;
  width: number = 0;
  height: number = 0;
  vx: number = 0;
  vy: number = 0;
  dir: number = 0;
  color: string = "#0ff000";
  image: HTMLImageElement = new Image();
  isEnemyZone: boolean = false;
  colorOpacity: string = "50";

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
        const TILE_W_img = 16;
        const TILE_H_img = 16 / 2;
        const TILE_W = this.width;
        const TILE_H = this.height / 2;

        // Offset para centrar la imagen en la zona de colisión ampliada
        const offsetX = (this.width - 16) / 4; // Compensación en coordenadas isométricas
        const offsetY = (this.height - 16) / 8;

        if (this.image) {
          ctx.drawImage(
            this.image,
            x - 8.2 + offsetX,
            y + 0.2 + offsetY,
            TILE_W_img,
            TILE_H_img + 3
          );
        }

        // TODO: ELIMINAR
        if (this.isEnemyZone && GAME_IS_DEV()) {
          ctx.fillStyle = this.color + this.colorOpacity;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + TILE_W_img / 2, y + TILE_H_img / 2);
          ctx.lineTo(x, y + TILE_H_img);
          ctx.lineTo(x - TILE_W_img / 2, y + TILE_H_img / 2);
          ctx.closePath();
          ctx.fill();
        }

        if (GAME_IS_DEV()) {
          ctx.fillStyle = this.color + this.colorOpacity;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + TILE_W / 2, y + TILE_H / 2);
          ctx.lineTo(x, y + TILE_H);
          ctx.lineTo(x - TILE_W / 2, y + TILE_H / 2);
          ctx.closePath();
          ctx.fill();
        }
      }
    }
  }
}

export class EnemyBoss extends mySquare {
  color: string = "#0000ff";
  colorOpacity: string = "99";
  ratio: number = 0.9;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    createFromTopLeft?: boolean
  ) {
    super(x, y, width, height, createFromTopLeft);
    this.image.src = "/assects/isoFloorTest.png";

    // Expandir la zona de contacto manteniendo el centro
    const offset = (48 - 16) / 2; // = 16
    this.left -= offset;
    this.top -= offset;
    this.width = 48;
    this.height = 48;
  }

  drawIsoImageArea(
    ctx?: CanvasRenderingContext2D,
    cam?: { x: number; y: number },
    z?: number
  ): void {
    if (ctx !== undefined) {
      z = z === undefined ? 0 : z;
      if (cam !== undefined) {
        // Compensar el offset para que la imagen se dibuje en el centro de la zona de contacto
        const offset = (48 - 16) / 2;
        const adjustedLeft = this.left + offset;
        const adjustedTop = this.top + offset;

        const x = adjustedLeft / 2 - adjustedTop / 2 - cam.x;
        const y = adjustedLeft / 4 + adjustedTop / 4 - z - cam.y;
        const TILE_W_img = 16;
        const TILE_H_img = 16 / 2;
        const TILE_W = this.width;
        const TILE_H = this.height / 2;

        if (this.image) {
          ctx.drawImage(
            this.image,
            x - 8.2,
            y + 0.2,
            TILE_W_img,
            TILE_H_img + 3
          );
        }

        // Usar las coordenadas sin compensar para la zona de contacto
        const xCollision = this.left / 2 - this.top / 2 - cam.x;
        const yCollision = this.left / 4 + this.top / 4 - z - cam.y;

        if (GAME_IS_DEV()) {
          ctx.fillStyle = this.color + this.colorOpacity;
          ctx.beginPath();
          ctx.moveTo(xCollision, yCollision);
          ctx.lineTo(xCollision + TILE_W / 2, yCollision + TILE_H / 2);
          ctx.lineTo(xCollision, yCollision + TILE_H);
          ctx.lineTo(xCollision - TILE_W / 2, yCollision + TILE_H / 2);
          ctx.closePath();
          ctx.fill();
        }
      }
    }
  }
}

export class Path extends mySquare {
  image = new Image();
  colorOpacity: string = "00";
  color: string = "#ffffff";
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
    this.image = null;
  }
}

export class EnemyZone extends mySquare {
  color: string = "#ff0000";

  ratio: number = 0.8;
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
