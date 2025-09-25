import { INPUT_MANAGER } from "@/input/inputManager";
import SceneRoot from "../sceneROOT";
import { GameIso } from "./sources/gameiso";

export class WorldScene extends SceneRoot {
  isoWorld = new GameIso();
  nameScene = "world_scene";
  constructor() {
    super();
    INPUT_MANAGER.addState(this.nameScene, {
      onKeyDown: (e: KeyboardEvent) => {
        this.isoWorld.checkKeyDown(e);
      },
      onKeyUp: (e: KeyboardEvent) => {
        this.isoWorld.checkKeyUp(e);
      },
    });
  }
  update(deltaTime: number, _: CanvasRenderingContext2D) {
    this.isoWorld.update(deltaTime);
  }
  draw(deltaTime: number, c: CanvasRenderingContext2D, _: HTMLCanvasElement) {
    this.isoWorld.drawBackground(c, deltaTime);
    c.save();
    c.scale(3, 3);
    c.translate(-50, 0);
    this.isoWorld.draw(c);
    c.restore();
    this.isoWorld.drawUI(c, deltaTime);
  }
  in() {
    super.in();
    // isoWorld.in();
  }
  out() {
    super.out();
    // isoWorld.out();
  }
}
