import { BattleShip } from "@/data/player/player/chips/battleChip";

export class ChipDisplayRenderer {
  drawChipBigImage(
    c: CanvasRenderingContext2D,
    chipArea: BattleShip[][],
    chipInView: { viewX: number; viewY: number },
    positionX: number,
    positionY: number
  ): void {
    if (chipArea.length < 1) return;

    let chip;
    try {
      chip = chipArea[chipInView.viewY][chipInView.viewX];
    } catch (_) {}

    if (chipInView.viewX < 5 && chip) {
      chip.drawFullImage(c, positionX, positionY + 64);
    } else {
      this.drawNoChipSelected(c, positionX, positionY);
    }
  }

  private drawNoChipSelected(
    c: CanvasRenderingContext2D,
    positionX: number,
    positionY: number
  ): void {
    const noChip = {
      titleA: "NO DATA",
      titleB: "SELECTED ",
      parrA: "choose",
      parrB: "a chip",
    };

    c.fillStyle = "#8A2BE2";
    c.fillRect(positionX, 70, 164, 150);
    c.fillStyle = "#ffffff";
    c.fillText(noChip.titleA, positionX + 72, 96);
    c.fillText(noChip.titleB, positionX + 88, 126);
    c.strokeStyle = "#ffff";
    c.strokeRect(positionX, 74, 156, 80);
    c.font = "12px Mega-Man-Battle-Network-Regular";
    c.fillText(noChip.parrA, positionX + 72, 176);
    c.fillText(noChip.parrB, positionX + 72, 206);
  }
}
