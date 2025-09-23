import { GAME } from "../sceneManager";
import SceneRoot from "../sceneROOT";

import { CHIPS_M } from "@/data/player/player/chips/chipsManager";

import { BattleShip } from "@/data/player/player/chips";
import { keyBindings } from "@/config/keyBindings";

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
  frameXLimit = this.width / 6 + 40;
  folderIndex = 0;
  sliceIndexFolder = 0;
  globalFolderIndex = 0;
  globalSackIndex = 0;
  sackIndex = 0;
  sliceIndexSack = 0;
  moveToFolderID: string = "N/A";
  removeFolderID: string = "N/A";

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
        if (CHIPS_M.chipsFolder.length > 0) {
          this.removeFolderID = CHIPS_M.chipsFolder[this.folderIndex].idForMove;
        }
        break;
      case "ArrowUp":
        this.upIndex();
        break;
      case "ArrowDown":
        this.downIndex();
        break;
      case keyBindings.singleShoot:
        if (this.viewSack) {
          CHIPS_M.addChipToFolder(this.moveToFolderID);
        } else {
          if (this.globalFolderIndex - 1 > 0) {
            this.globalFolderIndex -= 1;
          }
          this.folderIndex =
            this.folderIndex - 1 > 0 ? this.folderIndex - 1 : 0;
          this.sliceIndexFolder =
            this.sliceIndexFolder - 1 > 0 ? this.sliceIndexFolder - 1 : 0;
          CHIPS_M.removeChipFromFolder(this.removeFolderID);
          this.removeFolderID = CHIPS_M.chipsFolder[this.folderIndex].idForMove;
        }
        break;
      case keyBindings.useChip:
        GAME.returnToPreviousScene();
        break;
    }
  };
  upIndex = () => {
    if (this.viewSack) {
      this.updateNavigationUp({
        globalIndex: this.globalSackIndex,
        allChips: CHIPS_M.chipsSack,
        moveId: (id: string) => {
          this.moveToFolderID = id;
        },
        isSack: true,
        viewIndex: this.sackIndex,
        viewSlice: this.sliceIndexSack,
        setGlobalIndex: (index: number) => {
          this.globalSackIndex = index;
        },
        setViewIndex: (index: number) => {
          this.sackIndex = index;
        },
        setViewSlice: (index: number) => {
          this.sliceIndexSack = index;
        },
      });
    } else {
      this.updateNavigationUp({
        globalIndex: this.globalFolderIndex,
        allChips: CHIPS_M.chipsFolder,
        moveId: (id: string) => {
          this.removeFolderID = id;
        },
        isSack: false,
        viewIndex: this.folderIndex,
        viewSlice: this.sliceIndexFolder,
        setGlobalIndex: (index: number) => {
          this.globalFolderIndex = index;
        },
        setViewIndex: (index: number) => {
          this.folderIndex = index;
        },
        setViewSlice: (index: number) => {
          this.sliceIndexFolder = index;
        },
      });
    }
  };
  downIndex() {
    if (this.viewSack) {
      this.updateNavigationDown({
        globalIndex: this.globalSackIndex,
        allChips: CHIPS_M.chipsSack,
        moveId: (id: string) => {
          this.moveToFolderID = id;
        },
        isSack: true,
        viewIndex: this.sackIndex,
        viewSlice: this.sliceIndexSack,
        setGlobalIndex: (index: number) => {
          this.globalSackIndex = index;
        },
        setViewIndex: (index: number) => {
          this.sackIndex = index;
        },
        setViewSlice: (index: number) => {
          this.sliceIndexSack = index;
        },
      });
    } else {
      this.updateNavigationDown({
        globalIndex: this.globalFolderIndex,
        allChips: CHIPS_M.chipsFolder,
        moveId: (id: string) => {
          this.removeFolderID = id;
        },
        isSack: false,
        viewIndex: this.folderIndex,
        viewSlice: this.sliceIndexFolder,
        setGlobalIndex: (index: number) => {
          this.globalFolderIndex = index;
        },
        setViewIndex: (index: number) => {
          this.folderIndex = index;
        },
        setViewSlice: (index: number) => {
          this.sliceIndexFolder = index;
        },
      });
    }
  }
  updateNavigationUp({
    moveId,
    globalIndex,
    allChips,
    isSack,
    setGlobalIndex,
    viewIndex,
    viewSlice,
    setViewIndex,
    setViewSlice,
  }: {
    moveId: (id: string) => void;
    globalIndex: number;
    allChips: BattleShip[];
    isSack: boolean;
    setGlobalIndex: (index: number) => void;
    viewIndex: number;
    viewSlice: number;
    setViewIndex: (index: number) => void;
    setViewSlice: (index: number) => void;
  }) {
    if (globalIndex - 1 <= 0) {
      globalIndex = 0;
    } else {
      globalIndex -= 1;
    }
    moveId(
      isSack ? allChips[globalIndex]?.id : allChips[globalIndex]?.idForMove
    );
    if (viewIndex - 1 >= 0) {
      viewIndex -= 1;
    } else if (viewIndex <= 0) {
      if (viewSlice > 0) {
        viewSlice -= 1;
      }
    }

    setGlobalIndex(globalIndex);
    setViewIndex(viewIndex);
    setViewSlice(viewSlice);
  }
  updateNavigationDown({
    globalIndex,
    allChips,
    moveId,
    isSack,
    viewIndex,
    viewSlice,
    setGlobalIndex,
    setViewIndex,
    setViewSlice,
  }: {
    globalIndex: number;
    allChips: BattleShip[];
    moveId: (id: string) => void;
    isSack: boolean;
    viewIndex: number;
    viewSlice: number;
    setGlobalIndex: (index: number) => void;
    setViewIndex: (index: number) => void;
    setViewSlice: (index: number) => void;
  }) {
    if (globalIndex + 1 >= allChips.length - 1) {
      globalIndex = allChips.length - 1;
    } else {
      globalIndex += 1;
    }
    moveId(
      isSack ? allChips[globalIndex]?.id : allChips[globalIndex]?.idForMove
    );
    //sack side
    if (viewIndex + 1 <= 6) {
      viewIndex += 1;
    } else if (viewIndex >= 6) {
      if (viewSlice + 7 < allChips.length) viewSlice += 1;
    }
    setGlobalIndex(globalIndex);
    setViewIndex(viewIndex);
    setViewSlice(viewSlice);
  }

  draw(
    deltaTime: number,
    c: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    if (this.viewSack) {
      this.frameX += deltaTime * 2.5;
      if (this.frameX >= this.frameXLimit - 38) {
        this.frameX = this.frameXLimit - 38;
      }
    } else {
      this.frameX -= deltaTime * 2.5;
      if (this.frameX <= 0) {
        this.frameX = 0;
      }
    }
    c.save();
    c.translate(0 - this.frameX, 0);

    // super.draw(deltaTime, c, canvas);
    c.drawImage(
      this.image,
      this.x,
      this.y,
      this.width,
      this.height,
      0,
      0,
      430 * 2,
      430
    );
    // this.optionsButtons.draw(c);
    //TODO: Folder chips

    this.drawChipsCategory({
      c,
      indexSlice: this.sliceIndexFolder,
      indexToShow: this.folderIndex,
      xBlackArronws: 280,
      xGreenArronws: 190,
      xtextNameChips: 223,
      xBigImage: 50,
      chipsToShow: CHIPS_M.chipsFolder,
    });
    //TODO: sacks chips
    this.drawChipsCategory({
      c,
      indexSlice: this.sliceIndexSack,
      indexToShow: this.sackIndex,
      xBlackArronws: 550,
      xGreenArronws: 450,
      xtextNameChips: 480,
      xBigImage: 730,
      chipsToShow: CHIPS_M.chipsSack, //CHIPS_M.randomChip,
    });
    c.restore();
  }
  drawChipsCategory({
    c,

    indexSlice,
    indexToShow,
    xBlackArronws,
    xGreenArronws,
    xtextNameChips,
    xBigImage,
    chipsToShow,
  }: {
    c: CanvasRenderingContext2D;
    indexSlice: number;
    indexToShow: number;
    xBlackArronws: number;
    xGreenArronws: number;
    xtextNameChips: number;
    xBigImage: number;
    chipsToShow: BattleShip[];
  }) {
    const chips = chipsToShow.slice(indexSlice, indexSlice + 7);
    // Arrows
    if (indexSlice > 0) {
      c.drawImage(this.arrowBlackImageup, xBlackArronws, 54, 28, 28);
    }
    if (indexSlice + 7 < chipsToShow.length) {
      c.drawImage(this.arrowBlackImagedown, xBlackArronws, 404, 28, 28);
    }

    chips.forEach((chip, index) => {
      if (index == indexToShow) {
        //big image
        chips[indexToShow].drawFullImage(c, xBigImage, 50);

        //green arrow
        c.drawImage(this.arrowImage, xGreenArronws, 94 + index * 44, 28, 28);
      }
      //name
      chip.drawName(c, xtextNameChips, 113 + index * 44);
    });
  }

  checkClick(mouseX: number, mouseY: number) {
    // this.optionsButtons.checkClick(mouseX, mouseY);
  }
  checkKey(e: KeyboardEvent) {
    // this.optionsButtons.keyDown(e);
  }

  in() {
    this.moveToFolderID = CHIPS_M.chipsSack[0].id;
    this.removeFolderID = CHIPS_M.chipsFolder[0]?.idForMove || "N/A";

    document.addEventListener("keydown", this.homeKey);
  }
  out() {
    document.removeEventListener("keydown", this.homeKey);
    this.viewSack = false;
  }
}
