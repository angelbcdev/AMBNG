import Enemy from "./enemys";

export class StaticEnemy extends Enemy {
  constructor({ possition, sideToPlay }) {
    super({ possition, sideToPlay });
    this.image.src = `../../assects/enemy/cannon.png`;
    this.frameWidth = 179;
    this.frameHeight = 181;

    this.timeFinalAnimationAttack = 300;
    this.damage = 10;
    this.liveTotal = 100;
    this.live = 100;
    this.frameAjustY = 52;
    this.frameAjustX = 50;
    this.possitionShowLiveY = -48;
    this.blockSize = {
      w: 100,
      h: 110,
    };

    this.states = {
      shoot: 0,
      open: 1,
      close: 2,
      idle: 3,
      hit: 3,
      death: 99,
      move: 98,
    };
    this.timeForShoot = 4000;
    this.frameY = this.states.idle;
  }
}
