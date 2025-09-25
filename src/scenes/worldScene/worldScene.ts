import { INPUT_MANAGER, inputStateKeys } from "@/input/inputManager";
import SceneRoot from "../sceneROOT";
import { GameIso } from "./sources/gameiso";
import { GAME_IS_PAUSE } from "../battleScene/sources/gameState";

export class WorldScene extends SceneRoot {
  isoWorld = new GameIso();
  nameScene = inputStateKeys.WORLD_SCENE;
  constructor() {
    super();
    INPUT_MANAGER.addState(this.nameScene, {
      onKeyDown: (e: KeyboardEvent) => {
        this.isoWorld.keyDown(e);
      },
      onKeyUp: (e: KeyboardEvent) => {
        this.isoWorld.keyUp(e);
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
    if (GAME_IS_PAUSE()) {
      INPUT_MANAGER.setState(inputStateKeys.WORLD_PAUSE);
    }
    // isoWorld.in();
  }
  out() {
    super.out();
    // isoWorld.out();
  }
}
