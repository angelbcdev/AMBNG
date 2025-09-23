import { GAME } from "@/cuarentene/sceneManager";
import { EnemyZone, FloorRoad } from "./class";
import { GameWorld } from "./gameWorld";

export class WordPlayer {
  x: number = 430 / 2 - 16 / 2;
  y: number = 430 / 2;
  width: number;
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

  cameraMove = false;
  playerMove = {
    left: true,
    right: true,
    up: true,
    down: true,
  };

  // Nuevo: Estados de colisión para cada dirección
  collisionStates = {
    left: false,
    right: false,
    up: false,
    down: false,
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
    w: 300,
    h: 300,
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

  constructor(gameWorld: GameWorld) {
    this.image.src = "/assects/world/megaman176_x_162.png";
    this.x = 135;
    this.y = 85;
    this.width = 16;
    this.height = 16;

    this.mundo = {
      x: 0,
      y: 0,
      w: gameWorld.screen.width,
      h: gameWorld.screen.height,
    };

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

    // Inicializar savePosition
    this.savePosition = { x: this.x, y: this.y };
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
    this.allBlocks.forEach((block: FloorRoad | EnemyZone) => {
      block.draw(c);
      this.isRoad(block);
    });

    // Primero resetear estados de colisión
    this.resetCollisionStates();

    // Verificar colisiones ANTES del movimiento
    this.checkAllCollisions();

    // Detener velocidad si hay colisión en esa dirección
    if (this.collisionStates.left && this.velocity.x < 0) this.velocity.x = 0;
    if (this.collisionStates.right && this.velocity.x > 0) this.velocity.x = 0;
    if (this.collisionStates.up && this.velocity.y < 0) this.velocity.y = 0;
    if (this.collisionStates.down && this.velocity.y > 0) this.velocity.y = 0;

    // Aplicar movimiento solo si no hay colisión
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    // Keep player inside world bounds
    if (this.x < 0) this.x = 0;
    if (this.y < 35) this.y = 35;
    if (this.x + this.width > this.mundo.w) this.x = this.mundo.w - this.width;
    if (this.y + this.height > this.mundo.h)
      this.y = this.mundo.h - this.height;

    this.input();
    this.resetMove();
    this.updateCamera(); // Mover después de resetMove
    this.draw(c);
    this.updateFrame(c, deltaTime);
  }

  // Nuevo: Resetear estados de colisión cada frame
  resetCollisionStates() {
    this.collisionStates = {
      left: false,
      right: false,
      up: false,
      down: false,
    };
  }

  // Nuevo: Verificar todas las colisiones antes del movimiento
  checkAllCollisions() {
    // Aquí deberías iterar sobre todos tus objetos de colisión
    // Por ahora asumo que tienes un array llamado allBlocks o similar
    this.allBlocks.forEach((block: FloorRoad | EnemyZone) => {
      this.checkCollisionWithBlock(block);
    });
  }

  // Nuevo: Verificar colisión con un bloque específico
  checkCollisionWithBlock(floor: FloorRoad | EnemyZone) {
    if (!floor.isCollision) return;

    const nextX = this.x + this.velocity.x;
    const nextY = this.y + this.velocity.y;

    // Verificar colisión horizontal
    if (this.velocity.x !== 0) {
      if (
        nextX < floor.x + floor.width &&
        nextX + this.width > floor.x &&
        this.y < floor.y + floor.height &&
        this.y + this.height > floor.y
      ) {
        if (this.velocity.x > 0) {
          this.collisionStates.right = true;
        } else if (this.velocity.x < 0) {
          this.collisionStates.left = true;
        }
      }
    }

    // Verificar colisión vertical
    if (this.velocity.y !== 0) {
      if (
        this.x < floor.x + floor.width &&
        this.x + this.width > floor.x &&
        nextY < floor.y + floor.height &&
        nextY + this.height > floor.y
      ) {
        if (this.velocity.y > 0) {
          this.collisionStates.down = true;
        } else if (this.velocity.y < 0) {
          this.collisionStates.up = true;
        }
      }
    }
  }

  // Método mejorado: resetMove con lógica más clara
  resetMove() {
    const deltaX = this.x - this.savePosition.x;
    const deltaY = this.y - this.savePosition.y;
    const deadZoneX = this.width / 3;
    const deadZoneY = this.height / 3;

    // Resetear todos los estados de movimiento
    this.playerMove = {
      left: true,
      right: true,
      up: true,
      down: true,
    };
    this.cameraMove = false;

    // Deshabilitar movimiento solo si hay colisión en esa dirección
    if (this.collisionStates.left) this.playerMove.left = false;
    if (this.collisionStates.right) this.playerMove.right = false;
    if (this.collisionStates.up) this.playerMove.up = false;
    if (this.collisionStates.down) this.playerMove.down = false;

    // Habilitar cameraMove solo si está fuera de la zona muerta Y puede moverse
    if (deltaX > deadZoneX && this.playerMove.left) {
      this.cameraMove = true;
    } else if (deltaX < -deadZoneX && this.playerMove.right) {
      this.cameraMove = true;
    }

    if (deltaY > deadZoneY && this.playerMove.up) {
      this.cameraMove = true;
    } else if (deltaY < -deadZoneY && this.playerMove.down) {
      this.cameraMove = true;
    }

    // Si no está en colisión y está dentro de la zona muerta, actualizar savePosition
    if (!this.cameraMove && !this.hasAnyCollision()) {
      this.savePosition = { x: this.x, y: this.y };
    }
  }

  // Nuevo: Verificar si hay alguna colisión activa
  hasAnyCollision(): boolean {
    return (
      this.collisionStates.left ||
      this.collisionStates.right ||
      this.collisionStates.up ||
      this.collisionStates.down
    );
  }

  // Método simplificado: isRoad (ahora solo maneja la lógica de colisión)
  isRoad(floor: FloorRoad | EnemyZone) {
    const gap = 0.12;
    if (
      this.x < floor.x + floor.width &&
      this.x + this.width > floor.x &&
      this.y < floor.y + floor.height &&
      this.y + this.height > floor.y
    ) {
      if (floor.constructor.name == "EnemyZone") {
        GAME.changeScene(GAME.statesKeys.battle);
        floor.isDelete = true;
        this.allBlocks = this.allBlocks.filter((block) => !block.isDelete);
      }
      if (floor.isCollision) {
        // Detener velocidad y corregir posición según la dirección de colisión
        if (this.velocity.x > 0 && this.collisionStates.right) {
          this.velocity.x = 0;
          this.x = floor.x - (this.width + gap);
        } else if (this.velocity.x < 0 && this.collisionStates.left) {
          this.velocity.x = 0;
          this.x = floor.x + (floor.width + gap);
        } else if (this.velocity.y > 0 && this.collisionStates.down) {
          this.velocity.y = 0;
          this.y = floor.y - (this.height + gap);
        } else if (this.velocity.y < 0 && this.collisionStates.up) {
          this.velocity.y = 0;
          this.y = floor.y + (floor.height + gap);
        }

        // Guardar posición cuando hay colisión
        if (this.hasAnyCollision()) {
          this.savePosition = { x: this.x, y: this.y };
          this.cameraMove = false;
        }

        return;
      }
    }
  }

  draw(c: CanvasRenderingContext2D) {
    if (GAME.isDev) {
      c.fillStyle = "red";
      c.fillRect(this.x, this.y, this.width, this.height);

      c.fillStyle = "#affff040";
      c.fillRect(this.camera.x, this.camera.y, this.camera.w, this.camera.h);

      c.fillStyle = "#000";
      c.font = "16px Arial";
      c.fillText(
        `(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`,
        this.x,
        this.y - 10
      );

      // Debug: Mostrar estados de colisión
      c.fillStyle = "blue";
      c.font = "12px Arial";
      const collisionText = Object.entries(this.collisionStates)
        .filter(([_, value]) => value)
        .map(([key, _]) => key)
        .join(", ");
      if (collisionText) {
        c.fillText(`Collision: ${collisionText}`, this.x, this.y - 25);
      }
    }
  }

  input() {
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          if (this.playerMove.left && !this.collisionStates.left) {
            this.frameY = this.allAnimations.runLeft;
            this.velocity.y = 0;
            this.velocity.x = -this.speed;
          }
          break;
        case "ArrowRight":
          if (this.playerMove.right && !this.collisionStates.right) {
            this.frameY = this.allAnimations.runRight;
            this.velocity.y = 0;
            this.velocity.x = this.speed;
          }
          break;
        case "ArrowUp":
          if (this.playerMove.up && !this.collisionStates.up) {
            this.frameY = this.allAnimations.runUp;
            this.velocity.x = 0;
            this.velocity.y = -this.speed;
          }
          break;
        case "ArrowDown":
          if (this.playerMove.down && !this.collisionStates.down) {
            this.frameY = this.allAnimations.runDown;
            this.velocity.x = 0;
            this.velocity.y = this.speed;
          }
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
      }
    });
  }

  updateCamera() {
    const canvas = { width: 130, height: 130 };

    // Los métodos de pan solo deben verificar su propia dirección
    this.shouldPanCameraUp();
    this.shouldPanCameraToTheLeft();
    this.shouldPanCameraToTheRight({ canvas });
    this.shouldPanCameraDown({ canvas });

    // La cámara SIEMPRE debe seguir al jugador si está configurada para hacerlo
    if (this.camera.isFollowing) {
      this.camera.x = this.x - this.camera.w / 2 + this.width / 2;
      this.camera.y = this.y - this.camera.h / 2 + this.height / 2;
    }

    // Clamp camera inside world
    if (this.camera.x < 0) this.camera.x = 0;
    if (this.camera.y < 0) this.camera.y = 0;
    if (this.camera.x + this.camera.w > this.mundo.w)
      this.camera.x = this.mundo.w - this.camera.w;
    if (this.camera.y + this.camera.h > this.mundo.h)
      this.camera.y = this.mundo.h - this.camera.h;
  }

  shouldPanCameraUp() {
    // Solo verificar si NO debe moverse hacia arriba específicamente
    if (!this.playerMove.up || this.velocity.y >= 0 || this.collisionStates.up)
      return;
    const movedHeight = Math.abs(this.camera.moveY);
    if (this.camera.y <= movedHeight && movedHeight > 0) {
      this.camera.moveY -= this.velocity.y;
    }
  }

  shouldPanCameraDown({ canvas }) {
    // Solo verificar si NO debe moverse hacia abajo específicamente
    if (
      !this.playerMove.down ||
      this.velocity.y <= 0 ||
      this.collisionStates.down
    )
      return;
    if (this.y + this.height <= this.camera.h / 2) return;
    const movedHeight = canvas.height + Math.abs(this.camera.moveY);
    if (
      this.camera.y + this.camera.h >= movedHeight &&
      movedHeight < this.mundo.h
    ) {
      this.camera.moveY -= this.velocity.y;
    }
  }

  shouldPanCameraToTheLeft() {
    // Solo verificar si NO debe moverse hacia la izquierda específicamente
    if (
      !this.playerMove.left ||
      this.velocity.x >= 0 ||
      this.collisionStates.left
    )
      return;
    const movedWidth = Math.abs(this.camera.moveX);
    if (this.camera.x <= movedWidth && movedWidth > 0) {
      this.camera.moveX -= this.velocity.x;
    }
  }

  shouldPanCameraToTheRight({ canvas }) {
    // Solo verificar si NO debe moverse hacia la derecha específicamente
    if (
      !this.playerMove.right ||
      this.velocity.x <= 0 ||
      this.collisionStates.right
    )
      return;
    if (this.x + this.width <= this.camera.w / 2) return;
    const movedWidth = canvas.width + Math.abs(this.camera.moveX);
    if (
      this.camera.x + this.camera.w >= movedWidth &&
      movedWidth < this.mundo.w
    ) {
      this.camera.moveX -= this.velocity.x;
    }
  }
}
