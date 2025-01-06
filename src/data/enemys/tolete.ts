import Enemy from "./enemys";

export class ToleteEnemy extends Enemy {
  speedFall: number;
  constructor({ possition, sideToPlay }) {
    super({ possition, sideToPlay });
    this.image.src = `assects/enemy/tolete.png`;
    this.frameWidth = 179;
    this.frameHeight = 181;

    this.timeFinalAnimationAttack = 300;
    this.damage = 10;
    this.liveTotal = 100;
    this.live = 1000;
    this.maxFrame = 0;
    this.frameAjustX = 0;
    this.frameAjustY = 290;

    this.speedFall = 5.5;
    this.frameAjustX = 20;

    this.states = {
      idle: 0,
      attack: 1,
      hit: 2,
    };
    this.timeForShoot = 4000;
    this.frameY = this.states.idle;
    this.possitionShowLiveY = 0;
    this.blockSize = {
      h: 120,
      w: 80,
    };
  }
  update(c: CanvasRenderingContext2D): void {
    super.update(c, 16.666);
    this.toleteMove();
  }
  toleteMove() {
    if (this.frameAjustY > 80) {
      // Reducimos el valor de frameAjustY sin dejar que baje de 60
      this.frameAjustY = Math.max(this.frameAjustY - this.speedFall, 60);

      // Movemos frameAjustX de forma diagonal

      // Llamamos a la función changeFloorSignal con el parámetro true
      this.changeFloorSignal(true);
    } else {
      // Si frameAjustY es 60 o menor, dejamos de hacer cambios
      this.changeFloorSignal(false);
    }
  }
  draw(c: CanvasRenderingContext2D, deltaTime: number) {
    super.draw(c, deltaTime);
  }
  collisionArea(player) {
    if (this.side === player.side) {
      return;
    }

    if (
      player.possition.x < this.possitionXAreaRango + this.widthAreaRango &&
      player.possition.x + player.width > this.possitionXAreaRango &&
      player.possition.y < this.possition.y + this.heightAreaRango &&
      player.possition.y + player.height > this.possition.y
    ) {
      // this.changeLocation();
    }
  }
  changeLocation() {
    this.changeFloorSignal(false);
    let newMatrixX, newMatrixY;
    do {
      newMatrixX = Math.floor(Math.random() * this.game.matrix[0].length);
      newMatrixY = Math.floor(Math.random() * this.game.matrix.length);
    } while (
      this.game.matrix[newMatrixY][newMatrixX].ocupated || // Verifica que no esté ocupada
      this.game.matrix[newMatrixY][newMatrixX].side !== 1 // Verifica que side sea 0 o 1
    );

    this.matrixY = newMatrixY;
    this.matrixX = newMatrixX;
    this.frameAjustY = 290;

    // this.changeFloorSignal(true);
  }
  changeFloorSignal(_: boolean) {
    // if (this.game.floor.length > 0) {
    //   const floor = this.game.floor.find(
    //     (item) => item.matrixY === this.matrixY && item.matrixX === this.matrixX
    //   );
    //   if (floor) {
    //     this.game.matrix[floor.matrixY][floor.matrixX].ocupated = change;
    //     floor.isAttack = change;
    //   }
    // }
  }
}
