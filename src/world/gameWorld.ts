import { createWorld, matrix01 } from "./utils";

export class GameWorld {
  map: FloorRoad[] = [];
  playerWorld: WordPlayer = new WordPlayer();

  constructor() {
    this.map = createWorld(matrix01);
  }
  draw(c: CanvasRenderingContext2D) {
    this.playerWorld.allBlocks = this.map;
    c.save();
    c.scale(2, 2);
    c.rotate(-0.4);
    // console.log("this.playerWorld.camera", this.playerWorld.camera);

    c.translate(this.playerWorld.camera.moveX, this.playerWorld.camera.moveY);
    c.fillStyle = "blue";
    c.fillRect(0, 0, 430, 400);
    this.map.forEach((floor) => {
      floor.draw(c);
      this.playerWorld.isRoad(floor);
    });
    this.playerWorld.update(c);

    c.restore();
  }
}

export class FloorRoad {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  draw(c: CanvasRenderingContext2D) {
    c.fillStyle = "green";
    c.fillRect(this.x, this.y, this.width, this.height);
  }
}

class WordPlayer {
  x: number;
  y: number;
  width: number;
  height: number;
  velocity = { x: 0, y: 0 };
  cameraMove = { x: true, y: true };
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
    w: 430,
    h: 430,
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
  savePosition = { x: 0, y: 0 };

  constructor() {
    this.x = 130 / 2 - 16 / 2;
    this.y = 280 / 2 - 16 / 2;
    this.width = 16;
    this.height = 16;

    this.camera = {
      x: this.x,
      y: this.y,
      w: 400,
      h: 400,
      isFollowing: true,
      moveX: 0,
      moveY: 0,
    };
  }
  update(c) {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.input();
    this.draw(c);
    this.updateCamera();

    if (!this.cameraMove.x) {
      if (
        this.x + this.width < this.savePosition.x ||
        this.x - this.width > this.savePosition.x
      ) {
        this.cameraMove.x = true;

        if (!this.playerMove.left) this.playerMove.left = true;
        if (!this.playerMove.right) this.playerMove.right = true;
      }
    }
    if (!this.cameraMove.y) {
      if (
        this.y + this.height < this.savePosition.y ||
        this.y - this.height > this.savePosition.y
      ) {
        this.cameraMove.y = true;
        if (!this.playerMove.up) this.playerMove.up = true;
        if (!this.playerMove.down) this.playerMove.down = true;
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
      if (this.cameraMove.x && this.cameraMove.y) {
        this.savePosition = { x: this.x, y: this.y };
      }
      if (this.velocity.x > 0) {
        this.velocity.x = 0;

        this.x = floor.x - (this.width + gap);
        this.playerMove = { ...this.playerMove, right: false };
        this.cameraMove.x = false;
      } else if (this.velocity.x < 0) {
        this.velocity.x = 0;
        this.cameraMove.x = false;
        this.playerMove = { ...this.playerMove, left: false };
        this.x = floor.x + (floor.width + gap);
      } else if (this.velocity.y > 0) {
        this.velocity.y = 0;
        this.cameraMove.y = false;
        this.playerMove = { ...this.playerMove, down: false };
        this.y = floor.y - (this.height + gap);
      } else if (this.velocity.y < 0) {
        this.velocity.y = 0;
        this.cameraMove.y = false;
        this.playerMove = { ...this.playerMove, up: false };
        this.y = floor.y + (floor.height + gap);
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
      // if (!this.cameraMove) return;

      switch (e.key) {
        case "ArrowLeft":
          if (this.playerMove.left) {
            // this.velocity.y = 0;
            this.velocity.x = -1;
          }
          break;

        case "ArrowRight":
          if (this.playerMove.right) {
            // this.velocity.y = 0;
            this.velocity.x = 1;
          }
          break;
        case "ArrowUp":
          if (this.playerMove.up) {
            // this.velocity.x = 0;
            this.velocity.y = -1;
          }
          break;
        case "ArrowDown":
          if (this.playerMove.down) {
            // this.velocity.x = 0;
            this.velocity.y = 1;
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
          break;
        case "ArrowRight":
          this.velocity.x = 0;
          break;
        case "ArrowUp":
          this.velocity.y = 0;
          break;
        case "ArrowDown":
          this.velocity.y = 0;
          break;
        default:
          break;
      }
    });
  }
  updateCamera() {
    const canvas = { width: 1, height: 1 };

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
    if (!this.cameraMove.y) return;
    const movedHeight = Math.abs(this.camera.moveY);

    // Si el jugador se mueve hacia abajo, salir de la función
    if (this.velocity.y >= 0) return;

    // Verifica si la cámara ha alcanzado el límite superior visible
    // if (this.camera.y <= movedHeight) {
    //   // Solo mueve la cámara si aún hay espacio en el mundo para moverse hacia arriba
    //   if (movedHeight > 0) {
    this.camera.moveY -= this.velocity.y; // Mueve la cámara hacia arriba
    //   }
    // }
  }
  shouldPanCameraDown({ canvas }) {
    if (!this.cameraMove.y) return;
    const movedHeight = canvas.height + Math.abs(this.camera.moveY);

    // Si el jugador se mueve hacia arriba, salir de la función
    if (this.velocity.y <= 0) return;

    console.log("this.camera", this.camera.y + this.camera.h);

    // Verifica si la cámara ha alcanzado el límite inferior visible
    // if (this.camera.y + this.camera.h >= movedHeight) {
    //   // Solo mueve la cámara si aún hay espacio en el mundo para moverse hacia abajo
    //   if (movedHeight < this.mundo.h) {
    this.camera.moveY -= this.velocity.y; // Mueve la cámara hacia abajo
    //   }
    // }
  }
  shouldPanCameraToTheLeft() {
    if (!this.cameraMove.x) return;
    // Calcula el ancho movido basado en la posición actual de la cámara
    const movedWidth = Math.abs(this.camera.moveX);

    // Si el jugador se mueve hacia la derecha, salir de la función
    if (this.velocity.x >= 0) return;

    // Verifica si la cámara ha alcanzado el límite izquierdo visible
    // if (this.camera.x <= movedWidth) {
    //   // Solo mueve la cámara si aún hay espacio en el mundo para moverse hacia la izquierda
    //   if (movedWidth > 0) {
    this.camera.moveX -= this.velocity.x; // Mueve la cámara en la dirección opuesta
    //   }
    // }

    // camera.position.x -= this.velocity.x
  }

  shouldPanCameraToTheRight({ canvas }) {
    if (!this.cameraMove.x) return;
    const movedWidth = canvas.width + Math.abs(this.camera.moveX);

    if (this.velocity.x <= 0) return;

    // if (this.camera.x + this.camera.w >= movedWidth) {
    //   if (movedWidth < this.mundo.w) {
    this.camera.moveX -= this.velocity.x;
    //   }
    // }
  }
}
