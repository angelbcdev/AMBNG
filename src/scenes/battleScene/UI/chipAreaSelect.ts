import { BattleShip } from "@/data/player/player/chips";

import { allChipsA } from "@/data/player/player/chips/chipData";
import { BattleScene } from "../battleScene";
import { keyBindings } from "@/config/keyBindings";
// import { allChipsA } from "@/data/player/chips/chipData";

export class ShowChipAreaWithChip {
  mainImage = new Image();
  showChipArea = false;
  mainImageWidth = 320;
  mainImageHeight = 420;
  position = { x: this.showChipArea ? 0 : -320, y: 8 };
  logoImage = new Image();
  logoImageWidth = 47;
  logoImageHeight = 69;
  logoImageMaxFrame = 2;
  logoImageFrameTime = 0;
  logoImageFrameInterval = 1000 / 6;
  logoImageFrameX = 0;
  addButon = new Image();
  addButonWidth = 65;
  addButonHeight = 62;
  addButonMaxFrame = 2;
  addButonFrameTime = 0;
  addButonFrameInterval = 1000 / 6;
  addButonFrameX = 0;
  addNewChip = false;
  showADDButon = true;
  speed = 0.5;
  battleScene: BattleScene;
  chipArea: BattleShip[][];
  chipSelected: BattleShip[];
  chipUsed: string[] = [];
  chipSelector = new Image();

  chipSelectorWidth = 46;
  chipSelectorHeight = 46;
  maxFrame = 1;
  frameTime = 0;
  frameInterval = 1000 / 6;
  chipSelectorFrameX = 0;
  chipInView = { viewX: 0, viewY: 0 };
  addSelectorImage = new Image();

  addSelectorImageWidth = 53;
  addSelectorImageHeight = 53;
  showAddChip = true;
  currentRawChip = 1;
  randomChip = allChipsA
    .sort(() => Math.random() - 0.5)
    .map((chip) => {
      return new BattleShip({ title: chip.title });
    });

  constructor(battleScene: BattleScene) {
    this.battleScene = battleScene;
    this.mainImage.src = "assects/selectedchip/chipSelector.png";
    this.logoImage.src = "assects/selectedchip/logoRoll.png";
    this.addButon.src = "assects/selectedchip/addButon.png";

    this.chipArea = [];
    this.chipSelected = [];
    this.chipSelector.src = "assects/selectedchip/selectedChip.png";
    this.addSelectorImage.src = "assects/selectedchip/selectAcept.png";

    this.prepareChipArea();
  }
  draw(deltaTime: number, c: CanvasRenderingContext2D): void {
    this.drawBaseImage(c);
    this.drawLogoRoll(c, deltaTime);

    this.drawButtonAdd(c);
    if (this.showChipArea) {
      if (this.position.x < 0) {
        this.position.x += this.speed * deltaTime;
        this.battleScene.battleUI.position.x += this.speed * deltaTime;
      }
    } else {
      if (this.position.x > -320) {
        this.position.x -= this.speed * deltaTime;
        this.battleScene.battleUI.position.x -= this.speed * deltaTime;
      }
    }
    this.updateFrame(deltaTime);
    this.drawChipArea(c);
    this.drawChipSelected(c);
    this.showSelectorButtons(c);
    this.drawChipBigImage(c);
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
      chip.drawFullImage(c, this.position.x + 23, this.position.y + 64);
    } else {
      this.noChipSelected(c);
    }
  }
  handleKeyDown = (event: KeyboardEvent) => {
    this.keyDown(event);
  };

  handleKeyUp = (_: KeyboardEvent) => {
    // this.keyUp(event);
  };

  handleInput(state: string) {
    if (state !== "BATTLE") {
      document.addEventListener("keydown", this.handleKeyDown);
      document.addEventListener("keyup", this.handleKeyUp);
    } else {
      document.removeEventListener("keydown", this.handleKeyDown);
      document.removeEventListener("keyup", this.handleKeyUp);
    }
  }
  showSelectorButtons(c: CanvasRenderingContext2D) {
    if (this.chipInView.viewX == 5 && this.showAddChip) {
      c.drawImage(
        this.addSelectorImage,
        this.chipSelectorFrameX * this.addSelectorImageWidth,
        0,
        this.addSelectorImageWidth,
        this.addSelectorImageHeight,
        this.position.x + 227,
        this.position.y + 300, //, //
        this.addSelectorImageWidth + 8,
        this.addSelectorImageHeight
      );
    }
    if (!this.showAddChip && this.chipInView.viewX == 5 && this.showADDButon) {
      c.drawImage(
        this.addSelectorImage,
        this.chipSelectorFrameX * this.addSelectorImageWidth,
        0,
        this.addSelectorImageWidth,
        this.addSelectorImageHeight,
        this.position.x + 227,
        this.position.y + 300 + 50, //
        this.addSelectorImageWidth + 8,
        this.addSelectorImageHeight
      );
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
    c.fillRect(this.position.x + 26, 70, 164, 150);
    c.fillStyle = "#ffffff";
    c.fillText(currentMSJ.titleA, this.position.x + 92, 96);
    c.fillText(currentMSJ.titleB, this.position.x + 108, 126);
    c.strokeStyle = "#ffff";
    c.strokeRect(this.position.x + 26, 74, 156, 80);
    c.font = "12px Mega-Man-Battle-Network-Regular";
    c.fillText(currentMSJ.parrA, this.position.x + 102, 176);
    c.fillText(currentMSJ.parrB, this.position.x + 108, 206);
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
        const squareX = this.position.x + 26 + x * 40;
        const squareY = this.position.y + 278 + y * 40;
        //
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
          c.drawImage(
            this.chipSelector,
            this.chipSelectorFrameX * this.chipSelectorWidth,
            0,
            this.chipSelectorWidth,
            this.chipSelectorHeight,
            squareX - 3,
            squareY - 3,
            this.chipSelectorWidth - 6,
            this.chipSelectorHeight - 6
          );
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

      const squareX = this.position.x + 250;
      const squareY = this.position.y + gap;
      if (chip == null) {
        return;
      }
      chip.drawIcon(c, squareX, squareY);
      if (chip == this.chipArea[this.chipInView.viewY][this.chipInView.viewX]) {
        c.drawImage(
          this.chipSelector,
          this.chipSelectorFrameX * this.chipSelectorWidth,
          0,
          this.chipSelectorWidth,
          this.chipSelectorHeight,
          squareX - 3,
          squareY - 3,
          this.chipSelectorWidth - 6,
          this.chipSelectorHeight - 6
        );
      }
    });
  }
  validateAddButton() {
    if (this.chipSelected.length > 0) {
      this.showADDButon = false;
    } else {
      this.showADDButon = true;
    }
  }
  keyDown(e: KeyboardEvent) {
    switch (e.key) {
      case "ArrowLeft":
        if (this.chipInView.viewX > 0) {
          this.chipInView.viewX--;
        }
        if (!this.showAddChip) this.showAddChip = true;
        break;
      case "ArrowRight":
        if (this.chipInView.viewX < 5) {
          this.chipInView.viewX++;
        }

        break;
      case "ArrowUp":
        if (this.chipInView.viewY > 0) {
          this.chipInView.viewY--;
        }
        if (this.chipInView.viewX == 5 && !this.showAddChip) {
          this.showAddChip = true;
        }
        break;
      case "ArrowDown":
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
        break;
      case keyBindings.singleShoot:
        this.addChip();

        break;
      case keyBindings.useChip:
        this.chipSelected.pop();
        this.validateAddButton();
        break;
    }
  }
  sendChipToPlayer() {
    if (this.chipSelected.length > 0) {
      this.battleScene.gameBattle.players[0].addChip(this.chipSelected);
      this.currentRawChip = 1;
      this.battleScene.currentState = this.battleScene.states.BATTLE;
    }

    this.chipSelected = [];

    this.hiddenArea();
  }
  addChip() {
    if (this.chipInView.viewX < 5) {
      if (this.chipSelected.length > 5) {
        return;
      }
      const chip = this.chipArea[this.chipInView.viewY][this.chipInView.viewX];

      if (!this.chipSelected.includes(chip) && chip != null) {
        this.chipSelected.push(chip);
        this.chipUsed.push(chip.id);
        this.addNewChip = true;
        setTimeout(() => {
          this.addNewChip = false;
        }, 750);
      }
      this.validateAddButton();
    } else {
      if (this.showAddChip) {
        this.sendChipToPlayer();
      } else {
        this.currentRawChip > 2 ? 2 : this.currentRawChip++;

        // this.gameUI.dialogue.showDialogue();
        this.chipInView = { viewX: 0, viewY: 0 };
        setTimeout(() => {
          // this.gameUI.dialogue.hideDialogue();
          this.hiddenArea();
        }, 3000);
      }
    }
  }
  drawBaseImage(c: CanvasRenderingContext2D) {
    c.drawImage(
      this.mainImage,
      this.position.x,
      this.position.y,
      this.mainImageWidth,
      this.mainImageHeight
    );
  }
  drawButtonAdd(c: CanvasRenderingContext2D) {
    if (!this.showADDButon) {
      return;
    }
    c.drawImage(
      this.addButon,
      this.position.x + 225,
      this.position.y + 345,
      this.addButonWidth,
      this.addButonHeight
    );
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

    c.drawImage(
      this.logoImage,
      this.logoImageFrameX * this.logoImageWidth,
      0,
      this.logoImageWidth,
      this.logoImageHeight,
      this.position.x + 248,
      this.position.y + 4,
      this.logoImageWidth - 6,
      this.logoImageHeight - 10
    );
  }
  showArea() {
    this.chipInView = { viewX: 0, viewY: 0 };
    this.showChipArea = true;
    this.battleScene.gameBattle.gameIsPaused = true;
    this.prepareChipArea();
    this.validateAddButton();
  }
  hiddenArea() {
    this.showChipArea = false;
    this.battleScene.gameBattle.gameIsPaused = false;
    this.battleScene.gameBattle.isCompletedBarShip = false;
    this.battleScene.gameBattle.currentTimeForSelectShip = 0;
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
