import { keyBindings } from "@/config/keyBindings";
import { GAME } from "../sceneManager";
import { ButtonManager } from "@/UI/Button/buttonManager ";
import { BackGround } from "@/UI/backGround/backGroundShow";
import SceneRoot from "../sceneROOT";
import {
  INPUT_MANAGER,
  InputState,
  inputStateKeys,
} from "@/input/inputManager";

export class OptionScene extends SceneRoot {
  nameScene: InputState = inputStateKeys.OPTION_SCENE;
  optionsButtons = new ButtonManager([
    {
      position: { x: 50, y: 150 },
      title: "Single shoot / select chips   " + keyBindings.pressB,
      action: () => this.rebindKey("pressB"),
    },
    {
      position: { x: 50, y: 190 },
      title: "Use chips / cancel chip    " + keyBindings.pressA,
      action: () => this.rebindKey("pressA"),
    },
    {
      position: { x: 50, y: 230 },
      title:
        "Open chips menu    " +
        (keyBindings.pressSelect === " " ? "Space" : keyBindings.pressSelect),
      action: () => this.rebindKey("pressSelect"),
    },
    {
      position: { x: 250, y: 360 },
      title: "Back Home",
      action: () => GAME.changeScene(GAME.statesKeys.home),
    },
  ]);

  bg = new BackGround(0);

  constructor() {
    super();

    INPUT_MANAGER.addState(this.nameScene, {
      onKeyDown: (e: KeyboardEvent) => {
        this.optionsButtons.keyDown(e);
        switch (e.key) {
          case "9":
            GAME.changeScene(GAME.statesKeys.home);
            break;
          case "8":
            GAME.changeScene(GAME.statesKeys.world);
            break;
          case "7":
            GAME.changeScene(GAME.statesKeys.chips);
            break;
        }
      },
      // onKeyUp
    });
  }

  // ✅ function to start key rebinding
  rebindKey(actionName: keyof typeof keyBindings) {
    console.log(`Press a new key for ${actionName}...`);

    const listener = (e: KeyboardEvent) => {
      const forbidden = ["arrowup", "arrowdown", "arrowleft", "arrowright"];
      const newKey = e.key.toLowerCase();

      // 🚫 Block arrow keys
      if (forbidden.includes(newKey)) {
        alert("Arrow keys cannot be used for controls.");
        window.removeEventListener("keydown", listener);
        return;
      }

      // 🚫 Prevent duplicate assignments
      const alreadyUsed = Object.entries(keyBindings).find(
        ([action, key]) => key === newKey && action !== actionName
      );
      if (alreadyUsed) {
        alert(`That key is already assigned to "${alreadyUsed[0]}".`);
        window.removeEventListener("keydown", listener);
        return;
      }

      // ✅ Set the new binding
      keyBindings[actionName] = newKey;
      console.log(`${actionName} set to ${newKey}`);

      window.removeEventListener("keydown", listener);
      this.refreshButtonLabels();
    };

    window.addEventListener("keydown", listener);
  }

  // ✅ refresh button labels after rebinding
  refreshButtonLabels() {
    this.optionsButtons.buttons[0].title =
      "Single shoot / select chips   " + keyBindings.pressB;
    this.optionsButtons.buttons[1].title =
      "Use chips / cancel chip    " + keyBindings.pressA;
    this.optionsButtons.buttons[2].title =
      "Open chips menu    " +
      (keyBindings.pressSelect === " " ? "Space" : keyBindings.pressSelect);
  }

  in() {}
  out() {}
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
}
