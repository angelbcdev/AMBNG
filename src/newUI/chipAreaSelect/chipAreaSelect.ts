// Updated main class: ShowChipAreaWithChip.ts
import { BattleShip } from "@/data/player/player/chips/battleChip";
import { allChipsA } from "@/data/player/player/chips/chipData";
import { BattleScene } from "../../scenes/battleScene/battleScene";
import { keyBindings } from "@/config/keyBindings";
import { ENTITY_MANAGER } from "../../scenes/battleScene/sources/entityManager";
import {
  INPUT_MANAGER,
  InputState,
  inputStateKeys,
} from "@/input/inputManager";
import { BATTLE_MANAGER } from "../../scenes/battleScene/sources/battleManager";
import {
  GAME_SET_PAUSE,
  GAME_SET_UNPAUSE,
} from "../../scenes/battleScene/sources/gameState";
import { BaseImageComponent } from "./Component/baseImageComponent";
import { LogoRollComponent } from "./Component/logoRollComponent";
import {
  AddButtonComponent,
  ChipSelectorComponent,
} from "./Component/chipSelectorComponent";
import { ChipDisplayRenderer } from "./Component/ChipDisplayRenderer";
import { AddSelectorComponent } from "./Component/AddSelectorComponent";
import { ChipAreaRenderer } from "./Component/ChipAreaRenderer";

export class ShowChipAreaWithChip {
  nameScene: InputState = inputStateKeys.BATTLE_CHIP_AREA;
  showChipArea = false;
  position = { x: this.showChipArea ? 0 : -320, y: 8 };
  addNewChip = false;
  showAddChip = true;
  speed = 0.5;
  battleScene: BattleScene;
  chipArea: BattleShip[][];
  chipSelected: BattleShip[];
  chipUsed: string[] = [];
  chipInView = { viewX: 0, viewY: 0 };
  currentRawChip = 1;
  randomChip = allChipsA
    .sort(() => Math.random() - 0.5)
    .map((chip) => {
      return new BattleShip({ title: chip.title });
    });

  // Component instances
  private baseImage = new BaseImageComponent();
  private logoRoll = new LogoRollComponent();
  private addButton = new AddButtonComponent();
  private chipSelector = new ChipSelectorComponent();
  private addSelector = new AddSelectorComponent();
  private chipAreaRenderer = new ChipAreaRenderer(this.chipSelector);
  private chipDisplayRenderer = new ChipDisplayRenderer();
  // private messageRenderer = new MessageRenderer();

  constructor() {
    this.chipArea = [];
    this.chipSelected = [];
    this.prepareChipArea();

    INPUT_MANAGER.addState(this.nameScene, {
      onKeyDown: (e: KeyboardEvent) => {
        this.keyDown(e);
      },
    });
  }

  draw(deltaTime: number, c: CanvasRenderingContext2D): void {
    this.baseImage.draw(c, this.position.x, this.position.y);
    this.logoRoll.update(deltaTime);
    this.logoRoll.draw(c, this.position.x, this.position.y);
    this.addButton.draw(c, this.position.x, this.position.y);
    this.updatePosition(deltaTime);
    this.chipSelector.update(deltaTime);
    this.chipAreaRenderer.drawChipArea(
      c,
      this.chipArea,
      this.chipSelected,
      this.chipInView,
      this.position.x,
      this.position.y
    );
    this.chipAreaRenderer.drawChipSelected(
      c,
      this.chipSelected,
      this.chipArea,
      this.chipInView,
      this.position.x,
      this.position.y
    );
    this.showSelectorButtons(c);
    this.chipDisplayRenderer.drawChipBigImage(
      c,
      this.chipArea,
      this.chipInView,
      this.position.x,
      this.position.y
    );
  }

  private updatePosition(deltaTime: number): void {
    if (this.showChipArea) {
      if (this.position.x < 20) {
        this.position.x += this.speed * deltaTime;
        BATTLE_MANAGER.battleUI.position.x += this.speed * deltaTime;
      }
    } else {
      if (this.position.x > -320) {
        this.position.x -= this.speed * deltaTime;
        BATTLE_MANAGER.battleUI.position.x -= this.speed * deltaTime;
      }
    }
  }

  showSelectorButtons(c: CanvasRenderingContext2D) {
    if (this.chipInView.viewX == 5 && this.showAddChip) {
      this.addSelector.draw(
        c,
        this.position.x + 200,
        this.position.y + 300,
        this.chipSelector.frameX
      );
    }
    if (
      !this.showAddChip &&
      this.chipInView.viewX == 5 &&
      this.addButton.visible
    ) {
      this.addSelector.draw(
        c,
        this.position.x + 200,
        this.position.y + 300 + 50,
        this.chipSelector.frameX
      );
    }
  }

  validateAddButton() {
    this.addButton.setVisible(this.chipSelected.length === 0);
  }
  keyDown(e: KeyboardEvent) {
    const options = {
      arrowleft: () => {
        if (this.chipInView.viewX > 0) {
          this.chipInView.viewX--;
        }
        if (!this.showAddChip) this.showAddChip = true;
      },
      arrowright: () => {
        if (this.chipInView.viewX < 5) {
          this.chipInView.viewX++;
        }
      },
      arrowup: () => {
        if (this.chipInView.viewY > 0) {
          this.chipInView.viewY--;
        }
        if (this.chipInView.viewX == 5 && !this.showAddChip) {
          this.showAddChip = true;
        }
      },
      arrowdown: () => {
        if (
          this.chipInView.viewY < this.chipArea.length - 1 &&
          this.chipInView.viewX < 5
        ) {
          this.chipInView.viewY++;
        }
        if (
          this.chipInView.viewX == 5 &&
          this.showAddChip &&
          this.addButton.visible
        ) {
          this.showAddChip = false;
        }
      },
      [keyBindings.singleShoot]: () => {
        this.addChip();
      },
      [keyBindings.useChip]: () => {
        this.chipSelected.pop();
        this.validateAddButton();
      },
      [keyBindings.openPauseMenu]: () => {
        this.chipInView.viewX = 5;
        this.chipInView.viewY = 0;
      },
    };
    if (options[e.key.toLowerCase()]) {
      options[e.key.toLowerCase()]();
    }
  }

  sendChipToPlayer() {
    if (this.chipSelected.length > 0) {
      ENTITY_MANAGER.player.addChip(this.chipSelected);
      this.currentRawChip = 1;
    }

    this.chipSelected = [];
    this.hiddenArea();
  }

  addChip() {
    const timeForDialoge = 1700;

    if (this.chipInView.viewX < 5) {
      if (this.chipSelected.length > 5) {
        return;
      }
      const chip = this.chipArea[this.chipInView.viewY][this.chipInView.viewX];

      if (!this.chipSelected.includes(chip) && chip != null) {
        this.chipSelected.push(chip);
        this.chipUsed.push(chip.id);
        this.logoRoll.startAnimation();

        if (this.chipSelected.length == 5) {
          this.chipInView.viewX = 5;
          this.chipInView.viewY = 0;
        }

        setTimeout(() => {
          this.logoRoll.stopAnimation();
        }, 750);
      }
      this.validateAddButton();
    } else {
      INPUT_MANAGER.setState(inputStateKeys.NO_INPUT);
      ENTITY_MANAGER.player.allChips = [];

      if (this.showAddChip) {
        this.sendChipToPlayer();
      } else {
        this.currentRawChip =
          this.currentRawChip > 2 ? 2 : (this.currentRawChip += 1);

        this.chipInView = { viewX: 0, viewY: 0 };
        setTimeout(() => {
          this.hiddenArea();
        }, timeForDialoge);
      }
    }
  }

  showArea() {
    INPUT_MANAGER.setState(this.nameScene);
    this.chipInView = { viewX: 0, viewY: 0 };
    this.showChipArea = true;
    GAME_SET_PAUSE();

    BATTLE_MANAGER.isCompletedBarShip = true;
    this.prepareChipArea();
    this.validateAddButton();
  }

  hiddenArea() {
    this.showChipArea = false;
    GAME_SET_UNPAUSE();

    BATTLE_MANAGER.isCompletedBarShip = false;
    BATTLE_MANAGER.currentTimeForSelectShip = 0;
    INPUT_MANAGER.setState(inputStateKeys.BATTLE);
  }

  prepareChipArea() {
    const chipToPlay: BattleShip[][] = [];
    const availableChips = this.randomChip.filter((chip) => {
      return !this.chipUsed.includes(chip.id);
    });

    let x = 0;
    for (let y = 0; y < 6; y++) {
      chipToPlay[y] = [];

      for (let j = 0; j < 5; j++) {
        chipToPlay[y][j] = availableChips[x];
        x++;
      }
    }

    this.chipArea = chipToPlay.slice(0, this.currentRawChip);
  }
}
