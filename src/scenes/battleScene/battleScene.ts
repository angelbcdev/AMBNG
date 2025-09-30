import { BatleGame } from "./sources/gameBattle";
import SceneRoot from "../sceneROOT";
// import { BackGround } from "@/newUI/backGround/backGroundShow";
// import { Mettols } from "@/data/enemys/Character/mettol/mettol";
import { GAME } from "@/scenes/sceneManager";

import { ENTITY_MANAGER } from "../../core/entityManager";
import {
  INPUT_MANAGER,
  InputState,
  inputStateKeys,
} from "@/input/inputManager";
import { keyBindings } from "@/config/keyBindings";
import {
  GAME_SET_BATTLE,
  GAME_SET_PAUSE,
  GAME_SET_UNBATTLE,
  GAME_SET_UNPAUSE,
  GAME_TOGGLE_DEV,
  GAME_TOGGLE_PAUSE,
} from "../../core/gameState";
import { BATTLE_MANAGER } from "../../core/battleManager";
import gameSettings from "@/config/gameSettings";

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
    this.gameBattle.localIsBattle = true;
    super.in();
    GAME_SET_PAUSE();
    GAME_SET_BATTLE();
  }

  out() {
    this.gameBattle.localIsBattle = false;
    GAME_SET_UNPAUSE();
    // GAME_SET_UNBATTLE();
    // this.battleUI.out();
    setTimeout(() => {
      GAME_SET_UNBATTLE();
      //*Time para nexte battle
    }, gameSettings.timeForNextBattle);
  }
  update(deltaTime: number, c: CanvasRenderingContext2D) {
    if (GAME.hasFocus()) {
      this.gameBattle.update(deltaTime, c);
    }
  }
  draw(deltaTime: number, c: CanvasRenderingContext2D) {
    // this.gameBattle.bg.draw(c, deltaTime);
    this.gameBattle.draw(deltaTime, c);
    // BATTLE_MANAGER.draw(c, deltaTime);
    ENTITY_MANAGER.player.showChipts(c, deltaTime);
    BATTLE_MANAGER.chipAreaSelect.draw(c, deltaTime);
    BATTLE_MANAGER.fillBar(c);
    BATTLE_MANAGER.battleUI.draw(c);
    BATTLE_MANAGER.menuScreen.draw(c, deltaTime);
    BATTLE_MANAGER.completeScreen.draw(c, deltaTime);
    BATTLE_MANAGER.dialogue.draw(c, deltaTime);
  }
  checkClick(mouseX: number, mouseY: number) {
    this.gameBattle.checkClick(mouseX, mouseY);
    BATTLE_MANAGER.battleUI.checkClick(mouseX, mouseY);
    // BATTLE_MANAGER.chipAreaSelect.checkClick(mouseX, mouseY);
  }
}
