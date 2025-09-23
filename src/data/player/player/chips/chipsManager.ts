import { BattleShip } from ".";
import { allChipsA, ChipData } from "./chipData";

export class ChipManager {
  static instance: ChipManager | null = null;
  allChips: BattleShip[] = [];
  randomChip = allChipsA
    .sort(() => Math.random() - 0.5)
    .map((chip) => {
      return new BattleShip({ title: chip.title });
    });

  constructor() {}

  static getInstance() {
    if (!ChipManager.instance) {
      ChipManager.instance = new ChipManager();
    }
    return ChipManager.instance;
  }
  addChip(chips: BattleShip[]) {
    this.allChips = chips;
  }
  clearShips() {
    this.allChips = [];
  }
}

export const CHIPS_M = ChipManager.getInstance();
