import { BattleShip } from "./battleChip";
import { allChipsA, ChipData } from "./chipData";

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
      chip.idForMove = getRandomeIDforMove();
      this.chipsFolder.push(chip);
    }
  }
  removeChipFromFolder(id: string) {
    this.chipsFolder = this.chipsFolder.filter((c) => c.idForMove !== id);
  }
}

export const CHIPS_M = ChipManager.getInstance();

export const getRandomeIDforMove = () => {
  const charactes =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomID = "";
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * charactes.length);
    randomID += charactes.charAt(randomIndex);
  }
  return randomID;
};
