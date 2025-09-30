import { INPUT_MANAGER, inputStateKeys } from "@/input/inputManager";
import SceneRoot from "../sceneROOT";
import { WORLD_MANAGER } from "@/core/WorldManager";
import { GAME_TOGGLE_DEV, GAME_IS_PAUSE } from "@/core/gameState";
import { BATTLE_MANAGER } from "@/core/battleManager";

export class WorldScene extends SceneRoot {
  nameScene = inputStateKeys.WORLD_SCENE;
  constructor() {
    WORLD_MANAGER.init();
    super();
    INPUT_MANAGER.addState(this.nameScene, {
      onKeyDown: (e: KeyboardEvent) => {
        WORLD_MANAGER.keyDown(e);
        const options = {
          v: () => {
            GAME_TOGGLE_DEV();
          },
        };
        if (options[e.key.toLowerCase()]) {
          options[e.key.toLowerCase()]();
        }
      },
      onKeyUp: (e: KeyboardEvent) => {
        WORLD_MANAGER.keyUp(e);
      },
    });
  }
  update(deltaTime: number, _: CanvasRenderingContext2D) {
    WORLD_MANAGER.update(deltaTime);
  }
  draw(deltaTime: number, c: CanvasRenderingContext2D, _: HTMLCanvasElement) {
    WORLD_MANAGER.drawBackground(c, deltaTime);
    c.save();
    c.scale(3, 3);
    c.translate(-50, 0);
    WORLD_MANAGER.draw(c);
    c.restore();
    WORLD_MANAGER.drawUI(c, deltaTime);
    BATTLE_MANAGER.dialogue.draw(c, deltaTime);
  }
  in() {
    if (GAME_IS_PAUSE()) {
      INPUT_MANAGER.setState(inputStateKeys.WORLD_PAUSE);
    }
    WORLD_MANAGER.in();
  }
  out() {
    super.out();
    WORLD_MANAGER.out();
  }
}
