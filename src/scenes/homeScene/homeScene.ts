import { GAME } from "../sceneManager";
import SceneRoot from "../sceneROOT";
import { ButtonManager } from "@/newUI/Button/buttonManager ";

export class HomeScene extends SceneRoot {
  nameScene = "home";
  optionsButtons = new ButtonManager([
    {
      position: { x: 50, y: 150 },
      title: "Play",
      action: () => GAME.changeScene(GAME.scenes.world),
    },
    {
      position: { x: 50, y: 210 },
      title: "Options",
      action: () => GAME.changeScene(GAME.scenes.option),
    },
    {
      position: { x: 50, y: 270 },
      title: "Exit",
      action: () => console.log("Exit pressed!"),
    },
  ]);

  constructor() {
    super();
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
  }
  out() {
    console.log("HomeScene out");
    this.optionsButtons.out();
  }
}
