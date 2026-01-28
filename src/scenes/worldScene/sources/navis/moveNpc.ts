import { mySquare } from "../isoEntitys";
import { PlayerIso } from "../isoPlayer";
import { IsoNavis, NavyNPC } from "./isoNavis";

//navy to show

type TDirection = "bottom" | "top" | "left" | "right";
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
  isTalking = false;
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
  limitSpeed = this.speed;

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
    this.changeFaceNPC();
  }
  playerMove(face: string) {
    console.log("face", face);
  }
  changeFaceNPC() {
    if (this.navi.isTalking) return;
    const currentLocation = `${this.vx}:${this.vy}`;

    const directionFaces = {
      "6:0": "rightDown",
      "-6:0": "leftUp",
      "0:6": "leftDown",
      "0:-6": "rightUp",
    };

    this.navi.currentDirection = directionFaces[currentLocation];
  }

  moveCurrentNavi(player: PlayerIso, wall: MoveNpc[]) {
    if (this.navi.isTalking) return;
    //leftUp
    if (this.vx < 0) {
      this.x -= this.speed;

      this.validateDirection(this, wall, "vx", "left", "right");
      if (this.intersects(player)) {
        this.stopByPlayer();
        this.left = player.right;
      }
      return;
    } else if (this.vx > 0) {
      this.x += this.speed;

      this.validateDirection(this, wall, "vx", "right", "left");
      if (this.intersects(player)) {
        this.stopByPlayer();
        this.right = player.left;
      }

      return;
    } else if (this.vy < 0) {
      this.y -= this.speed;

      this.validateDirection(this, wall, "vy", "top", "bottom");
      if (this.intersects(player)) {
        this.stopByPlayer();
        this.top = player.bottom;
      }
      return;
    } else if (this.vy > 0) {
      this.y += this.speed;

      this.validateYDwon(this, wall);
      if (this.intersects(player)) {
        this.stopByPlayer();
        this.bottom = player.top;
      }

      return;
    }
  }

  validateDirection = (
    NPC: MoveNpc,
    obj: MoveNpc[],
    direction: "vx" | "vy",
    oldPosition: TDirection,
    newPosition: TDirection,
  ) => {
    for (let i = 0, l = obj.length; i < l; i += 1) {
      if (NPC.id === obj[i].id) {
        return;
      }
      if (NPC.intersects(obj[i])) {
        NPC[oldPosition] = obj[i][newPosition];
        NPC[direction] = NPC[direction] * -1;
      }
    }
  };
  validateYDwon = (NPC: MoveNpc, wall: MoveNpc[]) => {
    for (let i = 0, l = wall.length; i < l; i += 1) {
      if (NPC.id === wall[i].id) continue;

      if (NPC.intersects(wall[i])) {
        // Ajuste directo de la posición
        NPC.y = wall[i].top - NPC.height / 2;
        NPC.vy = NPC.vy * -1;
        break;
      }
    }
  };
  stopByPlayer() {
    this.speed = 0;
    this.navi.isIdle = true;
    setTimeout(() => {
      this.speed = this.limitSpeed;
      this.vx *= -1;
      this.vy *= -1;
      this.navi.isIdle = false;
    }, 5000);
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
