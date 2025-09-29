import { BattleShip } from "../data/player/player/chips/battleChip";
import { allChipsA } from "../data/player/player/chips/chipData";

export class ChipManager {
  static instance: ChipManager | null = null;
  chipsSack: BattleShip[] = [];
  chipsFolder: BattleShip[] = [];
  chipsForBattle: BattleShip[] = [];

  randomChip = allChipsA
    .sort(() => Math.random() - 0.5)
    .map((chip) => {
      return new BattleShip({ title: chip.title });
    });

  constructor() {
    this.chipsSack = allChipsA.map((chip) => {
      return new BattleShip({ title: chip.title });
    });
    this.chipsFolder = this.randomChip.slice(0, 5);
  }

  static getInstance() {
    if (!ChipManager.instance) {
      ChipManager.instance = new ChipManager();
    }
    return ChipManager.instance;
  }
  addChip(chip: BattleShip) {
    this.chipsForBattle.push(chip);
  }
  clearShips() {
    this.chipsForBattle = [];
  }
  addChipToFolder(id: string) {
    const chip = this.chipsSack.find((c) => c.id === id);
    if (chip) {
      this.chipsFolder.push(chip);
    }
  }
  removeChipFromFolder(id: string) {
    this.chipsFolder = this.chipsFolder.filter((c) => c.id !== id);
  }
}

export const CHIPS_MANAGER = ChipManager.getInstance();
