import { Entity } from "../player/entity";
import { Game } from "../gameBattle";

export interface TCreateAttack {
  possition: { x: number; y: number };
  sideToPlay: boolean;
  color: string;
  damage: number;
  origin: string;
  game: Game;
  faceToLeft?: boolean;
  Attack?: Attack;
}

class Attack extends Entity {
  isToLeft: string;
  ajustY: number;
  drawX: number;
  speed = 1;
  widthSprite: number;
  heightSprite: number;
  frameAjustY = 10;
  frameAjustX = 0;
  attackOuwner: Entity;
  initialMatrixY: number;
  isDev: boolean;
  canMakeDamage = true;

  constructor({
    possition: { x, y, initialMatrixY },
    sideToPlay,
    color,
    damage = 5,

    attackOuwner,
  }) {
    super({ x, y, sideToPlay });
    this.width = 65;
    this.height = 50;
    this.widthSprite = this.width;
    this.heightSprite = this.height;

    this.initialMatrixY = initialMatrixY;
    this.color = color + "80";

    this.delete = false;
    this.isDev = false;
    this.color = color + "30";
    this.image = new Image();
    this.ajustY = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.damage = damage;
    this.frameTime = 1000 / 60;
    this.frameInterval = 100;
    this.maxFrame = 3;
    this.incialFrameX = 0;
    this.incialFrameY = 0;
    this.frameWidth = 90;
    this.frameHeight = 76;
    this.attackOuwner = attackOuwner;
    this.game = attackOuwner?.game;

    this.possition = {
      x: this.isToLeft === "left" ? (x / 70) * 70 : x + 55,
      y: y + 5,
    };
    this.drawX = this.faceToLeft
      ? -this.possition.x - this.drawxStings.xl
      : this.sideToPlay
      ? this.possition.x - this.drawxStings.rl
      : this.possition.x - this.drawxStings.ll;
  }

  update(c: CanvasRenderingContext2D, deltaTime: number) {
    this.draw(c, deltaTime);
    if (this.possition.x > 430 || this.possition.x < -30) {
      this.delete = true;
    }
    this.drawX = this.faceToLeft
      ? -this.possition.x - this.drawxStings.xl
      : this.sideToPlay
      ? this.possition.x - this.drawxStings.rl
      : this.possition.x - this.drawxStings.ll;
    this.limitByMatrix(deltaTime);
  }
  limitByMatrix(deltaTime: number) {
    if (this.getMatrixIndices(this.possition.x, this.possition.y)) {
      if (this.attackOuwner.side === 1) {
        this.possition.x -= this.speed * deltaTime;
      } else {
        this.possition.x += this.speed * deltaTime;
      }
    } else {
      this.delete = true;
    }
  }
  draw(c: CanvasRenderingContext2D, deltaTime: number) {
    this.updateframe(deltaTime);
    if (
      this.isDev
      // true
    ) {
      c.fillStyle = this.color;
      c.fillRect(this.possition.x, this.possition.y, this.width, this.height);
    }
    this.drawSprite(c);
  }
  drawSprite(c) {
    c.save(); // Guardar el estado actual del contexto

    // Invertir el eje X si `faceToLeft` es verdadero
    c.scale(this.faceToLeft ? -1 : 1, 1);

    // Ajustar la posición en X para que la imagen se pinte correctamente

    c.drawImage(
      this.image,
      this.frameX * this.frameWidth,
      this.frameY * this.frameHeight,
      this.frameWidth,
      this.frameHeight,

      this.drawX - this.frameAjustX,
      this.possition.y - this.frameAjustY,
      this.widthSprite,
      this.heightSprite
    );

    c.restore();
  }
  getMatrixIndices = (xPos, yPos, jump = 70) => {
    // Calculamos el índice en x (que es simplemente el valor de xPos dividido por jump)
    let matrixX = Math.floor(xPos / jump);

    // Aseguramos que matrixX nunca sea negativo
    if (matrixX < 0) matrixX = 0;

    // Determinamos el índice en y
    let matrixY;

    // Definimos los valores de gap para cada fila
    const gap = 100;

    // Comprobamos el rango de yPos considerando los diferentes valores de gap
    if (yPos >= gap && yPos < gap + jump) {
      matrixY = 0; // Fila 0
    } else if (yPos >= gap + 30 && yPos < gap + 30 + jump) {
      matrixY = 1; // Fila 1
    } else if (yPos >= gap + 11 && yPos < gap + 11 + jump) {
      matrixY = 2; // Fila 2
    } else if (yPos >= gap - 8 && yPos < gap - 8 + jump) {
      matrixY = 3; // Fila 3
    } else {
      // Si la posición y no está en un rango válido, asignamos -1
      matrixY = -1;
    }

    // Si matrixY es -1, lo corregimos a 0
    if (matrixY === -1) matrixY = 0;
    if (matrixX === -1) matrixX = 0;
    this.attackFloorEfect(matrixX, this.initialMatrixY);
    // Retornamos los índices calculados
    return (
      this.game.matrix[matrixY][matrixX]?.side == 0 ||
      this.game.matrix[matrixY][matrixX]?.side == 1
    );
  };
  attackCollision(_: Entity) {
    this.delete = true;
  }
  attackFloorEfect(_: number, __: number) {}
  attackEnemyEfect(_: Entity) {}
}

export default Attack;
