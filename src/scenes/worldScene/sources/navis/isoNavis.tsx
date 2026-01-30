import { BATTLE_MANAGER } from "@/core/battleManager";
import { ICreateSquare, mySquare, Wall } from "../isoEntitys";
import { getTimebetweenSeconds } from "../utils";

import { GAME_IS_DEV, GAME_IS_PAUSE } from "@/core/gameState";
import { character, DIALOGUE_MANAGER } from "@/core/dialogueManager";
import { PlayerIso } from "../isoPlayer";

type TDirection = "leftDown" | "leftUp" | "rightDown" | "rightUp";
export class NavyNPC extends mySquare {
  image = new Image();
  imageKey = "";
  widthFrame = 161;
  heightFrame = 245;
  widthDraw = 16;
  heightDraw = 24;
  imageDirection = {
    leftDown: {
      x: 3,
      y: 0,
    },
    leftUp: {
      x: 1,
      y: 0,
    },
    rightDown: { x: 0, y: 0 },
    rightUp: {
      x: 2,
      y: 0,
    },
  };
  imageDialogue: keyof typeof character = "lan";
  isIdle = true;
  isTalking = false;
  returnAfterTalk = 30000;
  newMove = getTimebetweenSeconds(1000, 2000);
  currentTimeMove = 0;

  availableDirecion: {
    leftDown: "leftDown";
    leftUp: "leftUp";
    rightDown: "rightDown";
    rightUp: "rightUp";
  };
  currentDirection: TDirection = "rightUp";

  moveImage = {
    x: this.widthDraw / 2,
    y: this.heightDraw - 13,
  };
  constructor(data: ICreateSquare) {
    // const newData = {
    //   ...data,
    //   x:data.x - 10,
    //   y:data.x - 10,

    // }
    //* change chat's size name
    const newData = {
      ...data,
      x: data.x - 6,
      y: data.y - 6,
      width: data.width + 16,
      height: data.height + 16
    }
   
    super(newData);
    this.currentDirection = this.searchValidDirection(true);
    // this.imageKey = "isonavi:npc"
    this.imageDialogue = "naviSore";
    this.image.src = "./assects/navis/navibase1.png";
  }
  drawIsoImageAreaPlayer(
    c: CanvasRenderingContext2D,
    cam?: { x: number; y: number },
    z?: number
  ) {
    
    super.drawIsoImageArea(c, cam, z);
    
    //* add view chat box
 
  }
  draw(c: CanvasRenderingContext2D, cam?: { x: number; y: number }, z?: number) {
    const x = this.left / 2 - this.top / 2 - cam.x;
    const y = this.left / 4 + this.top / 4 - z - cam.y;
       if (GAME_IS_DEV()) {
      const TILE_W = this.width;
      const TILE_H = this.height / 2;
      c.fillStyle = this.color +80;
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x + TILE_W / 2, y + TILE_H / 2);
      c.lineTo(x, y + TILE_H);
      c.lineTo(x - TILE_W / 2, y + TILE_H / 2);
      c.closePath();
      c.fill();
       }
    
   
 
    c.drawImage(
      this.image,
      this.imageDirection[this.currentDirection].x * this.widthFrame,
      this.imageDirection[this.currentDirection].y * this.heightFrame,
      this.widthFrame,
      this.heightFrame,
      x - this.moveImage.x,
      y - this.moveImage.y,
      this.widthDraw,
      this.heightDraw
    );
    this.idleAnimation(16.666666666666668);
  }
  idleAnimation(deltaTime: number) {
    if (!document.hasFocus() || GAME_IS_PAUSE()) return;
    if (this.isIdle) {
      this.currentTimeMove += deltaTime;
      if (this.currentTimeMove >= this.newMove) {
        this.currentDirection = this.searchValidDirection();

        this.currentTimeMove = 0;
        this.newMove = getTimebetweenSeconds(1000, 3000);
      }
    } else {
      this.returnAfterTalk -= deltaTime;
      if (this.returnAfterTalk <= 0) {
        this.isIdle = true;
        this.returnAfterTalk = 30000;
      }
    }
  }
  searchValidDirection(inital = false) {
    const validDirection = ["leftDown", "leftUp", "rightDown", "rightUp"];
    if (inital) {
      return validDirection[
        Math.floor(Math.random() * validDirection.length)
      ] as TDirection;
    } else {
      return validDirection.filter(
        (direction) => direction !== this.currentDirection
      )[Math.floor(Math.random() * 3)] as TDirection;
    }
  }

  moveImageChat(direction: TDirection, player: PlayerIso) {
    this.currentDirection = direction;
    this.isIdle = false;
    this.isTalking = true;

    //* ADD DIALOGUE
    if (BATTLE_MANAGER.dialogue.isHidden) {
      const msj = DIALOGUE_MANAGER.getRandomLine(this.imageDialogue);
      BATTLE_MANAGER.dialogue.npcID = this.id;
      BATTLE_MANAGER.dialogue.showMessage(msj);
      player.returnIdle();
      player.pressKey = [];
    }
  }
  update(_: number) {}
  moveImageColliction(direction?: TDirection, player?: PlayerIso) {
    this.currentDirection = direction;

    this.isIdle = false;
    if (player) {
      player.returnIdle();
      player.pressKey = [];
    }
  }
}

export class NavyNPCStatic extends NavyNPC {
  constructor(data: ICreateSquare) {
    super(data);
    this.isIdle = true;
  }
}

class NavyNPCStore extends NavyNPCStatic {
  constructor(data: ICreateSquare) {
    super(data);
    this.imageDialogue = "naviSore";
    this.image.src = "./assects/navis/navibase.png";
  }
}
class NavyNPCBattle extends NavyNPCStatic {
 constructor(data: ICreateSquare) {
    super(data);
    this.imageDialogue = "naviBattle";
    this.image.src = "./assects/navis/navibase1.png";
  }
}
class NavyNPCGustman extends NavyNPCStatic {
  widthFrame = 284;
  heightFrame = 305;
  widthDraw = 30;
  heightDraw = 30;

  moveImage = {
    x: 18,
    y: 16,
  };

  constructor(data:ICreateSquare) {
    super(data);
    this.imageDialogue = "gustman";
    this.image.src = "./assects/navis/gust/gustworld.png";
  }
}

export class IsoNavis extends Wall {
  color: string = "#401f";
  ratio: number = 0.8;

  navi: NavyNPC;
  constructor(data: ICreateSquare) {
    // data.x = data.x  - 3
    // data.y = data.y - 3
    // data.width = data.width + 12
    // data.height = data.height + 12
//* change area's size navi
    const  newData = {
      ...data,
      x: data.x - 2,
      y: data.y - 2,
      width: data.width + 10,
      height: data.height + 10
    }
    super(newData);
    

    this.navi = new NavyNPC(newData);
  }
  playerMove(face: string) {
    console.log("face", face);
  }
}

export class IsoNavisStorage extends IsoNavis {
  constructor(
    data: ICreateSquare,
  ) {
    super(data);
    this.navi = new NavyNPCStore(data);
  }
}

export class IsoNavisBattle extends IsoNavis {
  constructor(data: ICreateSquare) {
    super(data);
    this.navi = new NavyNPCBattle(data);
  }
}

export class IsoNavisGustman extends IsoNavis {
  constructor(data: ICreateSquare) {
    super(data);
    // 14. 30

    this.navi = new NavyNPCGustman(data);
  }
}
