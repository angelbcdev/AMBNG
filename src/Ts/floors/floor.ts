import { Nodo } from "../master";

interface Attack {
  possition: { x: number; y: number };
  width: number;
  height: number;
  damage: number;
  initialMatrixY: number;
}

export class Floor {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  image: HTMLImageElement;
  baseImage: HTMLImageElement;
  animateImage: HTMLImageElement;
  frameTime: number;
  frameInterval: number;
  maxFrame: number;
  incialFrameX: number;
  incialFrameY: number;
  frameX: number;
  frameY: number;
  frameWidth: number;
  frameHeight: number;
  isAttack: boolean;
  effect: Attack[];
  matrixY: number;
  matrixX: number;
  shadowImage: HTMLImageElement;

  constructor(
    x: number,
    y: number,
    color: string,
    blockSize: number,
    isAttack: boolean,
    matrixY: number,
    matrixX: number
  ) {
    this.x = x;
    this.y = y;
    this.width = blockSize + 4;
    this.height = blockSize;
    this.color = color;
    this.image = new Image();
    this.baseImage = new Image();
    this.baseImage.src = "../../assects/floor/base-floor.png";
    this.animateImage = new Image();
    this.animateImage.src = "../../assects/floor/animate.png";
    this.shadowImage = new Image();
    this.shadowImage.src = "../../assects/floor/shadows.png";
    this.frameTime = 1000 / 60;
    this.frameInterval = 100;
    this.maxFrame = 4;
    this.incialFrameX = 0;
    this.incialFrameY = 0;
    this.frameX = this.incialFrameX;
    this.frameY = this.incialFrameY;
    this.frameWidth = 50;
    this.frameHeight = 50;
    this.isAttack = isAttack;
    this.effect = [];
    this.matrixY = matrixY;
    this.matrixX = matrixX;
  }
  update() {}
  draw(c: CanvasRenderingContext2D) {
    if (this.image) {
      c.drawImage(this.baseImage, this.x, this.y, this.width, this.height);
      if (this.isAttack) {
        this.updateframe(c);
      }

      for (let i = 0; i < 3 - this.matrixY; i++) {
        c.drawImage(
          this.shadowImage,
          this.x + 1,
          this.y + 1,
          this.width - 4,
          this.height - 4
        );
      }
      c.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    this.validateAttack(this.effect);
  }
  updateframe(c: CanvasRenderingContext2D, deltaTime = 160) {
    if (this.frameTime > this.frameInterval) {
      // Animación del sprite
      this.frameTime = 0;
      this.frameX =
        this.frameX < this.maxFrame ? this.frameX + 1 : this.incialFrameX;
    } else {
      this.frameTime += deltaTime;
    }
    c.drawImage(
      this.animateImage,
      this.frameX * this.frameWidth,
      this.frameY * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      this.x + 2,
      this.y + 2,
      this.width - 4,
      this.height - 9
    );
  }
  validateAttack(attacks: Attack[]) {
    for (const attack of attacks) {
      if (
        attack.possition.x + attack.width >= this.x &&
        attack.possition.x <= this.x + this.width &&
        attack.possition.y + attack.height >= this.y + 30 &&
        attack.possition.y <= this.y + this.height - 30
      ) {
        // Si cualquier ataque colisiona, marcamos `isAttack` como verdadero
        if (!this.isAttack) {
          this.isAttack = true;
          setTimeout(() => {
            this.isAttack = false;
          }, 1500);
        }
        break; // Si solo nos importa saber si hay algún ataque, salimos del ciclo
      } else {
        this.isAttack = false;
      }
    }
  }
}

export class FloorRed extends Floor {
  constructor({ possition: { x, y, blockSize, isAttack, matrixY, matrixX } }) {
    super(x, y, "#ff000050", blockSize, isAttack, matrixY, matrixX);
    this.image.src = "../../assects/floor/red-floor.png";
  }
}
export class FloorBlue extends Floor {
  constructor({ possition: { x, y, blockSize, isAttack, matrixY, matrixX } }) {
    super(x, y, "#0000ff50", blockSize, isAttack, matrixY, matrixX);
    this.image.src = "../../assects/floor/blue-floor.png";
  }
}

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
  timerForAppear: number = 10000;
  timeStartForBlink: number = this.timerForAppear - 1500;
  timerBlink: number = 0;
  blink: boolean = false;
  showImagen: boolean = true;
  characterFloor: null | Nodo = null;
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
      this.validateCharacter([...this.game.players, ...this.game.npc]);
    }
    this.paintNormalImage(c);

    this.paintEffect(c);
    this.paintBlinkImage(c);
    if (!this.isVisible) {
      if (this.timerBlink > this.timeStartForBlink) {
        this.blink = true;
        this.timerBlink = 0;
      } else {
        this.timerBlink += deltaTime;
      }
    } else {
      this.blink = false;
      this.timerBlink = 0;
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
  validateCharacter(characters: Nodo[]) {
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
  pressCharacterFloor(character: Nodo) {
    // Si el personaje entra en la zona, solo cambiar el estado si no está en proceso de cambio
    if (
      this.floorToChange === null &&
      this.floorState === floorStatus.GRIETA &&
      this.characterFloor === null
    ) {
      this.characterFloor = character;
      this.floorToChange = testgame.floors.findIndex(
        (floor) =>
          floor.matrixX === this.matrixX && floor.matrixY === this.matrixY
      );
    }
    if (this.floorState === floorStatus.GRIETA && this.floorToChange === null) {
      this.game.matrix[this.matrixY][this.matrixX].side = 3;
      this.isVisible = false;
      this.frameX = visualFloor[3][floorStatus.NORMAL];
      this.timerBlink = 0;
      this.blink = false;
    }
  }
  releaseCharacterFloor(character: Nodo) {
    // Si el personaje sale de la zona, restauramos el estado a NORMAL si estaba en GRIETA
    if (
      this.floorToChange !== null &&
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
    this.timerBlink = 0;
    this.blink = false;

    setTimeout(() => {
      this.floorState = floorStatus.NORMAL;
      this.isVisible = true;
      this.characterFloor = null;
      this.game.matrix[this.matrixY][this.matrixX].side = this.side;
      this.frameX = visualFloor[this.side][this.floorState];
    }, this.timerForAppear);
  }
}
