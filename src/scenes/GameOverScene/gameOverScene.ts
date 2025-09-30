import { BackGround } from "@/UI/backGround/backGroundShow";
import { GAME } from "@/scenes/sceneManager";
import SceneRoot from "../sceneROOT";
import { ButtonManager } from "@/UI/Button/buttonManager ";
import {
  INPUT_MANAGER,
  InputState,
  inputStateKeys,
} from "@/input/inputManager";

export class GameOverScene extends SceneRoot {
  bg = new BackGround(6);
  nameScene: InputState = inputStateKeys.GAME_OVER;
  optionsButtons = new ButtonManager([
    {
      position: { x: 150, y: 250 },
      title: "Play again",
      action: () => GAME.changeScene(GAME.statesKeys.homeScene),
    },
  ]);
  logo = new Image();
  xLogo = 0;
  yLogo = 0;
  widthLogo = 0;
  heightLogo = 0;
  constructor() {
    super();
    this.logo.src = "/logo.png";
    this.xLogo = 140;
    this.yLogo = 10;
    this.widthLogo = 400;
    this.heightLogo = 300;
    // Define "menu" input logic

    INPUT_MANAGER.addState(this.nameScene, {
      onKeyDown: (e: KeyboardEvent) => {
        this.optionsButtons.keyDown(e);
        switch (e.key) {
          case "1":
            GAME.changeScene(GAME.statesKeys.homeScene);
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
    c.drawImage(
      this.logo,
      this.xLogo,
      this.yLogo,
      this.widthLogo / 3,
      this.heightLogo / 3
    );
    c.fillStyle = "white";
    c.textAlign = "center";
    c.font = "40px 'Mega-Man-Battle-Network-Regular'";
    c.fillText("Game Over", 220, 200);
    this.optionsButtons.draw(c, deltaTime);
  }
  checkClick(mouseX: number, mouseY: number) {
    this.optionsButtons.checkClick(mouseX, mouseY);
  }

  in() {}
  out() {}
}
