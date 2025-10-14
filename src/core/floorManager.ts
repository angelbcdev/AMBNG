import { matrix } from "@/data/floor/matrixForFloor";
import { FloorBase } from "@/data/floor";
import { ubicateFloors } from "@/data/gameData/ubicateFloors";
import { Entity } from "@/entities/entity";

export class MatrixManager {
  static instance: MatrixManager | null = null;
  canTembleCanvas = false;
  matrix = null;
  floors: FloorBase[] = [];

  constructor() {
    // this.floors = ubicateFloors(matrix);
  }
  initFloors() {
    this.canTembleCanvas = false;
    this.matrix = JSON.parse(JSON.stringify(matrix));
    this.floors = ubicateFloors(this.matrix);
  }

  updateFloors(c: CanvasRenderingContext2D, deltaTime: number) {
    this.floors.forEach((floor) => {
      floor.update(c, deltaTime);
    });
  }
  getMaxRowFloor() {
    return this.matrix.length;
  }

  updateImageFloors(floorImage: number) {
    this.floors = [];
    this.floors = ubicateFloors(this.matrix);

    this.floors.forEach((floor) => {
      floor.updateImageFloor(floorImage);
    });
  }
  drawFloors(c: CanvasRenderingContext2D, deltaTime: number, effects: any[]) {
    this.floors
      .sort((a, b) => b.y + a.y)
      .forEach((floor: FloorBase) => {
        floor.draw(c, deltaTime);
        // floor.floors = this.floors;
        floor.validateAttack(effects);
      });
  }
  breackFloor(posX: number, posY: number) {
    const findFloor = this.floors.findIndex(
      (floor) => floor.matrixX == posX && floor.matrixY == posY
    );

    this.floors[findFloor]?.breakFloor();
  }
  brokeOneLine(characterData: Entity) {
    this.makeGameTemble();
    (async () => {
      let timer = null;
      await new Promise((resolve) => (timer = setTimeout(resolve, 1200)));
      this.brackAllFloor(characterData, 300, true);
      clearTimeout(timer);
    })();
  }
  brackAllFloor(
    characterData: Entity,
    timeOut: number = 300,
    isOneLine = false
  ) {
    const side = characterData.side;
    this.floors.forEach((floor) => {
      if (isOneLine && floor.matrixY != characterData.matrixY) {
        return;
      }
      let defineTime = 0;
      if (side == 0) {
        defineTime = floor.matrixX * timeOut;
      } else {
        if (floor.matrixX == 0) {
          defineTime = 3 * timeOut;
        }
        if (floor.matrixX == 1) {
          defineTime = 2 * timeOut;
        }
        if (floor.matrixX == 2) {
          defineTime = 1 * timeOut;
        }
      }

      if (floor.side != side) {
        setTimeout(() => {
          floor.breakFloor();
        }, defineTime);
      }
    });
  }

  static getInstance() {
    if (!this.instance) this.instance = new MatrixManager();
    return this.instance;
  }

  destroyEspecificFloor(characterData: Entity, tipe: 1 | 3) {
    const side = characterData.side;
    const matrixX = characterData.matrixX;
    const matrixY = characterData.matrixY;
    if (tipe == 1) {
      const nextFloor = side == 0 ? 1 : -1;
      this.destroyFloor(matrixX + nextFloor, matrixY);
    } else if (tipe == 3) {
      const nextFloor = side == 0 ? 1 : -1;
      this.matrix.forEach((_, indexY) => {
        this.destroyFloor(matrixX + nextFloor, indexY);
      });
    }
  }
  addNewLineFloor(characterData: any, _: number) {
    const side = characterData.side;
    if (side == 0) {
      this.matrix.forEach((row, indexY) => {
        let noChangeYet = false;
        row.forEach((floor, indexX) => {
          const findFloor = this.floors.findIndex(
            (floor) => floor.matrixX == indexX && floor.matrixY == indexY
          );
          if (this.floors[findFloor].isChangeFloor) {
            this.floors[findFloor].limitTimeForChangeFloor +=
              this.floors[findFloor].timeToChangeFloor;
          }
          if (floor.side != side && !noChangeYet) {
            noChangeYet = true;

            this.floors[findFloor]?.changeFloor();
          }
        });
      });
    } else if (side == 1) {
      // Iterar de mayor a menor
      for (let indexY = this.matrix.length - 1; indexY >= 0; indexY--) {
        let noChangeYet = false;
        for (
          let indexX = this.matrix[indexY].length - 1;
          indexX >= 0;
          indexX--
        ) {
          const floor = this.matrix[indexY][indexX];
          const findFloor = this.floors.findIndex(
            (floor) => floor.matrixX == indexX && floor.matrixY == indexY
          );
          if (this.floors[findFloor].isChangeFloor) {
            this.floors[findFloor].limitTimeForChangeFloor +=
              this.floors[findFloor].timeToChangeFloor;
          }
          if (floor.side != side && !noChangeYet) {
            noChangeYet = true;
            this.floors[findFloor]?.changeFloor();
          }
        }
      }
    }
  }
  destroyRandomFloor(characterData: Entity, _: number) {
    const side = characterData.side;
    const floors = this.floors.filter(
      (floor) => floor.side != side && floor.characterFloor == null
    );

    const random = Math.floor(Math.random() * floors.length);

    floors[random]?.unAvailableFloor();
  }
  destroyFloor(posX: number, posY: number) {
    const findFloor = this.floors.findIndex(
      (floor) => floor.matrixX == posX && floor.matrixY == posY
    );

    this.floors[findFloor]?.unAvailableFloor();
  }
  makeGameTemble(time: number = 1200) {
    this.canTembleCanvas = true;
    setTimeout(() => {
      this.canTembleCanvas = false;
    }, time);
  }
}

export const FLOOR_MANAGER = MatrixManager.getInstance();
