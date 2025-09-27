import { ASSET_MANAGER } from "@/core/assetManager";
import { ASSET_SOURCES } from "@/core/assetSources";
export const mapDetails = [
  {
    assetKey: "bg:0",
    width: 240,
    height: 159,
    maxFrame: 11,
    speed: 0.03,
    fps: 1000 / 5,
    name: "Intro",
    moveY: false,
    moveX: false,
  },
  {
    assetKey: "bg:1",
    width: 255,
    height: 255,
    maxFrame: 3,
    speed: 0.02,
    fps: 1000 / 6,
    name: "Pink Diamonds",
    moveY: true,

    moveX: true,
  },
  {
    assetKey: "bg:2",
    width: 508,
    height: 511,
    maxFrame: 5,
    speed: 0.02,
    fps: 1000 / 6,
    name: "Blue Square",
    moveY: true,

    moveX: true,
  },
  {
    assetKey: "bg:3",
    width: 128,
    height: 192,
    maxFrame: 24,
    speed: 0.02,
    fps: 1000 / 6,
    name: "Golden E",
    moveY: true,

    moveX: true,
  },
  {
    assetKey: "bg:4",
    width: 264,
    height: 264,
    maxFrame: 3,
    speed: 0.02,
    fps: 1000 / 6,
    name: "Brown food",
    moveY: true,

    moveX: true,
  },
  {
    assetKey: "bg:5",
    width: 240,
    height: 160,
    maxFrame: 15,
    speed: 0.0003,
    fps: 1000 / 30,
    name: "Dark Thunder",
    moveY: false,

    moveX: false,
  },
  {
    assetKey: "bg:6",
    width: 238,
    height: 157,
    maxFrame: 11,
    speed: 0.03,
    fps: 1000 / 6,
    name: "Game Over",
    moveY: true,
    moveX: false,
  },
];
export class BackGround {
  img: HTMLImageElement;
  position: { x: number; y: number };
  canvas: { width: number; height: number };
  frameTime: number;
  frameInterval: number;
  maxFrame: number;
  initialFrameX: number;
  initialFrameY: number;
  frameX: number;
  frameY: number;
  frameWidth: number;
  frameHeight: number;
  speed: number;
  mapa: number;
  name = "";
  moveY = false;
  moveX = true;
  canMove = true;

  private resolveImageByKey(key: string): HTMLImageElement {
    // Prefer preloaded image from manager when available
    if (ASSET_MANAGER.has(key)) {
      return ASSET_MANAGER.get(key);
    }
    // Fallback: use URL from manifest to construct an Image immediately
    const def = (ASSET_SOURCES.background || []).find((d) => d.key === key);
    const img = new Image();
    if (def) {
      img.src = def.url;
    }
    return img;
  }

  constructor(mapa = 0) {
    this.img = this.resolveImageByKey(mapDetails[mapa].assetKey);
    this.moveY = mapDetails[mapa].moveY;
    this.moveX = mapDetails[mapa].moveX;

    this.position = { x: 0, y: 0 }; // Iniciar en la esquina superior izquierda
    this.canvas = { width: 430, height: 430 };
    this.frameTime = 0;
    this.mapa = mapa;
    this.frameInterval = mapDetails[mapa].fps;
    this.maxFrame = mapDetails[mapa].maxFrame;
    this.initialFrameX = 0;
    this.initialFrameY = 0;
    this.frameX = this.initialFrameX;
    this.frameY = this.initialFrameY;
    this.name = mapDetails[mapa].name;
    this.frameWidth = mapDetails[mapa].width; // 508; // El ancho de cada fragmento de la imagen
    this.frameHeight = mapDetails[mapa].height; // 511; // La altura de cada fragmento de la imagen
    this.speed = mapDetails[mapa].speed; // Ajusta la velocidad de movimiento
  }
  updateBackGround(newMapa: number) {
    this.mapa = newMapa;
    this.img = this.resolveImageByKey(mapDetails[newMapa].assetKey);
    this.frameInterval = mapDetails[newMapa].fps;
    this.maxFrame = mapDetails[newMapa].maxFrame;
    this.initialFrameX = 0;
    this.initialFrameY = 0;
    this.frameX = this.initialFrameX;
    this.frameY = this.initialFrameY;
    this.frameWidth = mapDetails[newMapa].width; // 508; // El ancho de cada fragmento de la imagen
    this.frameHeight = mapDetails[newMapa].height; // 511; // La altura de cada fragmento de la imagen
    this.speed = mapDetails[newMapa].speed; // Ajusta la velocidad de movimiento
    this.moveY = mapDetails[newMapa].moveY;
    this.moveX = mapDetails[newMapa].moveX;
    this.name = mapDetails[newMapa].name;
  }

  draw(c, deltaTime) {
    // c.clearRect(0, 0, this.canvas.width, this.canvas.height); // Limpiar el canvas
    // c.fillStyle = "white";
    // c.fillRect(0, 0, this.canvas.width, this.canvas.height + 60);

    // Reposicionar las imágenes cuando se hayan movido más allá de la pantalla en el eje X
    if (this.position.x > this.canvas.width) {
      this.position.x = 0;
    }

    // Reposicionar las imágenes cuando se hayan movido más allá de la pantalla en el eje Y
    if (this.position.y > this.canvas.height) {
      this.position.y = 0;
    }

    if (document.hasFocus() && this.canMove) {
      if (this.frameTime > this.frameInterval) {
        // Actualización de la animación del sprite (si la tienes)
        this.frameTime = 0;
        this.frameX =
          this.frameX < this.maxFrame ? this.frameX + 1 : this.initialFrameX;
        if (this.mapa === 5 && this.frameX === this.maxFrame) {
          this.maxFrame = Math.floor(Math.random() * 10) + 7;
        }
      } else {
        this.frameTime += deltaTime;
      }

      if (this.moveY && this.moveX) {
        this.position.x += deltaTime * this.speed; // Mover hacia la derecha
        this.position.y += deltaTime * this.speed; // Mover hacia abajo
      } else if (this.moveY) {
        this.position.y += deltaTime * this.speed; // Mover hacia abajo
      } else if (this.moveX) {
        this.position.x += deltaTime * this.speed; // Mover hacia la derecha
      }
    }

    if (this.moveY || this.moveX) {
      // Dibujar las 9 imágenes de fondo en una cuadrícula 3x3
      for (let i = -1; i <= 1; i++) {
        // Tres filas, desde -1 hasta 1 (3 posiciones)
        for (let j = -1; j <= 1; j++) {
          // Tres columnas, desde -1 hasta 1 (3 posiciones)
          c.drawImage(
            this.img,
            this.frameX * this.frameWidth,
            this.frameY * this.frameHeight,
            this.frameWidth,
            this.frameHeight,
            this.position.x + j * this.canvas.width, // Ajustar posición horizontal
            this.position.y + i * this.canvas.height, // Ajustar posición vertical
            this.canvas.width + 4,
            this.canvas.height + 4 // Asegurarse de que cubra todo el canvas
          );
        }
      }
    } else {
      c.drawImage(
        this.img,
        this.frameX * this.frameWidth,
        this.frameY * this.frameHeight,
        this.frameWidth,
        this.frameHeight,
        this.position.x,
        this.position.y,
        this.canvas.width + 2,
        this.canvas.height + 2 // Asegurarse de que cubra todo el canvas
      );
    }
  }
}
