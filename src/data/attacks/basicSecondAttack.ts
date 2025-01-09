import Attack from "./attacks.js";

import { DashShoot } from "./dashShoot.js";

class BasicMovedAttack extends Attack {
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
  attackEnemyEfect(_: Entity) {
    // if (character.side === 1) {
    //   character.matrixX += this.backMove;
    // } else {
    //   character.matrixX -= this.backMove;
    // }
  }
}
class BasicGiraMove extends Attack {
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

  attackEnemyEfect(_: Entity) {
    // if (character.side === 1) {
    //   character.matrixX += this.backMove;
    // } else {
    //   character.matrixX -= this.backMove;
    // }
  }
  limitByMatrix(_: number) {}
}
