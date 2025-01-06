import { BackGround } from "./backGround";
import PlayerBlue from "./character/player/Player";
import { FloorBase } from "./floor";
import { matrix } from "./gameData/matrix";
import { ubicateFloors } from "./gameData/ubicateFloors";

export class Game {
  floors: FloorBase[] = [];
  effect = [];
  npc = [];
  matrix = matrix;
  bg = new BackGround({ width: 430, height: 400 }, 3);
  players = [
    new PlayerBlue({
      possition: { x: 1, y: 1 },
      sideToPlay: 0,
    }),
  ];
  constructor() {
    this.floors = ubicateFloors({ array: matrix, blockSize: 64, gapX: 6.5 });
    this.initGame();
  }
  initGame() {
    [...this.npc, ...this.players].forEach((entity) => {
      entity.game = this;
    });
  }
  draw(c: CanvasRenderingContext2D, deltaTime: number) {
    this.bg.draw(c, deltaTime);
    this.drawFloors(c, deltaTime);

    this.players.forEach((player) => {
      player.draw(c, deltaTime);
    });
  }
  drawFloors(c: CanvasRenderingContext2D, deltaTime: number) {
    this.floors
      .sort((a, b) => b.y + a.y)
      .forEach((entity: FloorBase) => {
        entity.draw(c, deltaTime);
        entity.floors = this.floors;
        entity.validateAttack(this.effect);

        entity.game = this;
      });
  }
}
