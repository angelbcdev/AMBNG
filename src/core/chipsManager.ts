import { BattleShip, IChips } from "../data/chips/battleChip";
import { allChipsA } from "../data/chips/chipData";
import { BATTLE_MANAGER } from "./battleManager";

const chipInGame = allChipsA
  .sort(() => Math.random() - 0.5)
  .map((chip) => {
    return new BattleShip({ title: BattleShip.title.addlinePanel });
  });

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
    // this.chipsFolder = chipInGame.filter((chip) => chip.isInFolder);
  }

  addChipToFolder(id: string) {
    if (this.chipsFolder.length >= this.maxChipFolder) {
      BATTLE_MANAGER.dialogue.showMessage([
        "Folder is full",
        `You have ${this.chipsFolder.length} chips`,
        "remove a chip from the folder",
      ]);
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
