import { BatleGame } from "./sources/gameBattle";
import SceneRoot from "../sceneROOT";
// import { BackGround } from "@/newUI/backGround/backGroundShow";
// import { Mettols } from "@/data/enemys/Character/mettol/mettol";
import { GAME } from "../sceneManager";

import { ENTITY_MANAGER } from "../../core/entityManager";
import {
  INPUT_MANAGER,
  InputState,
  inputStateKeys,
} from "@/input/inputManager";
import { keyBindings } from "@/config/keyBindings";
import { GAME_TOGGLE_DEV, GAME_TOGGLE_PAUSE } from "../../core/gameState";
import { BATTLE_MANAGER } from "../../core/battleManager";

export class BattleScene extends SceneRoot {
  nameScene: InputState = inputStateKeys.BATTLE;
  gameBattle = new BatleGame();

  // chipAreaSelect = new ShowChipAreaWithChip(this);

  constructor() {
    super();

    INPUT_MANAGER.addState(this.nameScene, {
      onKeyDown: (e: KeyboardEvent) => {
        ENTITY_MANAGER.player.handleKeyDown(e);
        // this.optionsButtons.keyDown(e);
        const opions = {
          [keyBindings.pressL]: () => {
            if (BATTLE_MANAGER.isCompletedBarShip) {
              BATTLE_MANAGER.chipAreaSelect.showArea();
            }
          },
          [keyBindings.pressR]: () => {
            if (BATTLE_MANAGER.isCompletedBarShip) {
              BATTLE_MANAGER.chipAreaSelect.showArea();
            }
          },
          v: () => {
            GAME_TOGGLE_DEV();
          },
          [keyBindings.pressStart]: () => {
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
    // this.gameBattle.bg.draw(c, deltaTime);
    this.gameBattle.draw(deltaTime, c);
    BATTLE_MANAGER.draw(c, deltaTime);
  }
  checkClick(mouseX: number, mouseY: number) {
    this.gameBattle.checkClick(mouseX, mouseY);
    BATTLE_MANAGER.battleUI.checkClick(mouseX, mouseY);
    // BATTLE_MANAGER.chipAreaSelect.checkClick(mouseX, mouseY);
  }
}
