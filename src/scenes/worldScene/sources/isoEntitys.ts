import { GAME_IS_DEV } from "@/core/gameState";
import { getRandomeID } from "./utils";

export interface ICreateSquare {
  x: number;
  y: number;
  width: number;
  height: number;
  hightLevel: number;

  createFromTopLeft?: boolean;
}

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
  local = { x: 0, y: 0, gap: 3 };
  hightLevel: number;
  id: string = "";
  showShadow: boolean = false;
  drawInDebug: boolean = false;
  constructor(data: ICreateSquare) {
    const { x, y, width, height, hightLevel, createFromTopLeft } = data;

    this.width = width;
    this.height = height;
    this.hightLevel = hightLevel;
    if (createFromTopLeft) {
      this.left = x;
      this.top = y;
    } else {
      this.left = x;
      this.top = y;
    }
    this.id = getRandomeID();
    this.image.src = "/assects/isoFloorTest3.png";
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
        this.bottom > rect.top &&
        this.hightLevel === rect.hightLevel
      );
    }
    return false;
  }
  playerMove(_: string) {}

  drawIsoImageArea(
    ctx?: CanvasRenderingContext2D,
    cam?: { x: number; y: number },
    z?: number,
  ): void {
    if (!ctx || !cam) return;
    const x = this.left / 2 - this.top / 2 - cam.x;
    const y = this.left / 4 + this.top / 4 - z - cam.y;

    const TILE_W = this.width;
    const TILE_H = this.height / 2;

    // ctx.translate(0, this.hightLevel * -32);
    this.draw(ctx, cam, z);
    this.drawTypeSquare(ctx, x, y, TILE_W, TILE_H);
    this.drawEnemyZone(ctx, x, y, TILE_W, TILE_H);
    if (this.showShadow) {
      this.drawShadow(ctx, x, y, TILE_W, TILE_H);
    }
  }

  drawShadow(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    TILE_W: number,
    TILE_H: number,
  ) {
    ctx.fillStyle = "#00000070";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + TILE_W / 2, y + TILE_H / 2);
    ctx.lineTo(x, y + TILE_H);
    ctx.lineTo(x - TILE_W / 2, y + TILE_H / 2);
    ctx.closePath();
    ctx.fill();
  }
  draw(
    ctx: CanvasRenderingContext2D,
    cam: { x: number; y: number },
    z: number,
  ) {
    z = z === undefined ? 0 : z;
    if (cam !== undefined) {
      if (this.isEnemyZone && GAME_IS_DEV()) return;

      const x = this.left / 2 - this.top / 2 - cam.x;
      const y = this.left / 4 + this.top / 4 - z - cam.y;
      const TILE_W_img = 32;
      const TILE_H_img = 32 - 8;

      this.local.x = x;
      this.local.y = y;

      // Offset para centrar la imagen en la zona de colisión ampliada
      const offsetX = this.width - 32; // Compensación en coordenadas isométricas
      const offsetY = this.height - 32;

      if (this.image) {
        ctx.drawImage(
          this.image,
          x - this.width / 2 + offsetX,
          y + offsetY,
          TILE_W_img,
          TILE_H_img,
        );
      }
      this.drawWallColor(ctx, cam, z);
    }
  }
  drawTypeSquare(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    TILE_W: number,
    TILE_H: number,
  ) {
    // TODO: ELIMINAR
    if (GAME_IS_DEV() && this.drawInDebug) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + TILE_W / 2, y + TILE_H / 2);
      ctx.lineTo(x, y + TILE_H);
      ctx.lineTo(x - TILE_W / 2, y + TILE_H / 2);
      ctx.closePath();
      ctx.fill();
    }
  }
  drawEnemyZone(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    TILE_W: number,
    TILE_H: number,
  ) {}
  drawWallColor(
    ctx: CanvasRenderingContext2D,
    cam: { x: number; y: number },
    z: number,
  ) {}
}

export class Path extends mySquare {
  colorOpacity: string = "00";
  color: string = "#ffffff";
  coords: { x: number; y: number };
  ramdomeColors = [
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
    "#ff00bf",
  ];
  floorColor: string =
    this.ramdomeColors[Math.floor(Math.random() * this.ramdomeColors.length)];
  constructor(data: ICreateSquare) {
    super(data);
    this.drawInDebug = false;
  }

  drawWallColor(
    ctx: CanvasRenderingContext2D,
    cam: { x: number; y: number },
    z: number,
  ) {
    const x = this.left / 2 - this.top / 2 - cam.x + 1;
    const y = this.left / 4 + this.top / 4 - z - cam.y + 2;
    const TILE_W = this.width - 9;
    const TILE_H = this.height - 16;

    ctx.fillStyle = this.floorColor + 85;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + TILE_W / 2 + 1, y + TILE_H / 2 - 1);
    ctx.lineTo(x - 1, y + TILE_H - 2);
    ctx.lineTo(x - TILE_W / 2 - 3, y + TILE_H / 2 - 1); //
    ctx.closePath();
    ctx.fill();
  }
}
export class Wall extends mySquare {
  color: string = "#00000040";

  constructor(data: ICreateSquare) {
    super(data);
    this.image = null;
    this.drawInDebug = true;
  }
}

export class EnemyZone extends mySquare {
  color: string = "#dd000080";

  ratio: number = 0.8;
  constructor(data: ICreateSquare) {
    super(data);
    this.drawInDebug = true;
    this.image = null;
  }

  drawEnemyZone(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    TILE_W: number,
    TILE_H: number,
  ) {
    if (GAME_IS_DEV() && this.drawInDebug) {
      ctx.fillStyle = this.isEnemyZone ? "#ff0000" : "#ff0000" + "20";
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

export class EnemyBoss extends mySquare {
  color: string = "#ff0000";
  colorOpacity: string = "99";
  ratio: number = 0.9;

  constructor(data: ICreateSquare) {
    super(data);
    this.drawInDebug = true;
    this.image.src = "/assects/isoFloorTest.png";

    // Expandir la zona de contacto manteniendo el centro
    // const offset = (48 - 16) / 2; // = 16
    // this.left -= offset;
    // this.top -= offset;
    // this.width = 16;
    // this.height = 48;
  }

  // drawIsoImageArea(
  //   ctx?: CanvasRenderingContext2D,
  //   cam?: { x: number; y: number },
  //   z?: number,
  // ): void {
  //   if (ctx !== undefined) {
  //     z = z === undefined ? 0 : z;
  //     if (cam !== undefined) {
  //       // Compensar el offset para que la imagen se dibuje en el centro de la zona de contacto
  //       const offset = (48 - 16) / 2;
  //       const adjustedLeft = this.left + offset;
  //       const adjustedTop = this.top + offset;

  //       const x = adjustedLeft / 2 - adjustedTop / 2 - cam.x;
  //       const y = adjustedLeft / 4 + adjustedTop / 4 - z - cam.y;
  //       const TILE_W_img = 16;
  //       const TILE_H_img = 16 / 2;
  //       const TILE_W = this.width;
  //       const TILE_H = this.height / 2;

  //       if (this.image) {
  //         ctx.drawImage(
  //           this.image,
  //           x - 8.2,
  //           y + 0.2,
  //           TILE_W_img,
  //           TILE_H_img + 3,
  //         );
  //       }

  //       // Usar las coordenadas sin compensar para la zona de contacto
  //       const xCollision = this.left / 2 - this.top / 2 - cam.x;
  //       const yCollision = this.left / 4 + this.top / 4 - z - cam.y;

  //       if (GAME_IS_DEV()) {
  //         ctx.fillStyle = this.color + this.colorOpacity;
  //         ctx.beginPath();
  //         ctx.moveTo(xCollision, yCollision);
  //         ctx.lineTo(xCollision + TILE_W / 2, yCollision + TILE_H / 2);
  //         ctx.lineTo(xCollision, yCollision + TILE_H);
  //         ctx.lineTo(xCollision - TILE_W / 2, yCollision + TILE_H / 2);
  //         ctx.closePath();
  //         ctx.fill();
  //       }
  //     }
  //   }
  // }
}

export class PathUp extends Wall {
  color: string = "#FF43fa";
  image: HTMLImageElement = new Image();
  nextLevel: number = 1;

  constructor(data: ICreateSquare) {
    super(data);
    this.drawInDebug = true;
    this.image.src = "/assects/isoFloorTest.png";
  }
}
export class PathDown extends Wall {
  color: string = "#261313";
  image: HTMLImageElement = new Image();
  nextLevel: number = 0;

  constructor(data: ICreateSquare) {
    super(data);
    this.drawInDebug = true;
    this.image.src = "/assects/isoFloorTest.png";
  }
}
