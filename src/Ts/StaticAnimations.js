class StaticAnimations {
  constructor({ possition, sideToPlay, color, isDev }) {
    this.possition = {
      x: possition.x,
      y: possition.y - 2,
    };
    this.isDev = isDev;
    this.sideToPlay = sideToPlay;
    this.color = color;
    this.frameX = 0;
    this.frameY = 0;

    this.faceToLeft = sideToPlay;
    this.frameTime = 1000 / 60;
    this.frameInterval = 100;
    this.maxFrame = 3;
    this.incialFrameX = 0;
    this.incialFrameY = 0;
    this.ajustY = 0;
    this.image = new Image();
  }

  update(c, deltaTime = 16.66) {
    // Animación del sprite
    if (this.frameTime > this.frameInterval) {
      this.frameTime = 0;
      this.frameX =
        this.frameX < this.maxFrame ? this.frameX + 1 : this.incialFrameX;
    } else {
      this.frameTime += deltaTime;
    }
    if (this.isDev) {
      c.fillStyle = this.color + "90";
      c.fillRect(
        this.sideToPlay ? this.possition.x - 25 : this.possition.x + 65,
        this.possition.y,
        20,
        16
      );
    }

    this.drawSprite(c);
  }

  draw(c) {}

  drawSprite(c) {
    c.save(); // Guardar el estado actual del contexto

    // Invertir el eje X si `faceToLeft` es verdadero
    c.scale(this.faceToLeft ? -1 : 1, 1);

    // Ajustar la posición en X para que la imagen se pinte correctamente
    const drawX = this.faceToLeft
      ? -this.possition.x
      : this.sideToPlay
      ? this.possition.x - 25
      : this.possition.x + 65;

    c.drawImage(
      this.image,
      this.frameX * this.frameWidth,
      this.frameY * this.frameHeight,
      this.frameWidth,
      this.frameHeight,

      drawX,
      this.possition.y - this.ajustY,
      this.blockSize.w,
      this.blockSize.h
    );

    c.restore();
  }
}

export class BasicShoot extends StaticAnimations {
  constructor({ possition, sideToPlay, color, isDev }) {
    super({ possition, sideToPlay, color, isDev });
    this.frameWidth = 190;
    this.frameHeight = 169;

    this.ajustY = 100;
    this.blockSize = {
      h: 30,
      w: 33,
    };
    this.image.src = `assects/basicShoot.png`;
  }
}

export class ExplotionsEffect extends StaticAnimations {
  constructor({ possition, sideToPlay, color, isDev }) {
    super({ possition, sideToPlay, color, isDev });
    this.frameWidth = 180;
    this.frameHeight = 180;
    this.maxFrame = 6;
    this.blockSize = {
      h: 100,
      w: 100,
    };
    this.image.src = `../../assects/attaks/explotion1.png`;
    this.possitionYLimit = this.possition.y - 10;
    this.possitionYstart = this.possition.y;
  }
  update(_, __) {}
  draw(c, deltaTime) {
    // Animación del sprite
    if (this.frameTime > this.frameInterval) {
      this.frameTime = 0;
      this.frameX =
        this.frameX < this.maxFrame ? this.frameX + 1 : this.incialFrameX;
    } else {
      this.frameTime += deltaTime;
    }
    if (this.isDev) {
      c.fillStyle = this.color + "90";
      c.fillRect(
        this.sideToPlay ? this.possition.x - 25 : this.possition.x + 65,
        this.possition.y,
        20,
        16
      );
    }

    this.drawSprite(c);
  }
  drawSprite(c, deltaTime = 16.66) {
    c.save(); // Guardar el estado actual del contexto

    // Invertir el eje X si `faceToLeft` es verdadero
    c.scale(this.faceToLeft ? -1 : 1, 1);

    // Ajustar la posición en X para que la imagen se pinte correctamente
    const drawX = this.faceToLeft
      ? -this.possition.x
      : this.sideToPlay
      ? this.possition.x - 35
      : this.possition.x + 55;

    this.createExplotion({ c, drawX, changex: -10, changey: 0 });
    this.createExplotion({ c, drawX, changex: -15, changey: -10 });
    this.createExplotion({ c, drawX, changex: -25, changey: 10 });

    c.restore();
  }
  createExplotion({ c, drawX, changex, changey }) {
    c.drawImage(
      this.image,
      this.frameX * this.frameWidth,
      this.frameY * this.frameHeight,
      this.frameWidth,
      this.frameHeight,

      drawX + changex - 40,
      this.possition.y + changey - 40,
      this.blockSize.w,
      this.blockSize.h
    );
  }
}

export class ExplotionsBombs extends StaticAnimations {
  animationToDelete = 30;
  currentAnimation = 0;
  isFinished = false;
  constructor({ possition, sideToPlay, color, isDev }) {
    super({ possition, sideToPlay, color, isDev });

    this.image = new Image();
    this.frameWidth = 78;
    this.frameHeight = 68;
    this.frameTime = 0;
    this.incialFrameX = 0;
    this.frameX = this.incialFrameX;
    this.frameY = 0;
    this.frameInterval = 1000 / 40;
    this.maxFrame = 12;
    this.blockSize = {
      h: 50,
      w: 70,
    };
    this.image.src = `../../assects/attaks/explotionboomb.png`;
  }
  draw(c, deltaTime) {
    if (this.frameTime > this.frameInterval) {
      this.frameTime = 0;
      if (this.currentAnimation < this.animationToDelete) {
        this.currentAnimation += 1;
      } else {
        this.isFinished = true;
      }

      this.frameX =
        this.frameX < this.maxFrame ? this.frameX + 1 : this.incialFrameX;
    }
    this.frameTime += deltaTime;

    this.drawSprite(c);
  }
  update(_, __) {}
  drawSprite(c) {
    c.drawImage(
      this.image,
      this.frameX * this.frameWidth,
      this.frameY * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      this.possition.x - 36,
      this.possition.y - 10,
      this.blockSize.w,
      this.blockSize.h
    );
  }
}
