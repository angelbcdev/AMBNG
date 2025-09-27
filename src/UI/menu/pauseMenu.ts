import { GAME } from "@/scenes/sceneManager";
import { ButtonManager } from "../Button/buttonManager ";
import { INPUT_MANAGER, inputStateKeys } from "@/input/inputManager";
import {
  GAME_IS_DEV,
  GAME_SET_PAUSE,
  GAME_SET_UNPAUSE,
  GAME_TOGGLE_DEV,
} from "@/core/gameState";
import { keyBindings } from "@/config/keyBindings";
import { ASSET_MANAGER } from "@/core/assetManager";
import { ASSET_SOURCES } from "@/core/assetSources";

const resolveUI = (key: string): HTMLImageElement => {
  if (ASSET_MANAGER.has(key)) return ASSET_MANAGER.get(key);
  const def = (ASSET_SOURCES.ui || []).find((d) => d.key === key);
  const img = new Image();
  if (def) img.src = def.url;
  return img;
};

export class PauseMenu {
  nameScene = inputStateKeys.WORLD_PAUSE;
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
    {
      position: { x: 40, y: 70 },
      title: `dev `,
      action: () => GAME_TOGGLE_DEV(),
    },
  ]);

  constructor() {
    this.menuImage = resolveUI("ui:pauseMenu");
    this.moneyImage = resolveUI("ui:moneyWindow");
    this.setInputManager();
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
    ctx.font = "12px 'Mega-Man-Battle-Network-Regular'"; // Nombre que has definido en @font-face
    ctx.fillStyle = "#fff";
    ctx.fillText(` ${GAME_IS_DEV() ? "on" : "off"}`, 110, 95);
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
  checkKey = () => {};
  in() {
    this.showMenu = true;
    INPUT_MANAGER.setState(this.nameScene);
    GAME_SET_PAUSE();
  }
  out() {
    this.showMenu = false;
    GAME_SET_UNPAUSE();
    // this.optionsButtons.out();
    // document.removeEventListener("keydown", this.checkKey);
  }
  checkClick(mouseX: number, mouseY: number) {
    this.optionsButtons.checkClick(mouseX, mouseY);
  }
  setInputManager() {
    INPUT_MANAGER.addState(this.nameScene, {
      onKeyDown: (e: KeyboardEvent) => {
        this.optionsButtons.keyDown(e);
        const options = {
          [keyBindings.openPauseMenu]: () => {
            this.out();

            INPUT_MANAGER.setState(inputStateKeys.WORLD_SCENE);
          },
          [keyBindings.useChip || keyBindings.singleShoot]: () => {
            this.out();
            INPUT_MANAGER.setState(inputStateKeys.WORLD_SCENE);
          },
        };

        if (options[e.key.toLowerCase()]) {
          options[e.key.toLowerCase()]();
        }
      },
      onKeyUp: () => {},
    });
  }
}
