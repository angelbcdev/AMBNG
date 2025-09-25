import { BatleGame } from "./sources/gameBattle";
import SceneRoot from "../sceneROOT";
// import { BackGround } from "@/newUI/backGround/backGroundShow";
// import { Mettols } from "@/data/enemys/Character/mettol/mettol";
import { GAME } from "../sceneManager";
import { BattleUI } from "./UI/batleUi";
import { ShowChipAreaWithChip } from "./UI/chipAreaSelect";
import { ENTITY_MANAGER } from "./sources/entityManager";
import {
  INPUT_MANAGER,
  InputState,
  inputStateKeys,
} from "@/input/inputManager";
import { keyBindings } from "@/config/keyBindings";
import { GAME_TOGGLE_DEV, GAME_TOGGLE_PAUSE } from "./sources/gameState";

export class BattleScene extends SceneRoot {
  nameScene: InputState = inputStateKeys.BATTLE;
  gameBattle = new BatleGame(this);
  battleUI = new BattleUI(this);
  chipAreaSelect = new ShowChipAreaWithChip(this);

  constructor() {
    super();

    INPUT_MANAGER.addState(this.nameScene, {
      onKeyDown: (e: KeyboardEvent) => {
        ENTITY_MANAGER.player.handleKeyDown(e);
        // this.optionsButtons.keyDown(e);
        const opions = {
          [keyBindings.openChipsMenu]: () => {
            if (this.gameBattle.isCompletedBarShip) {
              this.chipAreaSelect.showArea();
            }
          },
          v: () => {
            GAME_TOGGLE_DEV();
          },
          [keyBindings.openPauseMenu]: () => {
            GAME_TOGGLE_PAUSE();
          },
        };
        if (opions[e.key.toLowerCase()]) {
          opions[e.key.toLowerCase()]();
        }
      },
      onKeyUp: (e: KeyboardEvent) => {
        ENTITY_MANAGER.player.handleKeyUp(e);
      },
      // onKeyUp
    });
  }
  in() {
    super.in();
  }

  out() {
    // this.battleUI.out();
  }
  update(deltaTime: number, c: CanvasRenderingContext2D) {
    if (GAME.hasFocus()) {
      this.gameBattle.update(deltaTime, c);
    }
  }
  draw(deltaTime: number, c: CanvasRenderingContext2D) {
    this.gameBattle.bg.draw(c, deltaTime);
    this.gameBattle.draw(deltaTime, c);
    this.battleUI.draw(deltaTime, c);
    this.chipAreaSelect.draw(deltaTime, c);
  }
  checkClick(mouseX: number, mouseY: number) {
    this.gameBattle.checkClick(mouseX, mouseY);
    this.battleUI.checkClick(mouseX, mouseY);
    // this.chipAreaSelect.checkClick(mouseX, mouseY);
  }
}
