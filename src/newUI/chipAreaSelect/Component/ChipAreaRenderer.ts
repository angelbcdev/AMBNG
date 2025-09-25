import { ChipSelectorComponent } from "./chipSelectorComponent";
import { BattleShip } from "@/data/player/player/chips/battleChip";

export class ChipAreaRenderer {
  constructor(private chipSelector: ChipSelectorComponent) {}

  drawChipArea(
    c: CanvasRenderingContext2D,
    chipArea: BattleShip[][],
    chipSelected: BattleShip[],
    chipInView: { viewX: number; viewY: number },
    positionX: number,
    positionY: number
  ): void {
    chipArea.forEach((row, y) => {
      row.forEach((chip, x) => {
        const squareX = positionX + 1 + x * 42;
        const squareY = positionY + 278 + y * 40;

        c.save();

        if (chipSelected.includes(chip)) {
          c.globalAlpha = 0.7;
          c.fillStyle = "black";
          c.fillRect(squareX, squareY, 36, 35);
        }

        try {
          chip.drawIcon(c as CanvasRenderingContext2D, squareX, squareY);
        } catch (e) {}

        c.restore();

        if (chipInView.viewX === x && chipInView.viewY === y) {
          this.chipSelector.draw(c, squareX, squareY);
        }
      });
    });
  }

  drawChipSelected(
    c: CanvasRenderingContext2D,
    chipSelected: BattleShip[],
    chipArea: BattleShip[][],
    chipInView: { viewX: number; viewY: number },
    positionX: number,
    positionY: number
  ): void {
    chipSelected.forEach((chip, y) => {
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

      const squareX = positionX + 230;
      const squareY = positionY + gap;

      if (chip == null) return;

      chip.drawIcon(c, squareX, squareY);

      if (chip == chipArea[chipInView.viewY][chipInView.viewX]) {
        this.chipSelector.draw(c, squareX, squareY);
      }
    });
  }
}
