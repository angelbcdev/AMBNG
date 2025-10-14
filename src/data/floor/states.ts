// floorStateBase.ts
import { ENTITY_MANAGER } from "@/core/entityManager";
import { visualFloor, type FloorBase } from "./index";
import { FLOOR_MANAGER } from "@/core/floorManager";
import { Entity } from "@/entities/entity";

const SETUP_FLOOR = {
  TIME_INVISIBLE: 4000,
  TIME_BLINKING: 1000,
};

export class FloorState {
  name = "";
  floor: FloorBase;
  imageEffectChange = new Image();
  timeForChangeFloor: number = 0;
  imageEffectChangeFrame: number = 0;
  imageEffectChangeX: number = 0;
  imageEffectChangeY: number = 0;

  imageEffectChangeWidth: number = 62;
  imageEffectChangeHeight: number = 41;
  imageEffectChangeMaxFrame: number = 8;
  imageEffectChangeFrameTime: number = 1000 / 10;
  imageEffectChangeTimer: number = 0;
  imageEffectChangeActive: boolean;

  constructor(floor: FloorBase, name: string) {
    this.name = name;
    this.floor = floor;
    this.imageEffectChange.src = "assects/floor/floorChange.png";
  }

  enter() {}
  update(deltaTime: number) {}
  draw(c: CanvasRenderingContext2D, deltaTime: number) {
    c.drawImage(
      this.floor.image,
      this.floor.frameX * this.floor.frameWidth,
      this.floor.frameY * this.floor.frameHeight,
      this.floor.frameWidth,
      this.floor.frameHeight,
      this.floor.x,
      this.floor.y,
      this.floor.width,
      this.floor.height
    );
    this.paintBase(c);
    this.paintEffect(c);
    this.paintMakeChangeFloor(c, deltaTime);
  }
  exit() {}
  paintBase(c: CanvasRenderingContext2D) {
    c.drawImage(
      this.floor.image,
      0 * this.floor.frameWidth,
      3 * this.floor.frameHeight,
      this.floor.frameWidth,
      this.floor.frameHeight,
      this.floor.x,
      this.floor.y + this.floor.height,
      this.floor.width,
      this.floor.height
    );
    if (this.floor.matrixY < 2) {
      c.fillStyle = "rgba(5, 0, 0,0.5)";
      c.fillRect(
        this.floor.x,
        this.floor.y + this.floor.height,
        this.floor.width,
        this.floor.height / 3 - 5
      );
    }
  }
  paintEffect(c: CanvasRenderingContext2D) {
    if (this.floor.isAttack) {
      c.save();
      c.globalAlpha = 0.5;
      c.drawImage(
        this.floor.image,
        4 * this.floor.frameWidth,
        this.floor.frameY * this.floor.frameHeight,
        this.floor.frameWidth,
        this.floor.frameHeight,
        this.floor.x,
        this.floor.y,
        this.floor.width,
        this.floor.height
      );
      c.restore();
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

      this.floor.x - 5,
      this.floor.y - 15,
      this.floor.width + 10,
      this.floor.height + 10
    );
  }
}

export class NormalState extends FloorState {
  constructor(floor: FloorBase) {
    super(floor, "normal");
  }
  enter() {
    this.imageEffectChangeActive = true;
    this.floor.frameX = visualFloor[this.floor.side]["normal"];
    FLOOR_MANAGER.matrix[this.floor.matrixY][this.floor.matrixX].side =
      this.floor.side;
  }

  update(deltaTime: number) {
    super.update(deltaTime);
    // Lógica del estado normal
  }

  draw(c: CanvasRenderingContext2D, deltaTime: number) {
    super.draw(c, deltaTime);
  }

  exit() {
    this.floor.frameX = null;
  }
}

export class GrietaState extends FloorState {
  constructor(floor: FloorBase) {
    super(floor, "grieta");
  }
  enter() {
    this.floor.frameX = visualFloor[this.floor.side]["grieta"];
  }

  update(deltaTime: number) {
    super.update(deltaTime);
    this.validateCharacter(ENTITY_MANAGER.getAllEntities());
    // Lógica del estado normal
  }

  draw(c: CanvasRenderingContext2D, deltaTime: number) {
    super.draw(c, deltaTime);
  }
  validateCharacter(characters: Entity[]) {
    for (const character of characters) {
      const isCharacterInZone =
        character.possition.x + character.width >= this.floor.x &&
        character.possition.x <= this.floor.x + this.floor.width &&
        character.possition.y + character.height >= this.floor.y &&
        character.possition.y <= this.floor.y + this.floor.height;

      if (isCharacterInZone) {
        this.pressCharacterFloor(character);
      } else {
        this.releaseCharacterFloor(character);
      }
    }
  }
  pressCharacterFloor(character: Entity) {
    // Si el personaje entra en la zona, solo cambiar el estado si no está en proceso de cambio
    if (this.floor.characterFloor === null) {
      this.floor.characterFloor = character;
    }
  }
  releaseCharacterFloor(character: Entity) {
    if (this.floor.characterFloor == character) {
      this.floor.characterFloor = null;
      this.floor.changeState("invisible");
    }
  }

  exit() {}
}

export class InvisibleState extends FloorState {
  constructor(floor: FloorBase) {
    super(floor, "invincible");
  }
  enter() {
    FLOOR_MANAGER.matrix[this.floor.matrixY][this.floor.matrixX].side = 3;
    setTimeout(() => {
      this.floor.changeState("blinking");
    }, SETUP_FLOOR.TIME_INVISIBLE);
  }

  update(_: number) {
    // Lógica del estado normal
  }

  draw(c: CanvasRenderingContext2D, deltaTime: number) {}

  exit() {}
}

export class BlinkingState extends FloorState {
  timerBlink = 0;
  constructor(floor: FloorBase) {
    super(floor, "blinking");
  }
  enter() {
    this.floor.frameX = visualFloor[this.floor.side]["normal"];
    setTimeout(() => {
      this.floor.changeState("normal");
    }, SETUP_FLOOR.TIME_BLINKING);
  }

  update(_: number) {
    // Lógica del estado normal
  }

  draw(c: CanvasRenderingContext2D, deltaTime: number) {
    //  const time = performance.now() - startTime;

    //  const alpha = Math.abs(Math.sin(time * 0.02)); // 0.1 ajusta la velocidad de parpadeo
    this.timerBlink += deltaTime;
    if (this.timerBlink > 100) {
      this.timerBlink = 0;
    }
    c.save();
    c.globalAlpha = this.timerBlink > 50 ? 0 : 1;
    c.drawImage(
      this.floor.image,
      this.floor.frameX * this.floor.frameWidth,
      this.floor.frameY * this.floor.frameHeight,
      this.floor.frameWidth,
      this.floor.frameHeight,
      this.floor.x,
      this.floor.y,
      this.floor.width,
      this.floor.height
    );
    c.drawImage(
      this.floor.image,
      0 * this.floor.frameWidth,
      3 * this.floor.frameHeight,
      this.floor.frameWidth,
      this.floor.frameHeight,
      this.floor.x,
      this.floor.y + this.floor.height,
      this.floor.width,
      this.floor.height
    );
    c.restore();
  }

  exit() {}
}
