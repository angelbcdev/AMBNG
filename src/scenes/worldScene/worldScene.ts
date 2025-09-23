import SceneRoot from "../sceneROOT";
import { GameIso } from "./sources/gameiso";

const isoWorld = new GameIso();

export class WorldScene extends SceneRoot {
  nameScene = "world";
  constructor() {
    super();
    // this.gameWorld = new GameWorld();
  }
  update(deltaTime: number, _: CanvasRenderingContext2D) {
    isoWorld.update(deltaTime);
  }
  draw(deltaTime: number, c: CanvasRenderingContext2D, _: HTMLCanvasElement) {
    isoWorld.drawBackground(c, deltaTime);
    c.save();
    c.scale(3, 3);
    c.translate(-50, 0);
    isoWorld.draw(c);
    c.restore();
    isoWorld.drawUI(c, deltaTime);
  }
  in() {
    super.in();
    isoWorld.in();
  }
  out() {
    super.out();
    isoWorld.out();
  }
}
