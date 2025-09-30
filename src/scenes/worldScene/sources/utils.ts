import data from "@/utils/testT01.json";
import { Wall, Path, EnemyZone, EnemyBoss } from "./isoEntitys";

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
  }
}

export const testWorld = {
  maps: data.layers,
  bloks: {
    1: Wall,
    0: Path,
    2: Path,
    3: EnemyZone,
    4: EnemyZone,
    5: EnemyBoss,
  },
};
