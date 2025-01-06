import Attack from "./attacks";

export class DashShoot extends Attack {
  isPlayer: boolean;
  firstPlace = true;
  constructor(data: any) {
    super(data as any);
    const {
      possition: { x, y },
      faceToLeft,
      color,

      isPlayer,
    } = data;
    this.faceToLeft = isPlayer ? isPlayer : faceToLeft;
    this.color = color + "30";
    this.width = 50;
    this.height = 40;
    this.ajustY = 6;
    this.frameX = 0;
    this.maxFrame = 6;
    this.frameWidth = 35;
    this.frameHeight = 42;
    this.frameInterval = 3000 / 10;

    this.isPlayer = isPlayer;
    this.isToLeft = data.sideToPlay ? "left" : "right";

    this.possition = {
      x: this.isToLeft === "left" ? (x / 70) * 70 : x + 55,
      y: y + 5,
    };
    this.delete = false;
    this.speed = 0.15;
    this.image.src = `../../assects/attaks/dashShoot2.png`;
    this.drawxStings = {
      xl: 50,
      rl: 40,
      ll: -16,
    };
  }

  attackFloorEfect(matrixX: number, __: number) {
    if (!this.isPlayer) {
      return;
    }
    if (this.firstPlace) {
      this.firstPlace = false;
      return;
    }
    this.game.breackFloor(matrixX, this.initialMatrixY); //(matrixX, matrixY);
  }
}
