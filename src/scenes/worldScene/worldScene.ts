import SceneRoot from "../sceneROOT";
import { GameWorld } from "./sources/gameWorld";

export class WorldScene extends SceneRoot {
  bg = null;
  gameWorld: GameWorld;
  nameScene = "world";
  constructor() {
    super();
    this.gameWorld = new GameWorld();
  }
  draw(deltaTime: number, c: CanvasRenderingContext2D, _: HTMLCanvasElement) {
    this.gameWorld.draw(deltaTime, c);
  }
}
