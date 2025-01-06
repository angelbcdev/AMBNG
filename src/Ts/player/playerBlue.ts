import Player from "./player";

class PlayerBlue extends Player {
  constructor({ possition, sideToPlay }) {
    super({ possition, sideToPlay });
    this.color = "#0000ff";
    this.side = 0;

    this.faceToLeft = this.side == 0 ? false : true;
    this.matrixX = this.side == 0 ? possition.x : possition.x + 3;
  }
}
export default PlayerBlue;
