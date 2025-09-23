import { GAME } from "@/scenes/sceneManager";
import { ButtonManager } from "../Button/buttonManager ";

export class PauseMenu {
  menuImage = new Image();
  moneyImage = new Image();
  menulimitWidth = 180;
  menuImageX = -180;

  menuImageWidth = 544;
  menuImageHeight = 862;

  moneyImageX = 430;

  moneyImageWidth = 375;
  moneylimitWidth = 120;
  moneyImageHeight = 172;
  showMenu = false;
  speed = 1;
  optionsButtons = new ButtonManager([
    {
      position: { x: 40, y: 40 },
      title: "Folder",
      action: () => GAME.changeScene(GAME.statesKeys.chips),
    },
  ]);

  constructor() {
    this.menuImage.src = "/assects/chipsMenu/menuWindos.png";
    this.moneyImage.src = "/assects/chipsMenu/moneywindos.png";
  }
  draw(ctx: CanvasRenderingContext2D, deltaTime: number) {
    this.swapMenu(deltaTime);

    ctx.save();
    ctx.translate(this.menuImageX, 0);

    ctx.drawImage(
      this.menuImage,
      0,
      0,
      this.menuImageWidth,
      this.menuImageHeight,
      0,
      0,
      this.menulimitWidth,
      430
    );
    this.optionsButtons.draw(ctx);

    ctx.restore();
    ctx.save();
    ctx.translate(this.moneyImageX, 0);
    ctx.drawImage(
      this.moneyImage,
      0,
      0,
      this.moneyImageWidth,
      this.moneyImageHeight,
      0,
      0,
      this.moneylimitWidth,
      50
    );
    ctx.restore();
  }
  swapMenu(deltaTime: number) {
    if (this.showMenu) {
      this.menuImageX += deltaTime * this.speed;
      if (this.menuImageX >= 0) {
        this.menuImageX = 0;
      }
      this.moneyImageX -= deltaTime * this.speed;
      if (this.moneyImageX <= 430 - 120) {
        this.moneyImageX = 430 - 120;
      }
    } else {
      this.menuImageX -= deltaTime * this.speed;
      if (this.menuImageX <= -180) {
        this.menuImageX = -180;
      }
      this.moneyImageX += deltaTime * this.speed;
      if (this.moneyImageX >= 430) {
        this.moneyImageX = 430;
      }
    }
  }
  checkKey = (e: KeyboardEvent) => {
    this.optionsButtons.keyDown(e);
  };
  in() {
    this.optionsButtons.in();
    document.addEventListener("keydown", this.checkKey);
  }
  out() {
    this.optionsButtons.out();
    document.removeEventListener("keydown", this.checkKey);
  }
}
