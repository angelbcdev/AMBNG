import { keyBindings } from "@/config/keyBindings";
import { GAME } from "../sceneManager";
import { ButtonManager } from "@/newUI/Button/buttonManager ";
import { BackGround } from "@/newUI/backGround/backGroundShow";
import SceneRoot from "../sceneROOT";

export class OptionScene extends SceneRoot {
  nameScene = "option";
  optionsButtons = new ButtonManager([
    {
      position: { x: 50, y: 150 },
      title: "Single shoot / select chips   " + keyBindings.singleShoot,
      action: () => this.rebindKey("singleShoot"),
    },
    {
      position: { x: 50, y: 190 },
      title: "Use chips / cancel chip    " + keyBindings.useChip,
      action: () => this.rebindKey("useChip"),
    },
    {
      position: { x: 50, y: 230 },
      title:
        "Open chips menu    " +
        (keyBindings.openChipsMenu === " "
          ? "Space"
          : keyBindings.openChipsMenu),
      action: () => this.rebindKey("openChipsMenu"),
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
      "Single shoot / select chips   " + keyBindings.singleShoot;
    this.optionsButtons.buttons[1].title =
      "Use chips / cancel chip    " + keyBindings.useChip;
    this.optionsButtons.buttons[2].title =
      "Open chips menu    " +
      (keyBindings.openChipsMenu === " " ? "Space" : keyBindings.openChipsMenu);
  }

  in() {
    this.optionsButtons.in();
  }
  out() {
    this.optionsButtons.out();
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
}
