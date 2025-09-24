import { BatleGame } from "./sources/gameBattle";
import SceneRoot from "../sceneROOT";
// import { BackGround } from "@/newUI/backGround/backGroundShow";
// import { Mettols } from "@/data/enemys/Character/mettol/mettol";
import { GAME } from "../sceneManager";
import { BattleUI } from "./UI/batleUi";
import { ShowChipAreaWithChip } from "./UI/chipAreaSelect";
import { ENTITY_MANAGER } from "./sources/entityManager";

export class BattleScene extends SceneRoot {
  nameScene = "battle";
  gameBattle = new BatleGame(this);
  battleUI = new BattleUI(this);
  chipAreaSelect = new ShowChipAreaWithChip(this);
  states = {
    BATTLE: "BATTLE",
    CHIP_AREA: "CHIP_AREA",
  };
  currentState = this.states.BATTLE;

  constructor() {
    super();

    document.addEventListener("keydown", (e) => {
      if (e.key === " ") {
        if (this.gameBattle.isCompletedBarShip) {
          this.chipAreaSelect.showArea();
          this.currentState = this.states.CHIP_AREA;
        }
      }
    });
  }
  in() {
    this.gameBattle.startNewBattle({
      backGround: 0,
      floorImage: 2,
    });
  }
  out() {
    // this.battleUI.out();
  }
  update(deltaTime: number, c: CanvasRenderingContext2D) {
    if (GAME.hasFocus()) {
      this.gameBattle.update(deltaTime, c);
    }
    this.handleInput();
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
  handleInput() {
    if (!GAME.hasFocus()) return;

    ENTITY_MANAGER.player.handleInput(this.currentState);
    this.chipAreaSelect.handleInput(this.currentState);
    // if (this.chipAreaSelect.showChipArea) {
    //   this.chipAreaSelect.handleInput();
    // } else {
    //   this.gameBattle.players[0].handleInput();
    // }
  }
}
