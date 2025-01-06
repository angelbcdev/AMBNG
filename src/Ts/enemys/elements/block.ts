import Attack from "../../attacks/attacks";
import Enemy from "../enemys";

export class StaticBlocks extends Enemy {
  constructor({ possition, sideToPlay }) {
    super({ possition, sideToPlay });
    this.image.src = "/assects/block.png";
    this.frameWidth = 87;
    this.frameHeight = 103;
    this.maxFrame = 5;
    this.incialFrameX = 5;
    this.frameAjustY = 62;
    this.frameAjustX = 5;
    this.states = {
      idle: 0,
      shoot: 0,
      move: 0,
      hit: 0,
      death: 0,
      open: 0,
      close: 0,
    };
    this.blockSize = {
      h: 90,
      w: 68,
    };
  }
  draw(c: CanvasRenderingContext2D, deltaTime: number): void {
    c.fillStyle = "#00000050";
    c.fillRect(this.possition.x, this.possition.y, this.width, this.height);

    super.draw(c, deltaTime);
  }
  beforeDamage(attack: Attack) {
    if (this.live <= 0) {
      return;
    }
    if (this.matrixY !== attack.initialMatrixY) {
      return;
    }

    if (attack?.attackCollision) {
      attack?.attackCollision(this);
    }
    if (!attack.canMakeDamage) {
      return;
    }

    this.resiveDamage(attack);
  }
}
