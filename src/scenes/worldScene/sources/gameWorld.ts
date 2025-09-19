import { EnemyZone, FloorRoad } from "./class";
import { createWorld, matrix01 } from "./utils";
import { WordPlayer } from "./worlPlayer";

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
  draw(deltaTime: number, c: CanvasRenderingContext2D) {
    this.screen.matrix = this.screen.matrix.filter((floor) => !floor.isDelete);
    this.playerWorld.allBlocks = this.screen.matrix;

    c.save();
    c.scale(1.5, 1.5);
    c.translate(this.playerWorld.camera.moveX, this.playerWorld.camera.moveY);
    c.drawImage(this.screen.image, 0, 0, this.screen.width, this.screen.height);

    // this.screen.matrix.forEach((floor) => {
    //   floor.draw(c);
    //   this.playerWorld.isRoad(floor);
    // });

    this.playerWorld.update(c);
    c.restore();
  }
}
