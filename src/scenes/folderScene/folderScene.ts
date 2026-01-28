import { GAME } from "@/scenes/sceneManager";
import SceneRoot from "../sceneROOT";

import { CHIPS_MANAGER } from "@/core/chipsManager";

import { BattleShip } from "@/data/chips/battleChip";
import { keyBindings } from "@/config/keyBindings";
import { INPUT_MANAGER, inputStateKeys } from "@/input/inputManager";
import { GreenArrow } from "@/UI/greenArrow";
import { BATTLE_MANAGER } from "@/core/battleManager";
import { DIALOGUE_MANAGER } from "../worldScene/sources/isoLanDialogue";

DIALOGUE_MANAGER.addCharacter("megaman", "askMoreChips", [
  [
    "It's not a good idea",
    `go with least ${CHIPS_MANAGER.minChipFolder} chips`,
    "in the folder",
  ],
  [
    "Come on we need ",
    "chips for the battle",
    "you choose between 20 ",
    "and 25",
  ],
]);
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

  // Simplificado: solo necesitamos un índice global por cada lista
  globalFolderIndex = 0;
  globalSackIndex = 0;

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
            console.log("keySelectChip");
          },
          [keyBindings.pressB]: () => {
            console.log("keySelectChip");
            if (CHIPS_MANAGER.isFolderFull()) {
              GAME.returnToPreviousScene();
            } else {
              const msj = DIALOGUE_MANAGER.getRandomLine(
                "megaman",
                "askMoreChips",
              );
              BATTLE_MANAGER.dialogue.showMessage(msj);
            }
          },
        };
        if (options[e.key.toLowerCase()]) {
          options[e.key.toLowerCase()]();
        }
      },
    });
  }

  showData() {
    console.log({
      viewSack: this.viewSack,
      globalFolderIndex: this.globalFolderIndex,
      globalSackIndex: this.globalSackIndex,
      currentChip: this.viewSack
        ? CHIPS_MANAGER.chipsSack[this.globalSackIndex]?.name
        : CHIPS_MANAGER.chipsFolder[this.globalFolderIndex]?.name,
    });
  }

  upIndex = () => {
    if (this.viewSack) {
      this.globalSackIndex = Math.max(0, this.globalSackIndex - 1);
    } else {
      this.globalFolderIndex = Math.max(0, this.globalFolderIndex - 1);
    }
  };

  downIndex = () => {
    if (this.viewSack) {
      this.globalSackIndex = Math.min(
        CHIPS_MANAGER.chipsSack.length - 1,
        this.globalSackIndex + 1,
      );
    } else {
      this.globalFolderIndex = Math.min(
        CHIPS_MANAGER.chipsFolder.length - 1,
        this.globalFolderIndex + 1,
      );
    }
  };

  keySelectChip = () => {
    if (this.viewSack) {
      // Agregar del sack al folder
      const chipToAdd = CHIPS_MANAGER.chipsSack[this.globalSackIndex];
      if (chipToAdd) {
        CHIPS_MANAGER.addChipToFolder(chipToAdd.id);
      }
    } else {
      // Remover del folder
      const chipToRemove = CHIPS_MANAGER.chipsFolder[this.globalFolderIndex];
      if (chipToRemove) {
        CHIPS_MANAGER.removeChipFromFolder(chipToRemove.id);

        // Ajustar el índice después de borrar
        if (this.globalFolderIndex >= CHIPS_MANAGER.chipsFolder.length) {
          this.globalFolderIndex = Math.max(
            0,
            CHIPS_MANAGER.chipsFolder.length - 1,
          );
        }
      }
    }
  };

  // Calcula el slice dinámicamente basado en el índice global
  private getViewSlice(globalIndex: number, totalItems: number): number {
    const VISIBLE_ITEMS = 7;

    if (totalItems <= VISIBLE_ITEMS) {
      return 0;
    }

    // La flecha se mueve hasta la posición 6, luego empieza el scroll
    if (globalIndex <= 6) {
      return 0;
    }

    // Cuando pasa la posición 6, hacer scroll manteniendo la flecha en posición 6
    const maxSlice = Math.max(0, totalItems - VISIBLE_ITEMS);
    return Math.min(globalIndex - 6, maxSlice);
  }

  // Calcula el índice visual dentro de la ventana visible
  private getViewIndex(globalIndex: number, sliceStart: number): number {
    return globalIndex - sliceStart;
  }

  draw(deltaTime: number, c: CanvasRenderingContext2D) {
    // Animación del frame
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

    c.drawImage(
      this.image,
      this.x,
      this.y,
      this.width,
      this.height,
      0,
      0,
      430 * 2,
      430,
    );

    c.fillText(`${CHIPS_MANAGER.chipsFolder.length}`, 320, 30);

    // Calcular slices e índices visuales dinámicamente
    const folderSlice = this.getViewSlice(
      this.globalFolderIndex,
      CHIPS_MANAGER.chipsFolder.length,
    );
    const folderViewIndex = this.getViewIndex(
      this.globalFolderIndex,
      folderSlice,
    );

    const sackSlice = this.getViewSlice(
      this.globalSackIndex,
      CHIPS_MANAGER.chipsSack.length,
    );
    const sackViewIndex = this.getViewIndex(this.globalSackIndex, sackSlice);

    // Dibujar folder chips
    this.drawChipsCategory({
      c,
      indexSlice: folderSlice,
      indexToShow: folderViewIndex,
      xBlackArronws: 280,
      xGreenArronws: 190,
      xtextNameChips: 415,
      xBigImage: 50,
      chipsToShow: CHIPS_MANAGER.chipsFolder,
      deltaTime,
      category: "folder",
    });

    // Dibujar sack chips
    this.drawChipsCategory({
      c,
      indexSlice: sackSlice,
      indexToShow: sackViewIndex,
      xBlackArronws: 550,
      xGreenArronws: 450,
      xtextNameChips: 675,
      xBigImage: 740,
      chipsToShow: CHIPS_MANAGER.chipsSack,
      deltaTime,
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
      if (index === indexToShow) {
        // Big image
        chip.drawFullImage(c, xBigImage, 50);

        // Green arrow
        this.greenArrow.draw(
          c,
          { x: xGreenArronws + 5, y: 85 + index * 44 },
          deltaTime,
        );
      }

      // Name
      if (category === "folder") {
        chip.drawName(c, xtextNameChips, 113 + index * 44);
      } else {
        const isSelected = CHIPS_MANAGER.chipsFolder
          .map((chip) => chip.name)
          .includes(chip.name);
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
    this.globalSackIndex = 0;
    this.globalFolderIndex = 0;
    INPUT_MANAGER.setState(this.nameScene);
  }

  out() {
    this.viewSack = false;
  }
}
