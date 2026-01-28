import { IsoNavis, NavyNPC } from "./isoNavis";

//navy to show
export class NavyNPCMove extends NavyNPC {
  imageDirection = {
    leftDown: {
      x: 0,
      y: 0,
    },
    rightDown: { x: 0, y: 1 },
    leftUp: {
      x: 0,
      y: 3,
    },
    rightUp: {
      x: 0,
      y: 2,
    },
  };
  maxFrame = 2;
  frameInterval = 2000 / 10;
  frameX = 0;
  frameTime = 0;

  widthFrame = 58;
  heightFrame = 128;
  widthDraw = 12;
  heightDraw = 24;
  vx: number = 0;
  vy: number = 0;
  constructor(x: number, y: number) {
    super(x, y);
    this.imageDialogue = "chatBot";
    this.currentDirection = "leftUp";
    this.isIdle = false;
    this.image.src = "./assects/navis/controlBot.png";
  }
  drawIsoImageAreaPlayer(
    c: CanvasRenderingContext2D,
    cam?: { x: number; y: number },
    z?: number,
  ): void {
    const x = this.left / 2 - this.top / 2 - cam.x;
    const y = this.left / 4 + this.top / 4 - z - cam.y;
    c.drawImage(
      this.image,
      this.frameX * this.widthFrame,
      this.imageDirection[this.currentDirection].y * this.heightFrame,
      this.widthFrame,
      this.heightFrame,
      x - this.moveImage.x,
      y - this.moveImage.y,
      this.widthDraw,
      this.heightDraw,
    );
  }
  update(deltaTime: number) {
    if (this.frameTime >= this.frameInterval) {
      this.frameTime = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else {
      this.frameTime += deltaTime;
    }
  }
}

//Wall block
export class MoveNpc extends IsoNavis {
  color: string = "#401fd0";
  ratio: number = 0.8;
  vx: number = 0;
  vy: number = 0;
  dir = 1;
  speed: number = 0.25;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    createFromTopLeft?: boolean,
  ) {
    super(x, y, width, height, createFromTopLeft);

    this.navi = new NavyNPCMove(x, y);
    // this.changeFaceNPC();
  }
  update(deltaTime: number = 10) {
    this.navi.update(deltaTime);
    this.navi.x = this.x;
    this.navi.y = this.y;
  }
  playerMove(face: string) {
    console.log("face", face);
  }
  changeFaceNPC() {
    const currentLocation = `${this.vx}:${this.vy}`;

    const directionFaces = {
      "6:0": "rightUp",
      "-6:0": "leftUp",
      "0:6": "rightDown",
      "0:-6": "leftDown",
    };

    this.navi.currentDirection = directionFaces[currentLocation];
  }
}
export class MoveNpcVX extends MoveNpc {
  vx: number = 6;
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    createFromTopLeft?: boolean,
  ) {
    super(x, y, width, height, createFromTopLeft);
  }
}
export class MoveNpcVY extends MoveNpc {
  vy: number = 6;
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    createFromTopLeft?: boolean,
  ) {
    super(x, y, width, height, createFromTopLeft);
  }
}
