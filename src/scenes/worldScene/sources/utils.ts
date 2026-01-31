import data from "@/utils/test/ss.json";
import {
  Wall,
  Path,
  EnemyZone,
  EnemyBoss,
  PathUp,
  PathDown,
} from "./isoEntitys";
import {
  IsoNavisBattle,
  IsoNavisGustman,
  IsoNavisStorage,
} from "./navis/isoNavis";
import { MoveNpcVX, MoveNpcVY } from "./navis/moveNpc";
import { PlayerIso } from "./isoPlayer";

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

export const getRandomeID = () => {
  const charactes =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomID = "";
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * charactes.length);
    randomID += charactes.charAt(randomIndex);
  }
  return randomID;
};

export const testWorld = {
  DefaultPath: Path,
  maps: data.layers,
  bgImage: 4,
  isMultiLevels: data.layers.length > 1,
  blocks: {
    1: PlayerIso,
    0: "",
    2: Wall,
    3: Path,
    5: EnemyBoss,
    6: IsoNavisStorage,
    7: IsoNavisBattle,
    8: IsoNavisGustman,
    9: MoveNpcVX,
    10: MoveNpcVY,
    11: PathUp,
    12: PathDown,
    13: EnemyZone,
    4: EnemyZone,
  },
};

export const getTimebetweenSeconds = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
