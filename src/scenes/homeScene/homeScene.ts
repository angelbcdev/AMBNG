import { BackGround } from "@/newUI/backGround/backGroundShow";
import { GAME } from "../sceneManager";
import SceneRoot from "../sceneROOT";
import { ButtonManager } from "@/newUI/Button/buttonManager ";

export class HomeScene extends SceneRoot {
  bg = new BackGround(0);
  nameScene = "home";
  optionsButtons = new ButtonManager([
    {
      position: { x: 50, y: 150 },
      title: "Play",
      action: () => GAME.changeScene(GAME.statesKeys.world),
    },
    {
      position: { x: 50, y: 210 },
      title: "Options",
      action: () => GAME.changeScene(GAME.statesKeys.option),
    },
    {
      position: { x: 50, y: 270 },
      title: "Chips",
      action: () => GAME.changeScene(GAME.statesKeys.chips),
    },
  ]);

  constructor() {
    super();
  }
  homeKey(e: KeyboardEvent) {
    switch (e.key) {
      case "1":
        GAME.changeScene(GAME.statesKeys.world);
        break;
      case "2":
        GAME.changeScene(GAME.statesKeys.option);
        break;
      case "3":
        GAME.changeScene(GAME.statesKeys.chips);
        break;
    }
  }
  draw(
    deltaTime: number,
    c: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    super.draw(deltaTime, c, canvas);
    this.optionsButtons.draw(c);
  }
  checkClick(mouseX: number, mouseY: number) {
    this.optionsButtons.checkClick(mouseX, mouseY);
  }
  checkKey(e: KeyboardEvent) {
    this.optionsButtons.keyDown(e);
  }

  in() {
    console.log("HomeScene in");
    this.optionsButtons.in();
    document.addEventListener("keydown", this.homeKey);
  }
  out() {
    console.log("HomeScene out");
    this.optionsButtons.out();
    document.removeEventListener("keydown", this.homeKey);
  }
}
