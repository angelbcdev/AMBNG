import Player from "./player";

class PlayerRed extends Player {
  constructor({ possition, sideToPlay }) {
    super({ possition, sideToPlay });
    this.color = "#ff0000";
    this.side = 1;
    this.faceToLeft = sideToPlay ? true : false;
    this.sideToPlay = !sideToPlay ? 0 : 1;
    this.matrixX = !sideToPlay ? possition.x : possition.x + 3;
  }
  drawFilter(c: CanvasRenderingContext2D) {
    c.filter = "hue-rotate(110deg) sepia(0%)";
  }
}
export default PlayerRed;
