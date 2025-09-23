import { GAME } from "../sceneManager";
import SceneRoot from "../sceneROOT";
import { ButtonManager } from "@/newUI/Button/buttonManager ";

import { CHIPS_M } from "@/data/player/player/chips/chipsManager";

export class ChipsScene extends SceneRoot {
  bg = null;
  nameScene = "chips";
  image = new Image();
  arrowImage = new Image();
  arrowBlackImageup = new Image();
  arrowBlackImagedown = new Image();
  x = 0;
  y = 0;
  width = 2568;
  height = 853;
  viewSack = false;
  frameX = 0;
  frameXLimit = this.width / 2;
  folderIndex = 0;
  bagIndex = 0;
  sliceIndexFolder = 0;
  sliceIndexBag = 0;

  constructor() {
    super();
    this.image.src = "/assects/chipsMenu/chipsMenus.png";
    this.arrowImage.src = "/assects/UI/GreenArrow.png";
    this.arrowBlackImageup.src = "/assects/UI/BlackArrowup.png";
    this.arrowBlackImagedown.src = "/assects/UI/BlackArrowdown.png";
  }
  homeKey = (e: KeyboardEvent) => {
    switch (e.key) {
      case "3":
        GAME.changeScene(GAME.statesKeys.world);
        break;
      case "2":
        GAME.changeScene(GAME.statesKeys.option);
        break;
      case "1":
        GAME.changeScene(GAME.statesKeys.chips);
        break;
      case "ArrowRight":
        this.viewSack = true;
        break;
      case "ArrowLeft":
        this.viewSack = false;
        break;
      case "ArrowUp":
        this.upIndex();
        break;
      case "ArrowDown":
        this.downIndex();
        break;
    }
  };
  upIndex = () => {
    if (this.viewSack) {
      if (this.bagIndex - 1 > 0) {
        this.bagIndex -= 1;
      } else {
        this.bagIndex = 0;
      }
    } else {
      if (this.folderIndex - 1 >= 0) {
        this.folderIndex -= 1;
      } else if (this.folderIndex <= 0) {
        if (this.sliceIndexFolder > 0) {
          this.sliceIndexFolder -= 1;
        }
      }
    }
  };
  downIndex() {
    if (this.viewSack) {
      if (this.bagIndex + 1 < CHIPS_M.randomChip.length - 1) {
        this.bagIndex += 1;
      } else {
        this.bagIndex = CHIPS_M.randomChip.length - 1;
      }
    } else {
      if (this.folderIndex + 1 <= 6) {
        this.folderIndex += 1;
      } else if (this.folderIndex >= 6) {
        if (this.sliceIndexFolder + 7 < CHIPS_M.randomChip.length)
          this.sliceIndexFolder += 1;
      }
    }
  }
  draw(
    deltaTime: number,
    c: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    if (this.viewSack) {
      if (this.frameX < this.frameXLimit - 25) {
        this.frameX += deltaTime * 2.5;
      }
    } else {
      if (this.frameX >= 0) {
        this.frameX -= deltaTime * 2.5;
      }
    }

    // super.draw(deltaTime, c, canvas);
    c.drawImage(
      this.image,
      this.x + this.frameX,
      this.y,
      this.frameXLimit,
      this.height,
      0,
      0,
      430,
      430
    );
    // this.optionsButtons.draw(c);
    //TODO: Folder chips

    const folderChips = CHIPS_M.randomChip.slice(
      this.sliceIndexFolder,
      this.sliceIndexFolder + 7
    );
    // Arrows
    if (this.sliceIndexFolder > 0) {
      c.drawImage(this.arrowBlackImageup, 280 + -this.frameX, 54, 28, 28);
    }
    if (this.sliceIndexFolder + 7 < CHIPS_M.randomChip.length) {
      c.drawImage(this.arrowBlackImagedown, 280 + -this.frameX, 404, 28, 28);
    }

    folderChips.forEach((chip, index) => {
      if (index == this.folderIndex) {
        folderChips[this.folderIndex].drawFullImage(c, 30 + -this.frameX, 50);
        c.drawImage(
          this.arrowImage,
          190 + -this.frameX,
          94 + index * 44,
          28,
          28
        );
      }
      c.font = "16px 'Mega-Man-Battle-Network-Regular'";

      c.fillStyle = "black";
      c.fillText(
        chip.name + `-${CHIPS_M.randomChip.indexOf(chip)}`,
        223 + -this.frameX,
        113 + index * 44
      );
      c.fillStyle = "white";
      c.fillText(
        chip.name + `-${CHIPS_M.randomChip.indexOf(chip)}`,
        220 + -this.frameX,
        110 + index * 44
      );
    });

    // //TODO: bags chips
    CHIPS_M.randomChip[this.bagIndex].drawFullImage(
      c,
      290 + this.frameXLimit + -this.frameX,
      50
    );

    CHIPS_M.randomChip
      .slice(this.bagIndex, this.bagIndex + 7)
      .forEach((chip, index) => {
        // if (index == this.bagIndex) {
        //   c.drawImage(
        //     this.arrowImage,
        //     190 + -this.frameX,
        //     94 + index * 44,
        //     28,
        //     28
        //   );
        // }
        c.font = "16px 'Mega-Man-Battle-Network-Regular'";

        c.fillStyle = "black";
        c.fillText(
          chip.name,
          this.frameXLimit + 62 + -this.frameX,
          113 + index * 44
        );
        c.fillStyle = "white";
        c.fillText(
          chip.name,
          this.frameXLimit + 65 + -this.frameX,
          110 + index * 44
        );
      });
  }
  checkClick(mouseX: number, mouseY: number) {
    // this.optionsButtons.checkClick(mouseX, mouseY);
  }
  checkKey(e: KeyboardEvent) {
    // this.optionsButtons.keyDown(e);
  }

  in() {
    console.log("ChipsScene in");
    // this.optionsButtons.in();
    document.addEventListener("keydown", this.homeKey);
  }
  out() {
    console.log("ChipsScene out");
    // this.optionsButtons.out();
    document.removeEventListener("keydown", this.homeKey);
  }
}
