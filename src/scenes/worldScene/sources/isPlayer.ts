import { keyBindings } from "@/config/keyBindings";
import { mySquare } from "./isoEntitys";
import { GAME_IS_DEV } from "@/scenes/battleScene/sources/gameState";

export class PlayerIso extends mySquare {
  color: string = "#fff000";
  speed: number = 1.5;
  isMove: boolean = false;
  pressKey: string[] = [];
  lastPress: string | null = null;

  frameTime = 0;
  frameInterval = 1000 / 12;
  frameX = 0;

  moveFrameX = 8.5;
  moveFrameY = 16;
  frameWidth = 33;
  frameHeight = 42;
  maxFrame = 5;
  fps = 12;
  image = new Image();

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

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width / 3, height / 3);
    this.image.src = "/assects/megaman/ sprite_mega_world.png";
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
    if (this.pressKey.includes(keyBindings.useChip)) {
      this.speed = 1.75;
    } else {
      this.speed = 0.75;
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
    z: number
  ) {
    const x = this.left / 2 - this.top / 2 - cam.x;
    const y = this.left / 4 + this.top / 4 - z - cam.y;
    if (GAME_IS_DEV()) {
      const TILE_W = 16;
      const TILE_H = 8;
      c.fillStyle = this.color + "50";
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
      20
    );
  }

  moveUp(wall: mySquare[]) {
    this.isMove = true;

    this.y -= this.speed;
    for (let i = 0, l = wall.length; i < l; i += 1) {
      if (this.intersects(wall[i])) {
        this.top = wall[i].bottom;
      }
    }
  }

  moveRight(wall: mySquare[]) {
    this.isMove = true;

    this.x += this.speed;
    for (let i = 0, l = wall.length; i < l; i += 1) {
      if (this.intersects(wall[i])) {
        this.right = wall[i].left;
      }
    }
  }
  moveDown(wall: mySquare[]) {
    this.isMove = true;

    this.y += this.speed;
    for (let i = 0, l = wall.length; i < l; i += 1) {
      if (this.intersects(wall[i])) {
        this.bottom = wall[i].top;
      }
    }
  }
  moveLeft(wall: mySquare[]) {
    this.isMove = true;

    this.x -= this.speed;
    for (let i = 0, l = wall.length; i < l; i += 1) {
      if (this.intersects(wall[i])) {
        this.left = wall[i].right;
      }
    }
  }
  checkKeyUp = (e: KeyboardEvent) => {
    this.pressKey.splice(this.pressKey.indexOf(e.key), 1);
    this.returnIdle();
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
}
