import { BaseImageComponent } from "./Component/extraImage";
import { LogoRollComponent } from "./Component/extraImage";
import { AddButtonComponent } from "./Component/extraImage";
import { ChipSelectorComponent } from "./Component/extraImage";
import { AddSelectorComponent } from "./Component/extraImage";

import { BattleShip, IChips } from "@/data/player/player/chips/battleChip";
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

export class ShowChipAreaWithChip {
  nameScene: InputState = inputStateKeys.BATTLE_CHIP_AREA;
  showChipArea = false;
  position = { x: this.showChipArea ? 0 : -320, y: 8 };

  // Logo roll animation
  logoImageMaxFrame = 2;
  logoImageFrameTime = 0;
  logoImageFrameInterval = 1000 / 6;
  logoImageFrameX = 0;
  addNewChip = false;

  // Add button
  showADDButon = true;

  // Chip selector animation
  chipSelectorWidth = 46;
  chipSelectorHeight = 46;
  maxFrame = 1;
  frameTime = 0;
  frameInterval = 1000 / 6;
  chipSelectorFrameX = 0;

  speed = 0.5;
  battleScene: BattleScene;
  chipArea: BattleShip[][] = [[]];
  chipSelected: BattleShip[] = [];
  chipSelecteInTurn: string[] = [];
  chipUsed: string[] = [];
  chipInView = { viewX: 0, viewY: 0 };
  showAddChip = true;
  currentRawChip = 1;
  availableChip: BattleShip[] = [];

  // Component instances - only for drawing
  private baseImage = new BaseImageComponent();
  private logoRoll = new LogoRollComponent();
  private addButton = new AddButtonComponent();
  private chipSelector = new ChipSelectorComponent();
  private addSelector = new AddSelectorComponent();

  constructor() {
    INPUT_MANAGER.addState(this.nameScene, {
      onKeyDown: (e: KeyboardEvent) => {
        this.keyDown(e);
      },
    });
  }

  draw(c: CanvasRenderingContext2D, deltaTime: number): void {
    this.drawBaseImage(c);
    this.drawLogoRoll(c, deltaTime);
    this.drawButtonAdd(c);

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

    this.updateFrame(deltaTime);
    this.drawChipArea(c);
    this.drawChipSelected(c);
    this.showSelectorButtons(c);
    this.drawChipBigImage(c);
  }

  drawBaseImage(c: CanvasRenderingContext2D) {
    this.baseImage.draw(c, this.position.x, this.position.y);
  }

  drawLogoRoll(c: CanvasRenderingContext2D, deltaTime: number) {
    if (!this.addNewChip) {
      this.logoImageFrameTime = 0;
      this.logoImageFrameX = 0;
      return;
    }

    if (this.logoImageFrameTime > this.logoImageFrameInterval) {
      this.logoImageFrameTime = 0;
      if (this.logoImageFrameX < this.logoImageMaxFrame) {
        this.logoImageFrameX++;
      } else {
        this.logoImageFrameX = 0;
      }
    } else {
      this.logoImageFrameTime += deltaTime;
    }

    this.logoRoll.draw(
      c,
      this.position.x - 20,
      this.position.y,
      this.logoImageFrameX
    );
  }

  drawButtonAdd(c: CanvasRenderingContext2D) {
    if (!this.showADDButon) {
      return;
    }
    this.addButton.draw(c, this.position.x, this.position.y);
  }

  updateFrame(deltaTime: number) {
    if (this.frameTime > this.frameInterval) {
      this.frameTime = 0;
      if (this.chipSelectorFrameX < this.maxFrame) {
        this.chipSelectorFrameX++;
      } else {
        this.chipSelectorFrameX = 0;
      }
    } else {
      this.frameTime += deltaTime;
    }
  }

  drawChipArea(c: CanvasRenderingContext2D) {
    this.chipArea.forEach((row, y) => {
      row.forEach((chip, x) => {
        const squareX = this.position.x + 1 + x * 42;
        const squareY = this.position.y + 278 + y * 40;

        c.save();

        if (this.chipSelected.includes(chip)) {
          c.globalAlpha = 0.7;
          c.fillStyle = "black";
          c.fillRect(squareX, squareY, 36, 35);
        }

        try {
          chip.drawIcon(c as CanvasRenderingContext2D, squareX, squareY);
        } catch (e) {}

        c.restore();

        if (this.chipInView.viewX === x && this.chipInView.viewY === y) {
          this.chipSelector.draw(c, squareX, squareY, this.chipSelectorFrameX);
        }
      });
    });
  }

  drawChipSelected(c: CanvasRenderingContext2D) {
    this.chipSelected.forEach((chip, y) => {
      let gap = 0;
      switch (y) {
        case 0:
          gap = 68;
          break;
        case 1:
          gap = 108;
          break;
        case 2:
          gap = 153;
          break;
        case 3:
          gap = 194;
          break;
        case 4:
          gap = 236;
          break;
      }

      const squareX = this.position.x + 230;
      const squareY = this.position.y + gap;

      if (chip == null) {
        return;
      }

      chip.drawIcon(c, squareX, squareY);

      if (chip == this.chipArea[this.chipInView.viewY][this.chipInView.viewX]) {
        this.chipSelector.draw(c, squareX, squareY, this.chipSelectorFrameX);
      }
    });
  }

  showSelectorButtons(c: CanvasRenderingContext2D) {
    if (this.chipInView.viewX == 5 && this.showAddChip) {
      this.addSelector.draw(
        c,
        this.position.x + 208,
        this.position.y + 300,
        this.chipSelectorFrameX
      );
    }

    if (!this.showAddChip && this.chipInView.viewX == 5 && this.showADDButon) {
      this.addSelector.draw(
        c,
        this.position.x + 208,
        this.position.y + 300 + 50,
        this.chipSelectorFrameX
      );
    }
  }

  drawChipBigImage(c: CanvasRenderingContext2D) {
    if (this.chipArea.length < 1) {
      return;
    }

    let chip;
    try {
      chip = this.chipArea[this.chipInView.viewY][this.chipInView.viewX];
    } catch (_) {}

    if (this.chipInView.viewX < 5 && chip) {
      chip.drawFullImage(c, this.position.x, this.position.y + 64);
    } else {
      this.noChipSelected(c);
    }
  }

  noChipSelected(c: CanvasRenderingContext2D) {
    const hasChip = this.chipSelected.length > 0;
    const noChip = {
      titleA: "NO DATA",
      titleB: "SELECTED ",
      parrA: "choose",
      parrB: "a chip",
    };
    const withChip = {
      titleA: "CHIP DATA",
      titleB: "TRANSFER",
      parrA: "Sending",
      parrB: "chip data...",
    };
    const addMSJ = {
      titleA: "ADDITIONAL",
      titleB: "CHIP DATA",
      parrA: "+5 chips",
      parrB: "in 1 turnt",
    };

    let currentMSJ = hasChip ? withChip : noChip;

    if (this.chipSelected.length == 0 && !this.showAddChip) {
      currentMSJ = addMSJ;
    }

    c.fillStyle = "#8A2BE2";
    c.fillRect(this.position.x, 70, 164, 150);
    c.fillStyle = "#ffffff";
    c.fillText(currentMSJ.titleA, this.position.x + 72, 96);
    c.fillText(currentMSJ.titleB, this.position.x + 88, 126);
    c.strokeStyle = "#ffff";
    c.strokeRect(this.position.x, 74, 156, 80);
    c.font = "12px Mega-Man-Battle-Network-Regular";
    c.fillText(currentMSJ.parrA, this.position.x + 72, 176);
    c.fillText(currentMSJ.parrB, this.position.x + 72, 206);
  }

  validateAddButton() {
    if (this.chipSelected.length > 0 || this.currentRawChip == 3) {
      this.showADDButon = false;
    } else {
      this.showADDButon = true;
    }
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
          this.showADDButon
        ) {
          this.showAddChip = false;
        }
      },
      [keyBindings.showDialogue]: () => {
        if (this.chipSelected.length < 1) {
          BATTLE_MANAGER.dialogue.showDialogue([
            "We can do this   ",
            "right MEGAMAN!    ",
            "             ",
            "LEST GO!!!!",
          ]);
        } else {
          BATTLE_MANAGER.dialogue.showDialogue([
            "Hey MEGAMAN!   ",
            "Hurry finish this   ",
            "a piece a key     ",
            "don't be late!",
          ]);
        }
      },
      [keyBindings.singleShoot]: () => {
        this.addChip();
      },
      [keyBindings.useChip]: () => {
        // deselect chip
        this.chipSelected.pop();
        this.chipSelecteInTurn.pop();
        this.validateAddButton();
      },
      [keyBindings.openPauseMenu]: () => {
        // move to OK or ADD

        if (this.currentRawChip != 2) {
          this.showAddChip = true;
        }
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
        this.chipSelecteInTurn.push(chip.id);
        this.addNewChip = true;

        if (this.chipSelected.length == 5) {
          this.chipInView.viewX = 5;
          this.chipInView.viewY = 0;
        } else {
          this.chipInView.viewX++;
        }

        setTimeout(() => {
          this.addNewChip = false;
        }, 750);
      }
      this.validateAddButton();
    } else {
      // INPUT_MANAGER.setState(inputStateKeys.NO_INPUT);
      this.chipUsed = [...this.chipSelecteInTurn, ...this.chipUsed];
      this.chipSelecteInTurn = [];
      ENTITY_MANAGER.player.allChips = [];

      if (this.showAddChip) {
        this.sendChipToPlayer();
      } else {
        this.currentRawChip =
          this.currentRawChip > 2 ? 2 : (this.currentRawChip += 1);

        this.chipInView = { viewX: 0, viewY: 0 };

        BATTLE_MANAGER.dialogue.showDialogue([
          "Hey MEGAMAN!   ",
          "let me way for",
          "more chips ",
          "I HAVE AN IDEA!!",
        ]);
        setTimeout(() => {
          this.hiddenArea();
          // this way Dialogue is hidden and don't change the input state
          BATTLE_MANAGER.dialogue.isHidden = true;
        }, timeForDialoge);
      }
    }
  }

  showArea() {
    console.log("showArea", this.chipInView);
    INPUT_MANAGER.setState(this.nameScene);

    this.showChipArea = true;
    GAME_SET_PAUSE();
    console.log("this.chipUsed", this.chipUsed);
    this.showChipInTurn();
    // BATTLE_MANAGER.isCompletedBarShip = true;

    this.validateAddButton();
  }

  hiddenArea() {
    this.showChipArea = false;
    GAME_SET_UNPAUSE();
    this.chipInView = { viewX: 0, viewY: 0 };
    BATTLE_MANAGER.isCompletedBarShip = false;
    BATTLE_MANAGER.currentTimeForSelectShip = 0;
    INPUT_MANAGER.setState(inputStateKeys.BATTLE);
  }
  showChipInTurn() {
    const chipToPlay: BattleShip[][] = [];
    const availableChips = this.availableChip.filter((chip) => {
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

  prepareChipArea() {
    this.availableChip = this.shuffleChip();
  }
  getChipDontUse() {
    // return t
  }
  shuffleChip() {
    return allChipsA
      .sort(() => Math.random() - 0.5)
      .map((chip) => {
        return new BattleShip({ title: chip.title });
      });
  }
  getSpecificChip() {
    return allChipsA.map((_) => {
      return new BattleShip({ title: IChips.block });
    });
  }
}
