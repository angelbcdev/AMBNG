import { GameState } from "../core/GameState";
import { BatleGame } from "./gameBattle";
import { GameWorld } from "./gameWorld";

export const game = new BatleGame();

export const world = new GameWorld();

export class Scene {
  gameState = GameState.getInstance();
  canvas = document.getElementById("canvas") as HTMLCanvasElement;
  private static instance: Scene;
  private constructor() {
    game.scene = this;

    this.gameState.startWorld();

    document.getElementById("canvas").addEventListener("click", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      game.checkClick(x, y);
    });
  }

  static getInstance(): Scene {
    if (!Scene.instance) {
      Scene.instance = new Scene();
    }
    return Scene.instance;
  }
  draw(c: CanvasRenderingContext2D, deltaTime: number) {
    if (this.gameState.isInWorld()) {
      world.draw(c, deltaTime);
    } else {
      game.draw(c, deltaTime);
    }
  }
  update(c: CanvasRenderingContext2D, deltaTime: number) {
    if (this.gameState.isInWorld()) {
      world.update(c, deltaTime);
    } else {
      game.update(c, deltaTime);
    }
  }
  startBattle() {
    this.gameState.startBattle();
    game.startNewBattle({ backGround: 0, allEnemies: [], floorImage: 2 });
  }
  startGameOver() {
    this.gameState.setGameOver();
  }
  endBattle() {
    this.gameState.endBattle();
  }
}
