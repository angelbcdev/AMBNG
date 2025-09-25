import { BattleShip } from "@/data/player/player/chips/battleChip";

export class MessageRenderer {
  drawMessage(
    c: CanvasRenderingContext2D,
    chipSelected: BattleShip[],
    showAddChip: boolean,
    positionX: number,
    _: number
  ): void {
    const hasChip = chipSelected.length > 0;
    const noChip = {
      titleA: "NO DATA",
      titleB: "SELECTED ",
      parrA: "choose",
      parrB: "a chip",
    };
    const withChip = {
      titleA: "CHIP DATA",
      titleB: "TRANSFER",
      parrA: "Sending",
      parrB: "chip data...",
    };
    const addMSJ = {
      titleA: "ADDITIONAL",
      titleB: "CHIP DATA",
      parrA: "+5 chips",
      parrB: "in 1 turnt",
    };

    let currentMSJ = hasChip ? withChip : noChip;

    if (chipSelected.length == 0 && !showAddChip) {
      currentMSJ = addMSJ;
    }

    c.fillStyle = "#8A2BE2";
    c.fillRect(positionX, 70, 164, 150);
    c.fillStyle = "#ffffff";
    c.fillText(currentMSJ.titleA, positionX + 72, 96);
    c.fillText(currentMSJ.titleB, positionX + 88, 126);
    c.strokeStyle = "#ffff";
    c.strokeRect(positionX, 74, 156, 80);
    c.font = "12px Mega-Man-Battle-Network-Regular";
    c.fillText(currentMSJ.parrA, positionX + 72, 176);
    c.fillText(currentMSJ.parrB, positionX + 72, 206);
  }
}
