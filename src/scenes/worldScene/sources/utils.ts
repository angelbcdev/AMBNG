import data from "@/utils/testt.json";

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

export const testWorld = {
  maps: data.layers,
  bloks: {
    blockWall: 109,
    blockRoad: 108,
    blockEnemyZone: 125,
  },
};

const myClass = {
  1: FloorRoad,
  2: EnemyZone,
};

export const createWorld = (matrix: number[][]) => {
  const elements = [];

  matrix.forEach((row, indexY) => {
    row.forEach((floor, indexX) => {
      if (myClass[floor]) {
        const className = myClass[floor];
        const width = 32;
        const height = 32;

        elements.push(new className(indexX * width, indexY * height));
      }
    });
  });
  return elements;
};
