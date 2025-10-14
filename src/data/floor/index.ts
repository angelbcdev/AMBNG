import Attack from "../attacks/attacks";
import { Entity } from "../../entities/entity";
import { FLOOR_MANAGER } from "@/core/floorManager";
import { getImageFromAssetsManager } from "@/core/assetshandler/assetHelpers";
import {
  BlinkingState,
  FloorState,
  GrietaState,
  InvisibleState,
  NormalState,
} from "./states";

export const visualFloor = {
  0: {
    normal: 0,
    grieta: 2,
    especial: 4,
  },
  1: {
    normal: 1,
    grieta: 3,
    especial: 4,
  },
  3: {
    normal: 5,
    grieta: 5,
    especial: 5,
  },
};
export const floorImages = [
  {
    img: getImageFromAssetsManager("floor:all1"),
    name: "basic",
  },
  {
    img: getImageFromAssetsManager("floor:all2"),
    name: "fire",
  },
  {
    img: getImageFromAssetsManager("floor:all3"),
    name: "grey",
  },
  {
    img: getImageFromAssetsManager("floor:all4"),
    name: "wood",
  },
  {
    img: getImageFromAssetsManager("floor:all5"),
    name: "speed",
  },
  {
    img: getImageFromAssetsManager("floor:all6"),
    name: "circuit",
  },
  {
    img: getImageFromAssetsManager("floor:all7"),
    name: "steal",
  },
  {
    img: getImageFromAssetsManager("floor:all8"),
    name: "folder",
  },
];

export class FloorBase {
  image = new Image();
  imageEffectChange = new Image();
  x: number;
  y: number;
  width: number;
  height: number;

  isAttack: boolean;
  matrixY: number;
  matrixX: number;
  frameX: number;
  frameY: number;
  frameWidth: number;
  frameHeight: number;
  side: number;

  showImagen: boolean = true;
  characterFloor: null | Entity = null;
  nameFloor: string = "";

  states = {
    normal: new NormalState(this),
    grieta: new GrietaState(this),
    invisible: new InvisibleState(this),
    blinking: new BlinkingState(this),
  };
  oldState: string = "normal";
  currentState: FloorState = this.states.normal;

  isChangeFloor: boolean = false;
  timeChangeFloor: number = 0;
  limitTimeForChangeFloor: number = 3000;
  timeToChangeFloor: number = 3000;

  constructor({
    possition: {
      x,
      y,
      isAttack = false,
      matrixY,
      matrixX,
      side = 0,
      imageFloor = 7,
    },
  }) {
    this.x = x - 2;
    this.y = y;
    this.width = 74;
    this.height = 55;
    this.isAttack = isAttack;
    this.side = side;
    this.matrixY = matrixY;
    this.matrixX = matrixX;
    // this.frameX = visualFloor[this.side || 0][this.floorState] || 0;
    this.frameY = matrixY < 2 ? matrixY : 2;
    this.frameWidth = 53.3;
    this.frameHeight = 32;
    this.nameFloor = floorImages[imageFloor].name;

    this.image = floorImages[imageFloor].img;

    this.currentState.enter();
  }
  updateImageFloor(newImageFloor: number) {
    this.image = floorImages[newImageFloor].img;
    this.nameFloor = floorImages[newImageFloor].name;
  }
  changeRandomFloor(floor?: number) {
    if (floor) {
      this.nameFloor = floorImages[floor].name;

      this.image = floorImages[floor].img;
    } else {
      const randomFloor = Math.floor(Math.random() * 6) + 1;
      this.image = floorImages[randomFloor].img;
      this.nameFloor = floorImages[randomFloor].name;
    }
  }
  draw(c: CanvasRenderingContext2D, deltaTime: number) {
    this.currentState.draw(c, deltaTime);
  }
  update(_: CanvasRenderingContext2D, deltaTime: number) {
    this.currentState.update(deltaTime);

    if (this.isChangeFloor) {
      this.timeChangeFloor += deltaTime;
      if (this.timeChangeFloor >= this.limitTimeForChangeFloor) {
        this.isChangeFloor = false;
        this.timeChangeFloor = 0;
        this.returnFloor();
      }
    }
  }

  breakFloor() {
    // Aquí cambiamos el estado solo si no está en proceso de restauración
    if (this.currentState.name === "normal") {
      this.changeState("grieta");
    }
  }
  changeState(newState: keyof typeof this.states) {
    if (newState === this.currentState.name) return;

    this.currentState.exit();
    this.currentState = this.states[newState];
    this.currentState.enter();
  }

  validateAttack(attacks: Attack[]) {
    for (const attack of attacks) {
      if (attack.initialMatrixY !== this.matrixY) return;
      if (
        attack.possition.x + attack.width >= this.x &&
        attack.possition.x <= this.x + this.width &&
        attack.possition.y + attack.height >= this.y + 10 &&
        attack.possition.y <= this.y + this.height - 30
      ) {
        // Si cualquier ataque colisiona, marcamos `isAttack` como verdadero
        if (!this.isAttack) {
          this.isAttack = true;
          setTimeout(() => {
            this.isAttack = false;
          }, 750);
        }
        break; // Si solo nos importa saber si hay algún ataque, salimos del ciclo
      } else {
        this.isAttack = false;
      }
    }
  }
  unAvailableFloor() {
    this.changeState("invisible");
  }
  changeFloor() {
    if (FLOOR_MANAGER.matrix[this.matrixY][this.matrixX].ocupated) {
      return;
    }
    this.isChangeFloor = true;
    this.currentState.imageEffectChangeActive = true;
    this.side = this.side == 0 ? 1 : 0;

    this.currentState.enter();
  }
  returnFloor() {
    if (FLOOR_MANAGER.matrix[this.matrixY][this.matrixX].ocupated) {
      return;
    }

    this.currentState.imageEffectChangeActive = true;
    this.side = this.side == 0 ? 1 : 0;

    this.currentState.enter();
  }
}
