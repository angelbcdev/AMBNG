import BeeTank from "../../enemys/Character/beeTank/beetank";
import Attack from "../attacks";
import { ExplotionsBombs } from "../../extra/StaticAnimations.js";
import { Entity } from "@/entities/entity";
import { ASSET_MANAGER } from "@/core/assetManager";
import { ASSET_SOURCES } from "@/core/assetshandler/assetSources.js";

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
    {
      const key = "attack:boomb";
      if (ASSET_MANAGER.has(key)) this.image = ASSET_MANAGER.get(key);
      else {
        const def = (ASSET_SOURCES.attacks || []).find((d) => d.key === key);
        if (def) this.image.src = def.url;
      }
    }
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
            color: "red",
          });
        }
      }
    } else {
      // 208  278  348
      //13  83  153

      let enemyPosition;
      if (this.initialPosition.x > 408 || this.initialPosition.x < 388) {
        enemyPosition = "last";
      } else if (this.initialPosition.x > 268 || this.initialPosition.x < 308) {
        enemyPosition = "middle";
      } else if (this.initialPosition.x > 198 || this.initialPosition.x < 268) {
        enemyPosition = "first";
      }

      let playerPosition;
      if (this.finalPosition.x == 153) {
        playerPosition = "last";
      } else if (this.finalPosition.x == 83) {
        playerPosition = "middle";
      } else if (this.finalPosition.x == 13) {
        playerPosition = "first";
      }

      const trajectoryData = {
        first: {
          last: { gravityFactor: 1.3 },
          middle: { gravityFactor: 0.75 },
          first: { gravityFactor: 0.45 },
        },
        middle: {
          last: { gravityFactor: 0.9 },
          middle: { gravityFactor: 0.45 },
          first: { gravityFactor: 0.35 },
        },
        last: {
          last: { gravityFactor: 0.45 },
          middle: { gravityFactor: 0.35 },
          first: { gravityFactor: 0.3 },
        },
      };
      try {
        if (this.possition.x >= this.finalPosition.x) {
          this.possition.x -= this.speed;
          this.possition.y =
            this.initialPosition.y -
            (initialVelocityY * this.time -
              trajectoryData[enemyPosition][playerPosition].gravityFactor *
                gravity *
                this.time *
                this.time);
          this.time += this.speed / 5;
        } else {
          this.possition.y = this.finalPosition.y + 20;
          if (this.explosion == null) {
            this.explosion.draw = () => {};

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
  attackCollision(character: Entity) {
    if (this.explosion != null) {
      if (this.initialMatrixY == character.matrixY) this.isCollition = true;

      setTimeout(() => {
        this.delete = true;
      }, 1000);
    } else {
      if (!this.canMakeDamage) this.canMakeDamage = true;
    }
  }

  attackEnemyEfect(_: Entity) {}
  limitByMatrix(_: number) {}
}
