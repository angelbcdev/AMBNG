import { Nodo } from "../master";
import Attack from "./attacks";
import { ExplotionsBombs } from "../../Ts/StaticAnimations.js";
import Player from "../player/player.js";
import { DashShoot } from "./dashShoot.js";
import BeeTank from "../enemys/Character/beeTank/beetank.js";

export class BasicAttack extends Attack {
  constructor(data: any) {
    super(data as any);

    this.width = 25;
    this.height = 20;
    this.ajustY = 23;
    this.frameX = 0;

    this.delete = false;
    this.speed = 0.5;
    this.image.src = `/assects/attaks/basibulet.png`;
    this.frameAjustY = 10;
    this.frameAjustX = 10;
    this.heightSprite = 40;
    this.widthSprite = 40;
  }
  update(c: CanvasRenderingContext2D, deltaTime: number) {
    super.update(c, deltaTime);
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
      this.possition.y - this.frameAjustY - 32,
      this.widthSprite,
      this.heightSprite
    );

    c.restore();
  }
  limitByMatrix(deltaTime: number) {
    if (this.isToLeft === "left") {
      this.possition.x -= this.speed * deltaTime;
    } else {
      this.possition.x += this.speed * deltaTime;
    }
  }
}

export class BasicPunsh extends Attack {
  backMove = 1;
  constructor(data: any) {
    const { type = 1 } = data;

    super(data as any);
    this.backMove = type;
    this.width = 25;
    this.height = 20;
    this.ajustY = 23;
    this.frameX = 0;

    this.delete = false;
    this.speed = 0.5;

    this.frameAjustY = 10;
    this.frameAjustX = 10;
    this.heightSprite = 40;
    this.widthSprite = 40;

    setTimeout(() => {
      this.delete = true;
    }, 500);
  }
  update(c: CanvasRenderingContext2D, deltaTime: number) {
    super.update(c, deltaTime);
    this.drawSprite(c);
  }
  drawSprite(c) {
    if (this.attackOuwner.game.isDev) {
      c.fillStyle = this.color;
      c.fillRect(this.possition.x, this.possition.y, this.width, this.height);
    }
  }
  limitByMatrix(_: number) {}
  attackEnemyEfect(character: Nodo) {
    if (character.side === 1) {
      character.matrixX += this.backMove;
    } else {
      character.matrixX -= this.backMove;
    }
  }
}
export class BasicSword extends Attack {
  sixe = 1;
  constructor(data: any) {
    const { type = 1 } = data;

    super(data as any);
    this.sixe = type;
    this.width = 30 * (1 + this.sixe);
    this.height = 20;
    this.ajustY = 23;
    this.frameX = 0;

    this.delete = false;
    this.speed = 0.5;

    this.frameAjustY = 10;
    this.frameAjustX = 10;
    this.heightSprite = 40;
    this.widthSprite = 40;

    setTimeout(() => {
      this.delete = true;
    }, 150);
  }
  update(c: CanvasRenderingContext2D, deltaTime: number) {
    super.update(c, deltaTime);
  }
  drawSprite(c) {
    if (this.attackOuwner.game.isDev) {
      c.fillStyle = this.color;
      c.fillRect(this.possition.x, this.possition.y, this.width, this.height);
    }
  }
  limitByMatrix(_: number) {
    // if (this.isToLeft === "left") {
    //   this.possition.x -= this.speed * deltaTime;
    // } else {
    //   this.possition.x += this.speed * deltaTime;
    // }
  }
  attackEnemyEfect(_: Nodo) {
    // if (character.side === 1) {
    //   character.matrixX += this.backMove;
    // } else {
    //   character.matrixX -= this.backMove;
    // }
  }
}

export class BasicMovedAttack extends Attack {
  initialPosition = { x: 0, y: 0 };
  finalPosition = { x: 140, y: 0 };
  gravity = 9.8;
  velocity = { x: 0, y: 0 };

  angle = 0;
  ballISUp = true;
  limtTime = 1500;
  timeforUp = 0;
  angleSpeed = 10;
  curve = 200;

  constructor(data: any) {
    super(data as any);
    this.possition = { x: data.possition.x - 30, y: data.possition.y };
    this.finalPosition = {
      x: this.possition.x + 210,
      y: this.possition.y - 30,
    };
    // this.sixe = sixe;
    this.width = 40;
    this.height = 40;
    this.ajustY = 23;
    this.frameX = 0;
    this.canMakeDamage = false;
    this.delete = false;
    this.speed = 0.5;
    this.maxFrame = 7;
    this.image.src = `/assects/attaks/boomb.png`;
    this.frameAjustY = 20;
    this.frameAjustX = 20;
    this.heightSprite = 64;
    this.widthSprite = 48;
    this.frameWidth = 48;
    this.frameHeight = 44;
  }
  update(c: CanvasRenderingContext2D, deltaTime: number) {
    super.update(c, deltaTime);

    if (this.possition.x < this.finalPosition.x) {
      //   if (this.ballISUp) {
      //     this.possition.y -= this.speed * deltaTime;

      //     if (this.timeforUp > this.limtTime) {
      //       this.ballISUp = false;
      //     } else {
      //       this.timeforUp += deltaTime;
      //     }
      //   } else {
      //     this.possition.y += this.speed * deltaTime;
      //   }

      this.possition.x += this.speed * deltaTime;
    }

    c.fillStyle = "#ff000f10";
    c.fillRect(
      this.possition.x - this.frameAjustX,
      this.possition.y - this.frameAjustY,
      this.frameWidth,
      this.frameHeight
    );

    // } else {
    //   // this.delete = true;
    // }
  }
  degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  drawSprite(c) {
    super.drawSprite(c);
    c.fillStyle = "#00ff0050";
    c.fillRect(this.possition.x, this.possition.y, this.width, this.height);
  }
  limitByMatrix(_: number) {
    // if (this.isToLeft === "left") {
    //   this.possition.x -= this.speed * deltaTime;
    // } else {
    //   this.possition.x += this.speed * deltaTime;
    // }
  }
  attackEnemyEfect(_: Nodo) {
    // if (character.side === 1) {
    //   character.matrixX += this.backMove;
    // } else {
    //   character.matrixX -= this.backMove;
    // }
  }
}
export class BasicGiraMove extends Attack {
  initialPosition = { x: 0, y: 0 };
  finalPosition = { x: 140, y: 0 };
  gravity = 9.8;
  velocity = { x: 0, y: 0 };

  angle = 0;
  ballISUp = true;
  limtTime = 1500;
  timeforUp = 0;
  angleSpeed = 5;
  curve = 200;

  constructor(data: any) {
    super(data as any);
    this.possition = { x: data.possition.x + 300, y: data.possition.y };
    this.finalPosition = {
      x: this.possition.x + 210,
      y: this.possition.y - 30,
    };
    // this.sixe = sixe;
    this.width = 40;
    this.height = 40;
    this.ajustY = 23;
    this.frameX = 0;
    this.canMakeDamage = false;
    this.delete = false;
    this.speed = 5;
    this.maxFrame = 7;
    this.image.src = `/assects/attaks/boomb.png`;
    this.frameAjustY = 20;
    this.frameAjustX = 20;
    this.heightSprite = 64;
    this.widthSprite = 48;
    this.frameWidth = 48;
    this.frameHeight = 44;
  }
  update(c: CanvasRenderingContext2D, deltaTime: number) {
    super.update(c, deltaTime);
    this.possition.x = 50 * Math.sin((this.angle * Math.PI) / 280) + 150;
    this.possition.y = 50 * Math.cos((this.angle * Math.PI) / 280) + 150;
    this.angle += this.angleSpeed;
    // if (this.possition.x < this.finalPosition.x) {
    //   //   if (this.ballISUp) {
    //   //     this.possition.y -= this.speed * deltaTime;

    //   //     if (this.timeforUp > this.limtTime) {
    //   //       this.ballISUp = false;
    //   //     } else {
    //   //       this.timeforUp += deltaTime;
    //   //     }
    //   //   } else {
    //   //     this.possition.y += this.speed * deltaTime;
    //   //   }

    //   this.possition.x += this.speed * deltaTime;
    // }

    c.fillStyle = "#ff000f10";
    c.fillRect(
      this.possition.x - this.frameAjustX,
      this.possition.y - this.frameAjustY,
      this.frameWidth,
      this.frameHeight
    );

    // } else {
    //   // this.delete = true;
    // }
  }
  degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }
  calculateMatrix(): void {}

  drawSprite(c) {
    super.drawSprite(c);
    c.fillStyle = "#00ff0050";
    c.fillRect(this.possition.x, this.possition.y, this.width, this.height);
  }

  attackEnemyEfect(_: Nodo) {
    // if (character.side === 1) {
    //   character.matrixX += this.backMove;
    // } else {
    //   character.matrixX -= this.backMove;
    // }
  }
  limitByMatrix(_: number) {}
}

export class BasicBomb extends Attack {
  initialPosition = { x: 0, y: 0 };
  finalPosition = { x: 140, y: 0 };
  gravity = 9.8;
  velocity = { x: 0, y: 0 };

  angle = 0;
  ballISUp = true;
  limtTime = 1500;
  timeforUp = 0;
  angleSpeed = 0.5;
  curve = 200;
  time = 3;
  isExplode = false;
  isCollition = false;
  currentTarget = null;

  constructor(data: any) {
    super(data as any);
    this.possition = { x: data.possition.x, y: data.possition.y };
    this.finalPosition = {
      x:
        this.attackOuwner.side == 0
          ? this.possition.x + 200
          : this.possition.x - 200,
      y:
        this.attackOuwner.side == 0
          ? this.possition.y - 30
          : this.possition.y - 30,
    };
    this.initialPosition = { x: this.possition.x, y: this.possition.y };
    if (this.attackOuwner instanceof BeeTank) {
      this.finalPosition = {
        x:
          this.attackOuwner.side == 0
            ? this.possition.x + 200
            : this.attackOuwner.enemyTarget.possition.x,
        y:
          this.attackOuwner.side == 0
            ? this.possition.y - 30
            : this.attackOuwner.enemyTarget.possition.y - 30,
      };
    }

    this.width = 30;
    this.height = 30;
    this.ajustY = 23;
    this.frameX = 0;
    this.canMakeDamage = false;
    this.delete = false;
    this.speed = 2.2;
    this.maxFrame = 7;
    this.image.src = `/assects/attaks/boomb.png`;
    this.frameAjustY = 10;
    this.frameAjustX = 20;
    this.heightSprite = 30;
    this.widthSprite = 30;
    this.frameWidth = 48;
    this.frameHeight = 44;
  }
  update(c: CanvasRenderingContext2D, deltaTime: number) {
    super.update(c, deltaTime);
    if (this.explosion != null) {
      this.explosion.draw(c, deltaTime);

      if (this.explosion.isFinished && !this.isCollition) {
        this.delete = true;
      }
    }
    const initialVelocityY = 10; // Ajusta la velocidad inicial en Y
    const gravity = 0.5; // Gravedad (puedes modificarla para un efecto más realista)

    if (this.attackOuwner.side == 0) {
      if (this.possition.x <= this.finalPosition.x) {
        // Movimiento horizontal (en el eje X)
        this.possition.x += this.speed;
        this.possition.y =
          this.initialPosition.y -
          (initialVelocityY * this.time -
            0.45 * gravity * this.time * this.time);

        // Aumentamos el tiempo para simular el paso de los segundos
        this.time += this.speed / 5; // Puedes ajustar el incremento de tiempo
      } else {
        // Cuando la pelota llega a la posición final en X, se ajusta su posición en Y
        this.possition.y = this.finalPosition.y + 20;
        if (this.explosion == null) {
          this.explosion = new ExplotionsBombs({
            possition: { x: this.possition.x + 30, y: this.possition.y + 10 },
            sideToPlay: this.sideToPlay,
            game: this.game,
          });
        }
      }
    } else {
      // 208  278  348
      //13  83  153

      const trajectoryData = {
        208: {
          153: { gravityFactor: 1.3 },
          83: { gravityFactor: 0.75 },
          13: { gravityFactor: 0.45 },
        },
        278: {
          153: { gravityFactor: 0.9 },
          83: { gravityFactor: 0.45 },
          13: { gravityFactor: 0.35 },
        },
        348: {
          153: { gravityFactor: 0.45 },
          83: { gravityFactor: 0.35 },
          13: { gravityFactor: 0.3 },
        },
      };
      try {
        if (this.possition.x >= this.finalPosition.x) {
          this.possition.x -= this.speed;
          this.possition.y =
            this.initialPosition.y -
            (initialVelocityY * this.time -
              trajectoryData[this.initialPosition.x][this.finalPosition.x]
                .gravityFactor *
                gravity *
                this.time *
                this.time);
          this.time += this.speed / 5;
        } else {
          this.possition.y = this.finalPosition.y + 20;
          if (this.explosion == null) {
            this.explosion = {
              draw(_: CanvasRenderingContext2D, __: number) {},
            };
            if (this.attackOuwner instanceof BeeTank) {
              this.attackOuwner.addMultiAttack(
                this.possition.x + 30,
                this.possition.y + 10
              );
            }
          }
        }
      } catch (error) {}
    }
  }

  calculateMatrix(): void {}

  drawSprite(c) {
    if (this.explosion == null) {
      super.drawSprite(c);
    }
  }
  attackCollision(character: Nodo) {
    if (this.explosion != null) {
      if (this.initialMatrixY == character.matrixY) this.isCollition = true;

      setTimeout(() => {
        this.delete = true;
      }, 1000);
    } else {
      if (!this.canMakeDamage) this.canMakeDamage = true;
    }
  }

  attackEnemyEfect(_: Nodo) {}
  limitByMatrix(_: number) {}
}

export class MegamanAttackBasic extends Attack {
  static type = {
    GROUNDMASH: 1,
    CANNONCHIP: 2,
    CHARGE: 4,
    MAX_CHARGE: 3,
  };
  static addType = "type";
  constructor(data: any) {
    const { type = 2 } = data;
    super(data as any);

    this.width = 25;
    this.height = 20;
    this.ajustY = 23;
    this.frameX = 0;
    this.isVisible = false;
    this.delete = false;
    this.speed = 0.5;
    this.image.src = `/assects/megaman/megamanAttacks.png`;
    this.frameAjustY = 74;
    this.frameAjustX = 32;
    this.frameY = type;
    this.frameWidth = 104;
    this.frameHeight = 108;
    this.heightSprite = 104;
    this.widthSprite = 108;
  }
  draw(c: CanvasRenderingContext2D, deltaTime: number): void {
    if (this.isVisible) {
      this.updateframe(deltaTime);
      this.drawSprite(c);
      if (this.frameX >= this.maxFrame) this.delete = true;
    }
  }
  update(c: CanvasRenderingContext2D, deltaTime: number) {
    if (!this.isVisible) super.update(c, deltaTime);
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
  limitByMatrix(deltaTime: number) {
    if (this.isToLeft === "left") {
      this.possition.x -= this.speed * deltaTime;
    } else {
      this.possition.x += this.speed * deltaTime;
    }
  }
  attackCollision(_: Nodo) {
    if (!this.isVisible) {
      this.isVisible = true;
    }
  }
  // attackCollision(_: Nodo) {
  //   this.delete = true;
  // }
}

export class MegamanAttackDash extends Attack {
  constructor(data: any) {
    // const newPossition = { x: data.possition.x - 30, y: data.possition.y };

    super(data as any);
    // this.possition = { x: newPossition.x, y: newPossition.y };
    this.image.src = `/assects/megaman/megamanAttacks.png`;
    this.frameY = 0;
    this.maxFrame = 0;
    this.frameAjustY = 104;
    this.frameAjustX = 62;
    this.frameWidth = 104;
    this.frameHeight = 108;
    this.heightSprite = 180;
    this.widthSprite = 180;

    this.frameY = 0;
    this.speed = 0.28;

    this.attackOuwner.isVisible = false;
  }
  draw(c: CanvasRenderingContext2D, deltaTime: number): void {
    if (this.isVisible) {
      this.updateframe(deltaTime);
      this.drawSprite(c);
    } else {
      if (this.explosion != null) {
        this.explosion.draw(c, deltaTime);
        if (this.explosion.isFinished) {
          this.delete = true;
        }
      }
    }
  }

  update(c: CanvasRenderingContext2D, deltaTime: number) {
    super.update(c, deltaTime);
    if (this.possition.x > 430 || this.possition.x < -30) {
      this.attackOuwner.isVisible = true;
      // this.delete = true;
    }
  }
  attackCollision(character: Nodo) {
    if (!this.attackOuwner.isVisible) {
      if (this.attackOuwner instanceof Player) {
        this.attackOuwner.changeState(this.attackOuwner.states.idle);
      }

      this.attackOuwner.isVisible = true;
      this.isVisible = false;

      character.addAttack({
        typeElemetns: DashShoot,
        damage: 1,
      });

      if (this.explosion == null) {
        this.explosion = new ExplotionsBombs({
          possition: {
            x: this.possition.x + 50,
            y: this.possition.y,
          },
          sideToPlay: this.sideToPlay,
          game: this.game,
        });
      }
    }
  }
}
export class MegamanAttackDashShoot extends Attack {
  constructor(data: any) {
    super(data as any);
    // this.possition = { x: data.possition.x - 30, y: data.possition.y };
    this.image.src = `/assects/megaman/megamanAttacks.png`;
    this.frameY = 5;
    this.maxFrame = 8;
    this.frameAjustY = 104;
    this.frameAjustX = 32;
    this.frameWidth = 104;
    this.frameHeight = 108;
    this.heightSprite = 180;
    this.widthSprite = 180;

    // this.isVisible = true;
    this.speed = 0.2;
  }
  // draw(c: CanvasRenderingContext2D, deltaTime: number): void {
  //   // if (this.isVisible) {
  //   this.updateframe(deltaTime);
  //   this.drawSprite(c);

  //   // } else {
  //   //   if (this.explosion != null) {
  //   //     this.explosion.draw(c, deltaTime);
  //   //     if (this.explosion.isFinished) {
  //   //       this.delete = true;
  //   //     }
  //   //   }
  //   // }
  // }

  update(c: CanvasRenderingContext2D, deltaTime: number) {
    super.update(c, deltaTime);
    if (this.possition.x > 430 || this.possition.x < -30) {
      this.attackOuwner.isVisible = true;
      // this.delete = true;
    }
  }
  attackCollision(_: Nodo) {
    // if (!this.attackOuwner.isVisible) {
    //   this.attackOuwner.isVisible = true;
    //   this.isVisible = false;
    //   if (this.explosion == null) {
    //     this.explosion = new ExplotionsBombs({
    //       possition: {
    //         x: this.possition.x + 50,
    //         y: this.possition.y,
    //       },
    //       sideToPlay: this.sideToPlay,
    //       game: this.game,
    //     });
    //   }
    // }
  }
}
