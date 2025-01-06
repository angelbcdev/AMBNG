import { BattleShip } from "../player/chips";
import { allChipsA } from "../player/chips/chipData";
import { TestGame } from "../textGame";

class ShowChipArea {
  mainImage = new Image();
  position = { x: -320, y: 8 };

  mainImageWidth = 320;
  mainImageHeight = 420;
  game: TestGame;
  logoImage = new Image();
  logoImageX = this.position.x + 248;
  logoImageY = this.position.y + 4;
  logoImageWidth = 47;
  logoImageHeight = 69;
  logoImageMaxFrame = 2;
  logoImageFrameTime = 0;
  logoImageFrameInterval = 1000 / 6;
  logoImageFrameX = 0;
  addButon = new Image();
  addButonX = this.position.x + 225;
  addButonY = this.position.y + 345;
  addButonWidth = 65;
  addButonHeight = 62;
  addButonMaxFrame = 2;
  addButonFrameTime = 0;
  addButonFrameInterval = 1000 / 6;
  addButonFrameX = 0;
  addNewChip = false;
  showADDButon = true;

  showChipArea = false;
  speed = 0.5;

  constructor(game: TestGame) {
    this.game = game;
    this.mainImage.src = "assects/selectedchip/chipSelector.png";
    this.logoImage.src = "assects/selectedchip/logoRoll.png";
    this.addButon.src = "assects/selectedchip/addButon.png";
  }
  draw(c: CanvasRenderingContext2D, deltaTime: number) {
    this.drawBaseImage(c);
    this.drawLogoRoll(c, deltaTime);

    this.drawButtonAdd(c);
    if (this.showChipArea) {
      if (this.position.x < 0) {
        this.position.x += this.speed * deltaTime;
        this.game.gameUI.position.x += this.speed * deltaTime;
      }
    } else {
      if (this.position.x > -320) {
        this.position.x -= this.speed * deltaTime;
        this.game.gameUI.position.x -= this.speed * deltaTime;
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
      this.addButonX,
      this.addButonY,
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
      this.logoImageX,
      this.logoImageY,
      this.logoImageWidth - 6,
      this.logoImageHeight - 10
    );
  }
  showArea() {
    this.showChipArea = true;
  }
  hiddenArea() {
    this.showChipArea = false;
  }
}

export class ShowChipAreaWithChip extends ShowChipArea {
  chipArea: BattleShip[][];
  chipSelected: BattleShip[];
  chipSelector = new Image();
  chipSelectorX = this.position.x + 23;
  chipSelectorY = this.position.y + 275;
  chipSelectorWidth = 46;
  chipSelectorHeight = 46;
  maxFrame = 1;
  frameTime = 0;
  frameInterval = 1000 / 6;
  chipSelectorFrameX = 0;
  chipInView = { viewX: 0, viewY: 0 };
  addSelectorImage = new Image();
  addSelectorImageX = this.position.x + 227;
  addSelectorImageY = this.position.y + 300;
  addSelectorImageWidth = 53;
  addSelectorImageHeight = 53;
  showAddChip = false;

  constructor(game: TestGame) {
    super(game);

    this.chipArea = [
      allChipsA
        .map((chip) => new BattleShip({ title: chip.title }))
        .slice(0, 5),
    ];
    this.chipSelected = [];
    this.chipSelector.src = "assects/selectedchip/selectedChip.png";
    this.addSelectorImage.src = "assects/selectedchip/selectAcept.png";

    this.moveChipSelector();
  }
  draw(c: CanvasRenderingContext2D, deltaTime: number): void {
    super.draw(c, deltaTime);
    this.updateFrame(deltaTime);
    this.drawChipArea(c);
    this.drawChipSelected(c);
    this.showSelectorButtons(c);
    this.drawChipBigImage(c);
    // if (this.chipSelected.length > 0) {
    //   this.showADDButon = false;
    // } else {
    //   this.showADDButon = true;
    // }
  }
  drawChipBigImage(c: CanvasRenderingContext2D) {
    if (this.chipInView.viewX < 5) {
      this.chipArea[this.chipInView.viewY][this.chipInView.viewX].drawFullImage(
        c,
        this.position.x + 23,
        this.position.y + 64
      );
    } else {
      this.noChipSelected(c);
    }
  }
  showSelectorButtons(c: CanvasRenderingContext2D) {
    if (this.chipInView.viewX == 5 && !this.showAddChip) {
      c.drawImage(
        this.addSelectorImage,
        this.chipSelectorFrameX * this.addSelectorImageWidth,
        0,
        this.addSelectorImageWidth,
        this.addSelectorImageHeight,
        this.addSelectorImageX,
        this.addSelectorImageY, //
        this.addSelectorImageWidth + 8,
        this.addSelectorImageHeight
      );
    }
    if (this.showAddChip && this.chipInView.viewX == 5 && this.showADDButon) {
      c.drawImage(
        this.addSelectorImage,
        this.chipSelectorFrameX * this.addSelectorImageWidth,
        0,
        this.addSelectorImageWidth,
        this.addSelectorImageHeight,
        this.addSelectorImageX,
        this.addSelectorImageY + 50, //
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

    if (this.chipSelected.length == 0 && this.showAddChip) {
      currentMSJ = addMSJ;
    }

    c.fillStyle = "#8A2BE2";
    c.fillRect(22, 70, 164, 150);
    c.fillStyle = "#ffffff";
    c.fillText(currentMSJ.titleA, 92, 96);
    c.fillText(currentMSJ.titleB, 108, 126);
    c.strokeStyle = "#ffff";
    c.strokeRect(26, 74, 156, 80);
    c.font = "12px Mega-Man-Battle-Network-Regular";
    c.fillText(currentMSJ.parrA, 102, 176);
    c.fillText(currentMSJ.parrB, 108, 206);
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
        let squareX = this.position.x + 26 + x * 40;
        let squareY = this.position.y + 278 + y * 40;
        //
        c.save();

        if (this.chipSelected.includes(chip)) {
          c.globalAlpha = 0.7;
          c.fillStyle = "black";
          c.fillRect(squareX, squareY, 36, 35);
        }
        chip.drawIcon(c as CanvasRenderingContext2D, squareX, squareY);
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

      let squareX = this.position.x + 250;
      let squareY = this.position.y + gap;
      chip.drawIcon(c as CanvasRenderingContext2D, squareX, squareY);
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
  moveChipSelector() {
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowLeft":
          if (this.chipInView.viewX > 0) {
            this.chipInView.viewX--;
          }
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
          if (this.chipInView.viewX == 5 && this.showAddChip) {
            this.showAddChip = false;
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
            !this.showAddChip &&
            this.showADDButon
          ) {
            this.showAddChip = true;
          }
          break;
        case "g":
          this.addChip();

          break;
        case "f":
          this.chipSelected.pop();
          break;
      }
    });
  }
  addChip() {
    if (this.chipSelected.length < 5 && this.chipInView.viewX < 5) {
      let chip = this.chipArea[this.chipInView.viewY][this.chipInView.viewX];

      if (!this.chipSelected.includes(chip)) {
        this.chipSelected.push(
          this.chipArea[this.chipInView.viewY][this.chipInView.viewX]
        );
        this.addNewChip = true;
        setTimeout(() => {
          this.addNewChip = false;
        }, 750);
      }
    }
  }
}
