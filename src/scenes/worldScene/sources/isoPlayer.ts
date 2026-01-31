import { keyBindings } from "@/config/keyBindings";
import { ICreateSquare, mySquare, PathDown, PathUp } from "./isoEntitys";
import { GAME_IS_DEV } from "@/core/gameState";
import { ASSET_MANAGER } from "@/core/assetManager";
import { ASSET_SOURCES } from "@/core/assetshandler/assetSources";
import { NavyNPC } from "./navis/isoNavis";

export class PlayerIso extends mySquare {
  color: string = "#0000";
  speed: number = 1.5;
  isMove: boolean = false;
  pressKey: string[] = [];
  lastPress: string | null = null;

  frameTime = 0;
  frameInterval = 1000 / 12;
  frameX = 0;

  moveFrameX = 10;
  moveFrameY = 14;
  frameWidth = 33;
  frameHeight = 42;
  maxFrame = 5;
  fps = 12;
  image = new Image();

  c: any;
  allAnimations = {
    //idle
    idle_down_left: 0,
    idle_down_right: 1,
    idle_up_left: 2,
    idle_up_right: 3,
    //idle
    idle_left: 4,
    idle_up: 5,
    idle_down: 6,
    idle_right: 7,
    //run
    run_down_left: 8,
    run_down_right: 9,
    run_up_left: 10,
    run_up_right: 11,
    //run
    run_left: 12,
    run_up: 13,
    run_down: 14,
    run_right: 15,
  };
  frameY = this.allAnimations.idle_down;

  constructor(data: ICreateSquare) {
    const newData = {
      ...data,
      x: data.x,
      y: data.y,
      width: data.width,
      height: data.height,
    };
    super(newData);
    // Resolve world/iso player sprite via AssetManager, fallback to manifest URL
    const key = "player:worldSprite";
    if (ASSET_MANAGER.has(key)) {
      this.image = ASSET_MANAGER.get(key);
    } else {
      const def = (ASSET_SOURCES.player || []).find((d) => d.key === key);
      if (def) this.image.src = def.url;
    }
  }

  update(deltaTime: number) {
    if (!this.isMove) return;
    if (this.frameTime >= this.frameInterval) {
      this.frameTime = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else {
      this.frameTime += deltaTime;
    }
  }
  mover(wall: mySquare[]) {
    if (this.pressKey.includes(keyBindings.pressA)) {
      this.speed = 3.75;
    } else {
      this.speed = 1.75;
    }
    //choose frame Y
    if (
      this.pressKey.includes("ArrowUp") &&
      this.pressKey.includes("ArrowRight")
    ) {
      this.frameY = this.allAnimations.run_right;
      this.dir = this.allAnimations.run_right;
    } else if (
      this.pressKey.includes("ArrowUp") &&
      this.pressKey.includes("ArrowLeft")
    ) {
      this.frameY = this.allAnimations.run_up;
      this.dir = this.allAnimations.run_up;
    } else if (
      this.pressKey.includes("ArrowDown") &&
      this.pressKey.includes("ArrowRight")
    ) {
      this.frameY = this.allAnimations.run_down;
      this.dir = this.allAnimations.run_down;
    } else if (
      this.pressKey.includes("ArrowDown") &&
      this.pressKey.includes("ArrowLeft")
    ) {
      this.frameY = this.allAnimations.run_left;
      this.dir = this.allAnimations.run_left;
    }
    // run
    else if (this.pressKey.includes("ArrowUp")) {
      this.frameY = this.allAnimations.run_up_right;
      this.dir = this.allAnimations.run_up_right;
    } else if (this.pressKey.includes("ArrowRight")) {
      this.frameY = this.allAnimations.run_down_right;
      this.dir = this.allAnimations.run_down_right;
    } else if (this.pressKey.includes("ArrowDown")) {
      this.frameY = this.allAnimations.run_down_left;
      this.dir = this.allAnimations.run_down_left;
    } else if (this.pressKey.includes("ArrowLeft")) {
      this.frameY = this.allAnimations.run_up_left;
      this.dir = this.allAnimations.run_up_left;
    }

    // Move Rect
    if (this.pressKey.includes("ArrowUp")) {
      this.moveUp(wall);
    }
    if (this.pressKey.includes("ArrowRight")) {
      this.moveRight(wall);
    }
    if (this.pressKey.includes("ArrowDown")) {
      this.moveDown(wall);
    }
    if (this.pressKey.includes("ArrowLeft")) {
      this.moveLeft(wall);
    }
    if (
      !this.pressKey.includes("ArrowUp") &&
      !this.pressKey.includes("ArrowRight") &&
      !this.pressKey.includes("ArrowDown") &&
      !this.pressKey.includes("ArrowLeft")
    ) {
      this.isMove = false;
    }
  }

  drawIsoImageAreaPlayer(
    c: CanvasRenderingContext2D,
    cam: { x: number; y: number },
    z: number,
  ) {
    this.c = c;
    const x = this.left / 2 - this.top / 2 - cam.x;
    const y = this.left / 4 + this.top / 4 - z - cam.y;

    if (GAME_IS_DEV()) {
      const TILE_W = 16;
      const TILE_H = 8;
      c.fillStyle = this.color + "80";
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
      this.frameX * this.frameWidth,
      this.frameY * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      x - this.moveFrameX,
      y - this.moveFrameY,
      20,
      20,
    );
  }

  validateMovePath(wall: mySquare) {
    if (wall instanceof PathUp || wall instanceof PathDown) {
      this.hightLevel = wall.nextLevel;
      console.log("this.hightLevel", this.hightLevel);
    }

    // this.x -= WORLD_MANAGER.diferentFloor.x * 16;
    // this.y -= WORLD_MANAGER.diferentFloor.y * 16;
  }

  moveUp(wall: mySquare[]) {
    this.isMove = true;

    this.y -= this.speed;
    for (let i = 0, l = wall.length; i < l; i += 1) {
      if (this.intersects(wall[i])) {
        this.validateMovePath(wall[i]);
        this.top = wall[i].bottom;
      }
    }
  }

  moveRight(wall: mySquare[]) {
    this.isMove = true;

    this.x += this.speed;
    for (let i = 0, l = wall.length; i < l; i += 1) {
      if (this.intersects(wall[i])) {
        this.validateMovePath(wall[i]);
        this.right = wall[i].left;
      }
    }
  }
  moveDown(wall: mySquare[]) {
    this.isMove = true;

    this.y += this.speed;
    for (let i = 0, l = wall.length; i < l; i += 1) {
      if (this.intersects(wall[i])) {
        this.validateMovePath(wall[i]);
        this.bottom = wall[i].top;
      }
    }
  }
  moveLeft(wall: mySquare[]) {
    this.isMove = true;

    this.x -= this.speed;
    for (let i = 0, l = wall.length; i < l; i += 1) {
      if (this.intersects(wall[i])) {
        this.validateMovePath(wall[i]);
        this.left = wall[i].right;
      }
    }
  }
  checkKeyUp = (e: KeyboardEvent) => {
    this.pressKey.splice(this.pressKey.indexOf(e.key), 1);

    if (["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(e.key)) {
      this.returnIdle();
    }

    this.lastPress = e.key;
  };
  checkKeyDown = (e: KeyboardEvent) => {
    if (!this.pressKey.includes(e.key)) {
      this.pressKey.push(e.key);
    }
  };
  returnIdle() {
    //change to idle
    switch (this.dir) {
      case this.allAnimations.run_up_right:
        this.frameY = this.allAnimations.idle_up_right;
        break;
      case this.allAnimations.run_down_right:
        this.frameY = this.allAnimations.idle_down_right;
        break;
      case this.allAnimations.run_down_left:
        this.frameY = this.allAnimations.idle_down_left;
        break;
      case this.allAnimations.run_up_left:
        this.frameY = this.allAnimations.idle_up_left;
        break;
      case this.allAnimations.run_up:
        this.frameY = this.allAnimations.idle_up;
        break;
      case this.allAnimations.run_down:
        this.frameY = this.allAnimations.idle_down;
        break;
      case this.allAnimations.run_left:
        this.frameY = this.allAnimations.idle_left;
        break;
      case this.allAnimations.run_right:
        this.frameY = this.allAnimations.idle_right;
        break;
    }
  }
  checkNavy(navys: NavyNPC[]) {
    for (const navy of navys) {
      if (this.intersects(navy)) {
        // 2️⃣ calcular centros
        const playerCenterX = (this.left + this.right) / 2;
        const playerCenterY = (this.top + this.bottom) / 2;

        const naviCenterX = (navy.left + navy.right) / 2;
        const naviCenterY = (navy.top + navy.bottom) / 2;

        const dx = playerCenterX - naviCenterX;
        const dy = playerCenterY - naviCenterY;

        // 3️⃣ decidir una sola dirección
        if (Math.abs(dx) > Math.abs(dy)) {
          // horizontal
          if (dx < 0) {
            navy.moveImageChat("leftUp", this);
            this.frameY = this.allAnimations.idle_down_right;
          } else {
            navy.moveImageChat("rightDown", this);
            this.frameY = this.allAnimations.idle_up_left;
          }
        } else {
          // vertical
          if (dy < 0) {
            navy.moveImageChat("rightUp", this);
            this.frameY = this.allAnimations.idle_down_left;
          } else {
            navy.moveImageChat("leftDown", this);
            this.frameY = this.allAnimations.idle_up_right;
          }
        }
      }
    }
  }
}
