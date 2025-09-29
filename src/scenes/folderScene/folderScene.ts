import { GAME } from "@/scenes/sceneManager";
import SceneRoot from "../sceneROOT";

import { CHIPS_MANAGER } from "@/core/chipsManager";

import { BattleShip } from "@/data/player/player/chips/battleChip";
import { keyBindings } from "@/config/keyBindings";
import { INPUT_MANAGER, inputStateKeys } from "@/input/inputManager";
import { GreenArrow } from "@/UI/greenArrow";
import { BATTLE_MANAGER } from "@/core/battleManager";

export class FolderScene extends SceneRoot {
  bg = null;
  nameScene = inputStateKeys.FOLDER_SCENE;
  image = new Image();
  greenArrow: GreenArrow;
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
    this.greenArrow = new GreenArrow();
    this.arrowBlackImageup.src = "/assects/UI/BlackArrowup.png";
    this.arrowBlackImagedown.src = "/assects/UI/BlackArrowdown.png";

    INPUT_MANAGER.addState(this.nameScene, {
      onKeyDown: (e: KeyboardEvent) => {
        const options = {
          arrowup: () => {
            this.upIndex();
          },
          arrowdown: () => {
            this.downIndex();
          },
          arrowleft: () => {
            this.viewSack = false;
          },
          arrowright: () => {
            this.viewSack = true;
          },
          [keyBindings.pressA]: () => {
            this.keySelectChip();
          },
          [keyBindings.pressB]: () => {
            if (CHIPS_MANAGER.chipsFolder.length >= 29) {
              GAME.returnToPreviousScene();
            } else {
              BATTLE_MANAGER.dialogue.showMessage([
                "No is a good idea",
                "go with least 30 chips",
                "in the folder",
              ]);
            }
          },
        };
        if (options[e.key.toLowerCase()]) {
          options[e.key.toLowerCase()]();
        }
      },
      // onKeyUp
    });
  }

  keySelectChip = () => {
    if (this.viewSack) {
      CHIPS_MANAGER.addChipToFolder(this.moveToFolderID);
    } else {
      if (this.globalFolderIndex - 1 > 0) {
        this.globalFolderIndex -= 1;
      }
      this.folderIndex = this.folderIndex - 1 > 0 ? this.folderIndex - 1 : 0;
      this.sliceIndexFolder =
        this.sliceIndexFolder - 1 > 0 ? this.sliceIndexFolder - 1 : 0;
      CHIPS_MANAGER.removeChipFromFolder(this.removeFolderID);
      this.removeFolderID = CHIPS_MANAGER.chipsFolder[this.folderIndex]?.id;
    }
  };
  upIndex = () => {
    if (this.viewSack) {
      this.updateNavigationUp({
        globalIndex: this.globalSackIndex,
        allChips: CHIPS_MANAGER.chipsSack,
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
        allChips: CHIPS_MANAGER.chipsFolder,
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
        allChips: CHIPS_MANAGER.chipsSack,
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
        allChips: CHIPS_MANAGER.chipsFolder,
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

  draw(deltaTime: number, c: CanvasRenderingContext2D) {
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

    c.fillText(`${CHIPS_MANAGER.chipsFolder.length}`, 320, 30);
    // this.optionsButtons.draw(c);
    //TODO: Folder chips

    this.drawChipsCategory({
      c,
      indexSlice: this.sliceIndexFolder,
      indexToShow: this.folderIndex,
      xBlackArronws: 280,
      xGreenArronws: 190,
      xtextNameChips: 415,
      xBigImage: 50,
      chipsToShow: CHIPS_MANAGER.chipsFolder,
      deltaTime,
      category: "folder",
    });
    //TODO: sacks chips
    this.drawChipsCategory({
      c,
      indexSlice: this.sliceIndexSack,
      indexToShow: this.sackIndex,
      xBlackArronws: 550,
      xGreenArronws: 450,
      xtextNameChips: 675,
      xBigImage: 730,
      chipsToShow: CHIPS_MANAGER.chipsSack,
      deltaTime,
      //CHIPS_MANAGER.randomChip,
      category: "sack",
    });
    c.restore();
    BATTLE_MANAGER.dialogue.draw(c, deltaTime);
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
    deltaTime,
    category,
  }: {
    c: CanvasRenderingContext2D;
    indexSlice: number;
    indexToShow: number;
    xBlackArronws: number;
    xGreenArronws: number;
    xtextNameChips: number;
    xBigImage: number;
    chipsToShow: BattleShip[];
    deltaTime: number;
    category: "folder" | "sack";
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
        this.greenArrow.draw(
          c,
          { x: xGreenArronws + 5, y: 85 + index * 44 },
          deltaTime
        );
        // c.drawImage(this.arrowImage, xGreenArronws, 94 + index * 44, 28, 28);
      }
      //name
      if (category === "folder") {
        chip.drawName(c, xtextNameChips, 113 + index * 44);
      } else {
        const isSelected = CHIPS_MANAGER.chipsFolder
          .map((chip) => chip.name)
          .includes(chip.name);
        // console.log("xtextNameChips", chip.name);
        chip.drawName(c, xtextNameChips, 113 + index * 44, "", !isSelected);
      }
    });
  }

  checkClick(_: number, __: number) {
    // this.optionsButtons.checkClick(mouseX, mouseY);
  }
  checkKey(_: KeyboardEvent) {
    // this.optionsButtons.keyDown(e);
  }

  in() {
    this.moveToFolderID = CHIPS_MANAGER.chipsSack[0].id;
    this.removeFolderID = CHIPS_MANAGER.chipsFolder[0]?.idForMove || "N/A";
    INPUT_MANAGER.setState(this.nameScene);
  }
  out() {
    this.viewSack = false;
  }
}
