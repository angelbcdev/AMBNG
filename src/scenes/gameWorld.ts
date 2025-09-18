import { GameState } from "../core/GameState";

import { FloorRoad } from "../world/class";
import { createWorld, matrix01 } from "../world/utils";
import { Scene } from "./Scene";

const bg = new Image();
bg.src = "/assects/world/world00.png";
bg.width = 1123;
bg.height = 693;

export class GameWorld {
  scene: Scene;
  map: FloorRoad[] = [];
  gameState = GameState.getInstance();
  playerWorld: WordPlayer = new WordPlayer();

  constructor() {
    this.map = createWorld(matrix01);
  }
  update(_: CanvasRenderingContext2D, __: number) {}
  draw(c: CanvasRenderingContext2D, __: number) {
    this.map = this.map.filter((floor) => !floor.isDelete);
    this.playerWorld.allBlocks = this.map;

    if (this.gameState.isInWorld()) {
      c.save();
      c.scale(1.5, 1.5);
      // c.translate(this.playerWorld.camera.moveX, this.playerWorld.camera.moveY);
      c.drawImage(bg, 0, 0, bg.width, bg.height);

      this.map.forEach((floor) => {
        floor.draw(c);
        this.playerWorld.isRoad(floor);
      });

      this.playerWorld.update(c);
      c.restore();
    }
  }
}

class WordPlayer {
  x: number;
  y: number;
  width: number;
  gameState = GameState.getInstance();
  height: number;
  velocity = { x: 0, y: 0 };
  frameTime = 0;
  frameInterval = 1000 / 12;
  frameX = 0;

  moveFrameX = 23;
  moveFrameY = 35;
  frameWidth = 176;
  frameHeight = 162;
  maxFrame = 5;
  fps = 12;
  image = new Image();

  allAnimations = {
    comming: 0,
    runDown: 1,
    runUp: 2,
    runLeft: 3,
    runRight: 4,
    idleDown: 5,
    idleUp: 6,
    idleLeft: 7,
    idleRight: 8,
  };
  frameY = this.allAnimations.idleDown;

  cameraMove = true;
  playerMove = {
    left: true,
    right: true,
    up: true,
    down: true,
  };
  allBlocks = [];
  camerabox: {
    position: { x: number; y: number };
    width: number;
    height: number;
  };
  mundo = {
    x: 0,
    y: 0,
    w: bg.width,
    h: bg.height,
  };
  camera: {
    x: number;
    y: number;
    w: number;
    h: number;
    isFollowing: boolean;
    moveX: number;
    moveY: number;
  };
  keyPress = [""];
  savePosition = { x: 0, y: 0 };
  speed = 2.5;

  constructor() {
    this.image.src = "/assects/world/megaman176_x_162.png";
    this.x = 135; /// 2 - 16 / 2;
    this.y = 85; /// 2 - 16 / 2;
    this.width = 16;
    this.height = 16;

    // bg.width = 1123;
    // bg.height = 693;

    this.camera = {
      x: this.x,
      y: this.y,
      w: 300,
      h: 300,
      isFollowing: true,
      moveX: 0,
      moveY: 0,
    };
    this.updateCamera();
  }
  updateFrame(c: CanvasRenderingContext2D, deltaTime: number) {
    if (this.frameTime >= this.frameInterval) {
      this.frameTime = 0;
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
    } else {
      this.frameTime += deltaTime;
    }

    c.drawImage(
      this.image,
      this.frameX * this.frameWidth,
      this.frameY * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      this.x - this.moveFrameX,
      this.y - this.moveFrameY,
      64,
      64
    );
  }
  update(c: CanvasRenderingContext2D, deltaTime = 16.66) {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.input();
    this.updateCamera();
    this.draw(c);
    this.updateFrame(c, deltaTime);

    if (!this.cameraMove) {
      if (
        !this.playerMove.left &&
        this.x - this.width / 3 > this.savePosition.x
      ) {
        this.playerMove.left = true;
        this.cameraMove = true;
      }

      if (
        !this.playerMove.right &&
        this.x + this.width / 3 < this.savePosition.x
      ) {
        this.cameraMove = true;

        this.playerMove.right = true;
      }
      if (
        !this.playerMove.up &&
        this.y - this.height / 3 > this.savePosition.y
      ) {
        this.cameraMove = true;

        this.playerMove.up = true;
      }
      if (
        !this.playerMove.down &&
        this.y + this.height / 3 < this.savePosition.y
      ) {
        this.cameraMove = true;
        this.playerMove.down = true;
      }
    }
  }
  isRoad(floor: FloorRoad) {
    const gap = 0.12;
    if (
      this.x < floor.x + floor.width &&
      this.x + this.width > floor.x &&
      this.y < floor.y + floor.height &&
      this.y + this.height > floor.y
    ) {
      if (floor.isCollision) {
        if (this.cameraMove) {
          this.cameraMove = false;

          this.savePosition = { x: this.x, y: this.y };
        }
        if (this.velocity.x > 0 && this.playerMove.right) {
          this.velocity.x = 0;

          this.x = floor.x - (this.width + gap);
          this.playerMove = { ...this.playerMove, right: false };
        } else if (this.velocity.x < 0 && this.playerMove.left) {
          this.velocity.x = 0;
          this.playerMove = { ...this.playerMove, left: false };
          this.x = floor.x + (floor.width + gap);
        } else if (this.velocity.y > 0 && this.playerMove.down) {
          this.velocity.y = 0;
          this.playerMove = { ...this.playerMove, down: false };
          this.y = floor.y - (this.height + gap);
        } else if (this.velocity.y < 0 && this.playerMove.up) {
          this.velocity.y = 0;
          this.playerMove = { ...this.playerMove, up: false };
          this.y = floor.y + (floor.height + gap);
        }
        return;
      } else {
        if (!floor.isDelete && !this.gameState.isInBattle()) {
          floor.isDelete = true;
          const scene = Scene.getInstance();

          scene.startBattle();
          //TODO game.startNewBattle({ backGround: 3, allEnemies: [], floorImage: 2 });
          return;
        }
      }
    }
  }

  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "red";
    c.fillRect(this.x, this.y, this.width, this.height);

    c.fillStyle = "#affff040";
    c.fillRect(this.camera.x, this.camera.y, this.camera.w, this.camera.h);
  }
  input() {
    document.addEventListener("keydown", (e) => {
      if (this.gameState.isInBattle()) return;

      switch (e.key) {
        case "ArrowLeft":
          if (this.playerMove.left) {
            this.frameY = this.allAnimations.runLeft;
            this.velocity.y = 0;
            // this.velocity.y = this.speed * 0.5;
            this.velocity.x = -this.speed;
          }
          break;

        case "ArrowRight":
          if (this.playerMove.right) {
            this.frameY = this.allAnimations.runRight;
            this.velocity.y = 0;
            // this.velocity.y = -this.speed * 0.5;
            this.velocity.x = this.speed;
          }
          break;
        case "ArrowUp":
          if (this.playerMove.up) {
            this.frameY = this.allAnimations.runUp;
            this.velocity.x = 0;
            // this.velocity.x = -this.speed * 1.45;
            // this.velocity.y = -this.speed * 0.75;
            this.velocity.y = -this.speed;
          }
          break;
        case "ArrowDown":
          if (this.playerMove.down) {
            this.frameY = this.allAnimations.runDown;
            this.velocity.x = 0;
            // this.velocity.x = this.speed * 1.45;
            // this.velocity.y = this.speed * 0.75;
            this.velocity.y = this.speed;
          }
          break;
        default:
          break;
      }
    });
    document.addEventListener("keyup", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          this.velocity.x = 0;
          this.velocity.y = 0;
          this.frameY = this.allAnimations.idleLeft;
          break;
        case "ArrowRight":
          this.velocity.x = 0;
          this.velocity.y = 0;
          this.frameY = this.allAnimations.idleRight;
          break;
        case "ArrowUp":
          this.velocity.x = 0;
          this.velocity.y = 0;
          this.frameY = this.allAnimations.idleUp;
          break;
        case "ArrowDown":
          this.velocity.x = 0;
          this.velocity.y = 0;
          this.frameY = this.allAnimations.idleDown;
          break;
        default:
          break;
      }
    });
  }
  updateCamera() {
    const canvas = { width: 130, height: 130 };

    //!player is on the top
    this.shouldPanCameraUp();
    // !player is on the left

    this.shouldPanCameraToTheLeft();
    // !player is on the right

    this.shouldPanCameraToTheRight({ canvas });

    // !player is on the bottom

    this.shouldPanCameraDown({ canvas });

    if (this.camera.isFollowing) {
      this.camera.x = this.x - this.camera.w / 2 + this.width / 2;
      this.camera.y = this.y - this.camera.h / 2 + this.height / 2;
    }
  }
  shouldPanCameraUp() {
    if (!this.playerMove.up) return;
    const movedHeight = Math.abs(this.camera.moveY);

    // Si el jugador se mueve hacia abajo, salir de la función
    if (this.velocity.y >= 0) return;

    // Verifica si la cámara ha alcanzado el límite superior visible
    if (this.camera.y <= movedHeight) {
      // Solo mueve la cámara si aún hay espacio en el mundo para moverse hacia arriba
      if (movedHeight > 0) {
        this.camera.moveY -= this.velocity.y; // Mueve la cámara hacia arriba
      }
    }
  }
  shouldPanCameraDown({ canvas }) {
    if (!this.playerMove.down) return;

    const movedHeight = canvas.height + Math.abs(this.camera.moveY);

    // Si el jugador se mueve hacia arriba, salir de la función
    if (this.velocity.y <= 0) return;

    // Verifica si la cámara ha alcanzado el límite inferior visible
    if (this.camera.y + this.camera.h >= movedHeight) {
      // Solo mueve la cámara si aún hay espacio en el mundo para moverse hacia abajo
      if (movedHeight < this.mundo.h) {
        this.camera.moveY -= this.velocity.y; // Mueve la cámara hacia abajo
      }
    }
  }
  shouldPanCameraToTheLeft() {
    if (!this.playerMove.left) return;

    // Calcula el ancho movido basado en la posición actual de la cámara
    const movedWidth = Math.abs(this.camera.moveX);

    // Si el jugador se mueve hacia la derecha, salir de la función
    if (this.velocity.x >= 0) return;

    // Verifica si la cámara ha alcanzado el límite izquierdo visible
    if (this.camera.x <= movedWidth) {
      //   // Solo mueve la cámara si aún hay espacio en el mundo para moverse hacia la izquierda
      if (movedWidth > 0) {
        this.camera.moveX -= this.velocity.x; // Mueve la cámara en la dirección opuesta
      }
    }

    // camera.position.x -= this.velocity.x
  }

  shouldPanCameraToTheRight({ canvas }) {
    if (!this.playerMove.right) return;

    const movedWidth = canvas.width + Math.abs(this.camera.moveX);

    if (this.velocity.x <= 0) return;

    if (this.camera.x + this.camera.w >= movedWidth) {
      if (movedWidth < this.mundo.w) {
        this.camera.moveX -= this.velocity.x;
      }
    }
  }
}
