import { EnemyZone, FloorRoad } from "./class";
import { createWorld, matrix01 } from "./utils";
import { WordPlayer } from "./worlPlayer";

console.log(matrix01);
// === CONFIG MAPA ===
const ROWS = 10;
const COLS = 26;
const TILE_W = 64; // ancho tile
const TILE_H = 32; // alto tile (rombo)

// === FUNCIONES ===
function isoCoords(row, col) {
  const x = (col - row) * (TILE_W / 2) + 430 / 2;
  const y = (col + row) * (TILE_H / 2);
  return { x, y };
}

class WorldScreen {
  image: HTMLImageElement = new Image();
  width: number;
  height: number;
  matrix: (FloorRoad | EnemyZone)[];
  constructor({
    imagePath,
    width,
    height,
    matrix,
  }: {
    imagePath: string;
    width: number;
    height: number;
    matrix: number[][];
  }) {
    this.image.src = imagePath;
    this.width = width;
    this.height = height;
    this.matrix = createWorld(matrix);
  }
}

const testMap = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export class GameWorld {
  screen: WorldScreen;
  playerWorld: WordPlayer;

  constructor() {
    this.screen = new WorldScreen({
      imagePath: "/assects/world/world00.png",
      width: 1123,
      height: 693,
      matrix: matrix01,
    });
    this.playerWorld = new WordPlayer(this);
  }

  drawTile(c: CanvasRenderingContext2D, x: number, y: number, type: number) {
    if (type === 0) c.fillStyle = "#444"; // borde
    else if (type === 1) c.fillStyle = "#6b3"; // obstáculo
    else c.fillStyle = "#faa"; // suelo

    c.beginPath();
    c.moveTo(x, y);
    c.lineTo(x + TILE_W / 2, y + TILE_H / 2);
    c.lineTo(x, y + TILE_H);
    c.lineTo(x - TILE_W / 2, y + TILE_H / 2);
    c.closePath();
    c.fill();
    c.strokeStyle = "#333";
    c.stroke();
  }

  drawMap(ctx: CanvasRenderingContext2D) {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const { x, y } = isoCoords(r, c);
        this.drawTile(ctx, x, y, matrix01[r][c]);
      }
    }
  }
  draw(deltaTime: number, c: CanvasRenderingContext2D) {
    this.screen.matrix = this.screen.matrix.filter((floor) => !floor.isDelete);
    this.playerWorld.allBlocks = this.screen.matrix;

    c.save();
    c.scale(1.5, 1.5);
    c.translate(this.playerWorld.camera.moveX, this.playerWorld.camera.moveY);
    this.drawMap(c);

    // this.playerWorld.update(c);
    // c.drawImage(this.screen.image, 0, 0, this.screen.width, this.screen.height);

    // this.screen.matrix.forEach((floor) => {
    //   floor.draw(c);
    //   this.playerWorld.isRoad(floor);
    // });

    c.restore();
  }
}
