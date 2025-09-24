import { BATTLE_MANAGER } from "@/scenes/battleScene/sources/battleManager";
import Attack from "../attacks/attacks";
import { Entity } from "../player/entity";

const visualFloor = {
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
    img: "/assects/floor/allFloor1.png",
    name: "basic",
  },
  {
    img: "/assects/floor/allFloor2.png",
    name: "fire",
  },
  {
    img: "/assects/floor/allFloor3.png",
    name: "grey",
  },
  {
    img: "/assects/floor/allFloor4.png",
    name: "wood",
  },
  {
    img: "/assects/floor/allFloor5.png",
    name: "speed",
  },
  {
    img: "/assects/floor/allFloor6.png",
    name: "circuit",
  },
  {
    img: "/assects/floor/allFloor7.png",
    name: "steal",
  },
  {
    img: "/assects/floor/allFloor8.png",
    name: "folder",
  },
];

const floorStatus = {
  NORMAL: "normal",
  GRIETA: "grieta",
};
const startTime = performance.now();

export class FloorBase {
  image = new Image();
  imageEffectChange = new Image();
  x: number;
  y: number;
  width: number;
  height: number;
  floorState: string = floorStatus.NORMAL;
  isAttack: boolean;
  matrixY: number;
  matrixX: number;
  frameX: number;
  frameY: number;
  frameWidth: number;
  frameHeight: number;
  side: number;
  floors: FloorBase[];
  game: any;
  floorToChange: null | number = null;
  isVisible: boolean = true;
  timerForAppear: number = 5000;
  timeStartForBlink: number = this.timerForAppear - 1500;
  timerBlink: number = 0;
  blink: boolean = false;
  showImagen: boolean = true;
  characterFloor: null | Entity = null;
  nameFloor: string = "";
  isChangeFloor: boolean = false;
  timeToChangeFloor: number = 5000;
  limitTimeForChangeFloor: number = this.timeToChangeFloor;

  imageEffectChangeActive: boolean = false;
  timeForChangeFloor: number = 0;
  imageEffectChangeFrame: number = 0;
  imageEffectChangeX: number = 0;
  imageEffectChangeY: number = 0;

  imageEffectChangeWidth: number = 62;
  imageEffectChangeHeight: number = 41;
  imageEffectChangeMaxFrame: number = 8;
  imageEffectChangeFrameTime: number = 1000 / 10;
  imageEffectChangeTimer: number = 0;

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
    this.x = x - 5;
    this.y = y;
    this.width = 73;
    this.height = 55;
    this.isAttack = isAttack;
    this.side = side;
    this.matrixY = matrixY;
    this.matrixX = matrixX;
    this.frameX = visualFloor[this.side || 0][this.floorState] || 0;
    this.frameY = matrixY < 2 ? matrixY : 2;
    this.frameWidth = 53;
    this.frameHeight = 32;
    this.nameFloor = floorImages[imageFloor].name;

    this.image.src = floorImages[imageFloor].img;

    this.imageEffectChange.src = "assects/floor/floorChange.png";
  }
  updateImageFloor(newImageFloor: number) {
    this.image.src = floorImages[newImageFloor].img;
    this.nameFloor = floorImages[newImageFloor].name;
  }
  changeRandomFloor(floor?: number) {
    if (floor) {
      this.nameFloor = floorImages[floor].name;

      this.image.src = floorImages[floor].img;
    } else {
      const randomFloor = Math.floor(Math.random() * 6) + 1;
      this.image.src = floorImages[randomFloor].img;
      this.nameFloor = floorImages[randomFloor].name;
    }
  }
  draw(c: CanvasRenderingContext2D, deltaTime: number) {
    if (this.game && this.floorState === floorStatus.GRIETA) {
      this.validateCharacter(BATTLE_MANAGER.getAllEntities());
    }
    this.paintNormalImage(c);

    this.paintEffect(c);
    this.paintBlinkImage(c);
    if (!this.isVisible) {
      if (this.timerBlink > this.timeStartForBlink) {
        this.blink = true;
      } else {
        this.timerBlink += deltaTime;
      }
    }

    this.paintMakeChangeFloor(c, deltaTime);
  }
  update(_: CanvasRenderingContext2D, deltaTime: number) {
    if (this.isChangeFloor) {
      this.timeForChangeFloor += deltaTime;
      if (this.timeForChangeFloor > this.limitTimeForChangeFloor) {
        this.timeForChangeFloor = 0;

        this.returnFloor();
      }
    }
  }
  paintMakeChangeFloor(c: CanvasRenderingContext2D, deltaTime: number) {
    if (!this.imageEffectChangeActive) {
      return;
    }
    if (this.imageEffectChangeTimer > this.imageEffectChangeFrameTime) {
      this.imageEffectChangeTimer = 0;
      if (this.imageEffectChangeFrame <= this.imageEffectChangeMaxFrame - 1) {
        this.imageEffectChangeFrame += 1;
      } else {
        this.imageEffectChangeActive = false;
        this.imageEffectChangeFrame = 0;
      }
    } else {
      this.imageEffectChangeTimer += deltaTime;
    }

    c.drawImage(
      this.imageEffectChange,
      this.imageEffectChangeFrame * this.imageEffectChangeWidth,
      this.imageEffectChangeY * this.imageEffectChangeHeight,
      this.imageEffectChangeWidth,
      this.imageEffectChangeHeight,

      this.x - 5,
      this.y - 15,
      this.width + 10,
      this.height + 10
    );
  }
  paintNormalImage(c: CanvasRenderingContext2D) {
    if (!this.isVisible) {
      return;
    }

    c.drawImage(
      this.image,
      this.frameX * this.frameWidth,
      this.frameY * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
    this.paintBase(c);
  }
  paintBlinkImage(c: CanvasRenderingContext2D) {
    const time = performance.now() - startTime;
    if (!this.blink) {
      return;
    }

    const alpha = Math.abs(Math.sin(time * 0.02)); // 0.1 ajusta la velocidad de parpadeo
    this.frameX = visualFloor[this.side][floorStatus.NORMAL];
    c.save();
    c.globalAlpha = alpha;
    c.drawImage(
      this.image,
      this.frameX * this.frameWidth,
      this.frameY * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
    c.drawImage(
      this.image,
      0 * this.frameWidth,
      3 * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      this.x,
      this.y + this.height,
      this.width,
      this.height
    );
    c.restore();
  }
  paintBase(c: CanvasRenderingContext2D) {
    if (!this.isVisible) {
      return;
    }

    c.drawImage(
      this.image,
      0 * this.frameWidth,
      3 * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      this.x,
      this.y + this.height,
      this.width,
      this.height
    );
    if (this.matrixY < 2) {
      c.fillStyle = "rgba(5, 0, 0,0.5)";
      c.fillRect(this.x, this.y + this.height, this.width, this.height / 3 - 5);
    }
  }
  paintEffect(c: CanvasRenderingContext2D) {
    if (!this.isVisible) {
      return;
    }
    if (this.isAttack) {
      c.save();
      c.globalAlpha = 0.5;
      c.drawImage(
        this.image,
        4 * this.frameWidth,
        this.frameY * this.frameHeight,
        this.frameWidth,
        this.frameHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
      c.restore();
    }
  }
  validateCharacter(characters: Entity[]) {
    for (const character of characters) {
      const isCharacterInZone =
        character.possition.x + character.width >= this.x &&
        character.possition.x <= this.x + this.width &&
        character.possition.y + character.height >= this.y &&
        character.possition.y <= this.y + this.height;

      if (isCharacterInZone) {
        this.pressCharacterFloor(character);
      } else {
        this.releaseCharacterFloor(character);
      }
    }
  }
  pressCharacterFloor(character: Entity) {
    // Si el personaje entra en la zona, solo cambiar el estado si no está en proceso de cambio
    if (
      this.isChangeFloor === false &&
      this.floorState === floorStatus.GRIETA &&
      this.characterFloor === null
    ) {
      this.characterFloor = character;
      this.isChangeFloor = true;
    }
  }
  releaseCharacterFloor(character: Entity) {
    // Si el personaje sale de la zona, restauramos el estado a NORMAL si estaba en GRIETA
    if (
      this.floorState === floorStatus.GRIETA &&
      this.characterFloor == character
    ) {
      this.unAvailableFloor();
    }
  }
  changeFloor() {
    const newSide = this.side == 0 ? 1 : 0;
    if (this.game.matrix[this.matrixY][this.matrixX].ocupated) {
      return;
    }
    this.imageEffectChangeActive = true;

    setTimeout(() => {
      this.frameX = visualFloor[newSide][this.floorState];
      this.game.matrix[this.matrixY][this.matrixX].side = newSide;
      this.isChangeFloor = true;
    }, 160);
  }
  returnFloor() {
    if (this.game.matrix[this.matrixY][this.matrixX].ocupated) {
      return;
    }

    this.isChangeFloor = false;
    this.game.matrix[this.matrixY][this.matrixX].side = this.side;
    this.frameX = visualFloor[this.side][floorStatus.NORMAL];
    this.limitTimeForChangeFloor = 3000;
  }
  breakFloor() {
    // Aquí cambiamos el estado solo si no está en proceso de restauración
    if (this.floorState === floorStatus.NORMAL) {
      this.floorState = floorStatus.GRIETA;
      this.frameX = visualFloor[this.side][this.floorState];
      // No debe haber cambio pendiente si ya está en GRIETA
    }
    // else {
    //   this.unAvailableFloor();
    // }
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
    if (this.game.matrix[this.matrixY][this.matrixX].ocupated) {
      return;
    }
    this.game.matrix[this.matrixY][this.matrixX].side = 3;
    this.isVisible = false;
    this.frameX = visualFloor[3][floorStatus.NORMAL];
    this.floorToChange = null;

    setTimeout(() => {
      this.floorState = floorStatus.NORMAL;
      this.isVisible = true;
      this.isChangeFloor = true;
      this.characterFloor = null;
      this.game.matrix[this.matrixY][this.matrixX].side = this.side;
      this.frameX = visualFloor[this.side][this.floorState];
    }, this.timerForAppear);
  }
}
