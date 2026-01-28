import { DIALOGUE_MANAGER } from "@/scenes/worldScene/sources/isoLanDialogue";
import { BattleShip, IChips } from "../data/chips/battleChip";
import { allChipsA } from "../data/chips/chipData";
import { BATTLE_MANAGER } from "./battleManager";

const chipInGame = allChipsA
  .sort(() => Math.random() - 0.5)
  .map((chip) => {
    return new BattleShip({ title: chip.title });
  });
//chip.title
//BattleShip.title.addlinePanel

DIALOGUE_MANAGER.addCharacter("megaman", "folderFull", [
  [
    "Folder is full",
    `You have 25 chips`,
    "remove a chip from the folder",
    "first!!!",
  ],
  [
    `we have 25 chips`,
    "in our folder we must have",
    "between 20 and 25 chips",
    "",
  ],
]);
export class ChipManager {
  static instance: ChipManager | null = null;
  chipsSack: BattleShip[] = chipInGame;
  minChipFolder = 20;
  maxChipFolder = 25;
  chipsFolder: BattleShip[] = [];

  chipsForBattle: BattleShip[] = [];

  // chip show in area selector
  chipArea: BattleShip[][] = [[]];

  // chip show in selected area
  chipSelected: BattleShip[] = [];

  // chip name of selected area
  chipSelecteInTurn: string[] = [];

  // chip name of all chips used
  chipUsed: string[] = [];

  constructor() {
    this.chipsFolder = chipInGame.filter((chip) => chip.isInFolder);
  }
  isFolderFull() {
    return this.chipsFolder.length >= this.minChipFolder;
  }

  static getInstance() {
    if (!ChipManager.instance) {
      ChipManager.instance = new ChipManager();
    }
    return ChipManager.instance;
  }
  refreshFolder() {
    this.chipsFolder = chipInGame.filter((chip) => chip.isInFolder);
  }

  addChipToFolder(id: string) {
    if (this.chipsFolder.length >= this.maxChipFolder) {
      const msj = DIALOGUE_MANAGER.getRandomLine("megaman", "folderFull");

      BATTLE_MANAGER.dialogue.showMessage(msj);
      return;
    }
    const chip = this.chipsSack.find((c) => c.id === id);
    if (chip) {
      chip.addInFolder();
    }
    this.refreshFolder();
  }
  removeChipFromFolder(id: string) {
    const chip = this.chipsFolder.find((c) => c.id === id);
    console.log("chip", chip);

    if (chip) {
      chip.removeInFolder();
    }
    this.refreshFolder();
  }
  getSpecificChip() {
    return allChipsA.map((_) => {
      return new BattleShip({ title: IChips.block });
    });
  }

  shuffleChip() {
    return this.chipsFolder.sort(() => Math.random() - 0.5);
  }
  startBattle() {
    this.chipsForBattle = this.shuffleChip();
    this.chipArea = [[], [], []];
    this.chipSelected = [];
    this.chipSelecteInTurn = [];
    this.chipUsed = [];
  }
}

export const CHIPS_MANAGER = ChipManager.getInstance();
