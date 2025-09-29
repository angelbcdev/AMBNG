import { BackGround } from "@/UI/backGround/backGroundShow";
import { GAME } from "@/scenes/sceneManager";
import SceneRoot from "../sceneROOT";
import { ButtonManager } from "@/UI/Button/buttonManager ";
import {
  INPUT_MANAGER,
  InputState,
  inputStateKeys,
} from "@/input/inputManager";

export class HomeScene extends SceneRoot {
  bg = new BackGround(0);
  nameScene: InputState = inputStateKeys.HOME_SCENE;
  optionsButtons = new ButtonManager([
    {
      position: { x: 50, y: 150 },
      title: "Play",
      action: () => GAME.changeScene(GAME.statesKeys.worldScene),
    },
    {
      position: { x: 50, y: 210 },
      title: "Options",
      action: () => GAME.changeScene(GAME.statesKeys.optionScene),
    },
    {
      position: { x: 50, y: 270 },
      title: "Chips",
      action: () => GAME.changeScene(GAME.statesKeys.folderScene),
    },
  ]);

  constructor() {
    super();
    // Define "menu" input logic

    INPUT_MANAGER.addState(this.nameScene, {
      onKeyDown: (e: KeyboardEvent) => {
        this.optionsButtons.keyDown(e);
        switch (e.key) {
          case "1":
            GAME.changeScene(GAME.statesKeys.worldScene);
            break;
          case "2":
            GAME.changeScene(GAME.statesKeys.optionScene);
            break;
          case "3":
            GAME.changeScene(GAME.statesKeys.folderScene);
            break;
        }
      },
      // onKeyUp
    });
  }

  draw(
    deltaTime: number,
    c: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    super.draw(deltaTime, c, canvas);
    this.optionsButtons.draw(c, deltaTime);
  }
  checkClick(mouseX: number, mouseY: number) {
    this.optionsButtons.checkClick(mouseX, mouseY);
  }

  in() {}
  out() {}
}
