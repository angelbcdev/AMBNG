import { Nodo } from "../master.js";

class Enemy extends Nodo {
  canAttack = true;
  timeForAttack = 500;
  possitionXAreaRango = 0;

  possitionShowLiveX = 0;
  possitionShowLiveY: number;

  constructor({
    possition,
    sideToPlay,
  }: {
    possition: { x: number; y: number };
    sideToPlay: number;
  }) {
    super({
      x: possition.x,
      y: possition.y,
      sideToPlay,
    });
    this.matrixX = sideToPlay == 1 ? 5 - possition.x : possition.x;
    this.matrixY = possition.y;
    this.possition = {
      x: possition.x,
      y: possition.y - 2,
    };

    this.blockSize = {
      h: 50,
      w: 66,
    };

    this.color = this.sideToPlay == 1 ? "#ff0000" : "#0000ff";
    this.frameX = 0;
    this.frameY = 0;

    this.height = 30;
    this.maxFrame = 3;
    this.incialFrameX = 0;
    this.incialFrameY = 0;
    this.image = new Image();
    this.widthAreaRango = 410;
    this.possitionXAreaRango = 0;
    this.live = 50;
    this.liveTotal = this.live;
    this.collisionAttacks = [];
    this.detectedPlayers = [];
    this.timeOfStuns = 1200;
    this.timeFinalAnimationAttack = 3000;
    this.timeForShoot = 3000;

    this.damage = 1;
    this.timeForShoot = 2000;

    this.possitionShowLiveY = -44;
    this.possitionShowLiveX = 30;
    this.widthAreaRango = 430;
    this.heightAreaRango = 45;
  }

  update(c: CanvasRenderingContext2D, deltaTime: number) {
    super.update(c, deltaTime);
  }

  draw(c: CanvasRenderingContext2D, deltaTime: number) {
    super.draw(c, deltaTime);
    this.drawAreaView(c);

    this.paintliveEnemy({
      c,
      currentLive: this.live > 0 ? this.live : 0,
      x:
        this.live > 999
          ? this.possition.x - 18
          : this.live > 99
          ? this.possition.x + this.possitionShowLiveX + 1
          : this.possition.x + this.possitionShowLiveX + 2,
      y: this.possition.y - this.possitionShowLiveY,
    });
  }

  paintLive(_: CanvasRenderingContext2D) {}

  drawAreaView(c: CanvasRenderingContext2D) {
    if (this.game.isDev) {
      //area de rango
      c.fillStyle = this.color + "50";

      c.fillRect(this.possition.x, this.possition.y, this.width, this.height);
      c.fillStyle = "#ff9900" + "30";
      c.fillRect(
        this.possitionXAreaRango,
        this.possition.y,
        this.widthAreaRango,
        this.heightAreaRango
      );
    }
  }

  collisionArea(player) {
    if (this.side === player.sides) {
      return;
    }

    if (
      player.possition.x < this.possitionXAreaRango + this.widthAreaRango &&
      player.possition.x + player.width > this.possitionXAreaRango &&
      player.possition.y < this.possition.y + this.heightAreaRango &&
      player.possition.y + player.height > this.possition.y
    ) {
      this.onDetectedPlayer(player);
    }
  }
  acctionKeyDown(key) {
    let newMatrixY = this.matrixY;
    let newMatrixX = this.matrixX;

    const handleEvents = {
      ArrowUp: () => {
        newMatrixY -= 1;
      },
      ArrowDown: () => {
        newMatrixY += 1;
      },
      ArrowLeft: () => {
        newMatrixX -= 1;
      },

      ArrowRight: () => {
        newMatrixX += 1;
      },
    };

    if (handleEvents[key]) {
      handleEvents[key]();
    }

    try {
      if (this.game.matrix[newMatrixY][newMatrixX]?.ocupated) {
        return;
      }
    } catch (_) {}

    if (
      newMatrixY < 0 ||
      newMatrixY >= this.game.matrix.length ||
      newMatrixX < 0 ||
      newMatrixX >= this.game.matrix[0].length ||
      this.game.matrix[newMatrixY][newMatrixX].side !== this.side
    ) {
      return;
    }

    this.game.matrix[this.matrixY][this.matrixX].ocupated = false;

    this.matrixY = newMatrixY;
    this.matrixX = newMatrixX;
    setTimeout(() => {
      this.game.matrix[this.matrixY][this.matrixX].ocupated = true;
      // this.changeState(this.finiteStates.idle);
    }, 500);
  }

  onDetectedPlayer(player) {
    if (
      this.side === player.side ||
      this.delete ||
      !this.canMove ||
      this.game.gameIsPaused
    ) {
      return;
    }
    if (this.frameY == this.states.idle && this.canAttack) {
      this.frameY = this.states.shoot;
      // this.makeAttack();
    }

    // if (this.canAttack) {
    //   this.makeAttack();
    //   this.canAttack = false;
    //   setTimeout(() => {
    //     this.canAttack = true;
    //   }, this.timeForAttack);
    // }
  }

  resiveDamage(attack) {
    super.resiveDamage(attack);
  }

  makeAttack() {
    if (this.canShoot) {
      this.goingToShoot = false;
      this.canAttack = false;
      this.canShoot = false;
      setTimeout(() => {
        this.addAttack({
          typeElemetns: this.proyoectile,
          damage: this.damage,
        });

        setTimeout(() => {
          this.frameY = this.states.idle;
          setTimeout(() => {
            this.canShoot = true;
          }, this.timeForShoot);
        }, this.timeFinalAnimationAttack);
      }, 200);
      // setTimeout(() => {
      //   this.frameY = this.states.idle;
      //   setTimeout(() => {
      //     this.canShoot = true;
      //   }, this.timeForShoot);
      // }, this.timeFinalAnimationAttack);
    }
  }
  paintliveEnemy({ c, currentLive, x, y }) {
    if (!this.isVisible) {
      return;
    }
    c.font = "16px 'Mega-Man-Battle-Network-Regular'"; // Nombre que has definido en @font-face
    c.fillStyle = "#484848"; // Color del texto
    c.textAlign = "center"; // Alineación horizontal
    c.textBaseline = "middle"; // Alineación vertical

    // Escribir el texto en el lienzo
    c.fillText(` ${currentLive}`, x + 0.5, y + 0.5);
    // Nombre que has definido en @font-face
    c.fillStyle = "#fdfddf"; // Color del texto
    c.fillText(`${currentLive}`, x, y);
  }
}

export default Enemy;
