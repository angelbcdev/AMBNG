import { InputState, inputStateKeys } from "@/input/inputManager";

import { colorsCanvas, keyBindings } from "@/config/keyBindings";
import { BATTLE_MANAGER } from "@/core/battleManager";
import { INPUT_MANAGER } from "@/input/inputManager";
import { GAME } from "@/scenes/sceneManager";
import { getImageFromAssetsManager } from "@/core/assetshandler/assetHelpers";

export class CompleteScreen {
  nameScene: InputState = inputStateKeys.COMPLETE_SCREEN;
  image = new Image();
  position = { x: -410, y: 40 };
  width = 390;
  height = 272;
  isHidden = true;
  speed = 0.5;

  moneyEarn = 2000;
  showSecret = false;

  tincleTime = 0;

  timeOfBattle = "no data";
  level = "no data";

  constructor() {
    this.image = getImageFromAssetsManager("ui:completeScreen");

    INPUT_MANAGER.addState(this.nameScene, {
      onKeyDown: (e: KeyboardEvent) => {
        const opions = {
          [keyBindings.pressA]: () => {
            const interval = setTimeout(() => {
              this.hideScreen();
            }, 3000);

            //
            if (!this.showSecret) {
              this.showSecret = true;
            } else {
              this.hideScreen();
              clearInterval(interval);
            }
          },
          [keyBindings.pressB]: () => {
            //
          },
        };
        if (opions[e.key.toLowerCase()]) {
          opions[e.key.toLowerCase()]();
        }
      },
    });
  }

  draw(c: CanvasRenderingContext2D, deltaTime: number) {
    c.save();
    if (!this.isHidden) {
      this.position.x += this.speed * deltaTime;
      if (this.position.x > 20) {
        this.position.x = 20;
      }
    } else {
      this.position.x = -410;
    }

    if (!this.showSecret) {
      this.tincleTime += deltaTime;
      if (this.tincleTime >= 600) {
        this.tincleTime = 0;
      }
    }

    c.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );

    if (this.tincleTime < 300 && !this.showSecret) {
      this.showPressButon(c);
    }
    if (this.showSecret) {
      this.showMoneyEarn(c);
    }
    this.showHeaderText(c);
    c.restore();
  }

  showPressButon(c: CanvasRenderingContext2D) {
    const x = this.position.x + 4;
    const y = this.position.y + 238;
    // c.fillStyle = colorsCanvas.background;
    // c.fillRect(x, y, 162, 33);
    // c.font = "16px 'Mega-Man-Battle-Network-Regular'";
    this.paintText(
      c,
      `Press ${keyBindings.pressB} to continue`,
      x + 110,
      y + 20
    );
  }

  showHeaderText(c: CanvasRenderingContext2D) {
    const x = this.position.x + 128;
    const y = this.position.y + 66;
    const gap = 50;

    this.paintText(c, "Delta Time  ", x, y, 26);
    this.paintText(c, this.timeOfBattle, x + 160, y, 26);

    this.paintText(c, "Level   ", x - 28, y + gap, 26);
    this.paintText(c, this.level, x + 186, y + gap, 26);
  }
  showMoneyEarn(c: CanvasRenderingContext2D) {
    const x = this.position.x + 34;
    const y = this.position.y + 208;
    c.fillStyle = colorsCanvas.background;
    c.fillRect(x, y, 162, 33);
    c.fillStyle = colorsCanvas.textColor;
    c.textAlign = "left";
    c.font = `20px Arial`;
    c.fillText(` Z`, x + 10, y + 24);
    c.fillText(` ${this.moneyEarn}  `, x + 110, y + 24);
  }
  showScreen() {
    INPUT_MANAGER.setState(this.nameScene);
    this.isHidden = false;
  }
  resetOptions() {
    this.showSecret = false;
    this.tincleTime = 0;
    this.timeOfBattle = "";
    this.level = "";
  }
  hideScreen() {
    // INPUT_MANAGER.setState(inputStateKeys.WORLD_SCENE);
    GAME.changeScene(GAME.statesKeys.worldScene);
    this.resetOptions();
    BATTLE_MANAGER.outBattle();
    this.isHidden = true;
  }
  paintText(
    c: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    font = 20
  ) {
    c.fillStyle = colorsCanvas.textColor;
    c.textAlign = "center";
    c.font = `${font}px Arial`;
    c.fillText(text, x + 1, y + 1);
    c.fillStyle = colorsCanvas.background;
    c.textAlign = "center";
    c.font = `${font}px Arial`;
    c.fillText(text, x, y);
  }
}
