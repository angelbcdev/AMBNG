// import { BottonCanvas } from "./botonCanvas";

import { keyBindings } from "@/config/keyBindings";

import { GAME } from "@/scenes/sceneManager";

import { ENTITY_MANAGER } from "@/core/entityManager";
import { getImageFromAssetsManager } from "@/core/assetshandler/assetHelpers";

// import { Dialogue } from "./dialoque";

export class BattleUI {
  img = new Image();
  frameX = 0;
  frameY = 0;
  frameWidth = 372;
  frameHeight = 48;
  size = 300;
  maxFrame = 2;
  position = {
    x: 110,
    y: -10,
  };
  frameTime = 0;
  frameInterval = 1000 / 6;

  toCheckDev: Array<{ title: string; data: string | number }> = [];
  // chipSelected = new ShowChipAreaWithChip(this);
  clearImage = new Image();
  clearImageViewPort = 420;
  clearImageWidth = 1029;
  clearImageHeight = 710;
  clearImageisVisible = true;
  clearImagePosition = { x: 5, y: 50 };

  constructor() {
    this.img = getImageFromAssetsManager("ui:barWait");
    this.position = {
      x: 90,
      y: -10,
    };
    this.clearImage = getImageFromAssetsManager("ui:clearBattle");
    this.clearImagePosition = { x: -this.clearImageViewPort, y: 50 };
  }
  clearStateImg(
    c: CanvasRenderingContext2D,
    deltaTime: number,
    totalTimeInBattle: number
  ) {
    if (this.clearImagePosition.x < 5) {
      this.clearImagePosition = {
        ...{
          y: this.clearImagePosition.y,
          x: (this.clearImagePosition.x += 0.8 * deltaTime),
        },
      };
    }

    c.drawImage(
      this.clearImage,
      0,
      0,
      this.clearImageWidth,
      this.clearImageHeight,
      this.clearImagePosition.x,
      this.clearImagePosition.y,
      this.clearImageViewPort,
      280
    );
    this.showText(c, "Stage Clears", {
      x: this.clearImagePosition.x + 200,
      y: this.clearImagePosition.y + 64,
    });
    const minutes = Math.floor(totalTimeInBattle / 60);
    const seconds = totalTimeInBattle % 60;
    this.showText(c, `Time    M${minutes}  S${seconds}`, {
      x: this.clearImagePosition.x + 200,
      y: this.clearImagePosition.y + 116,
    });
  }
  draw(c: CanvasRenderingContext2D) {
    // this.(c);

    this.drawLivePlayer(c);
    this.showAllAlerts(c);

    this.showDetails(c);
  }

  showDetails(c: CanvasRenderingContext2D) {
    const x = 340;
    const y = 70;
    // if (this.game == null) {
    //   return;
    // }

    this.toCheckDev.forEach((dev, index) => {
      this.showText(c, dev.title, { x: x, y: index * 20 + y }, 8);
      this.showText(c, dev.data, { x: x + 50, y: index * 20 + y }, 8);
    });
  }
  updateFrame(
    c: CanvasRenderingContext2D,
    deltaTime: number,
    isCompletedBarShip: boolean
  ) {
    if (isCompletedBarShip) {
      this.frameTime += deltaTime;
      if (this.frameTime > this.frameInterval) {
        this.frameTime = 0;
        // if (!this.game.isPlayerSelectChip) {
        //   this.frameX++;
        // } else {
        //   this.frameX = this.maxFrame;
        // }
        if (this.frameX > this.maxFrame) {
          this.frameX = 0;
        }
      }
      this.showMSJBar(c);
    } else {
      this.frameX = 0;
    }
  }
  paintBarContainer(c: CanvasRenderingContext2D) {
    c.drawImage(
      this.img,
      this.frameX * this.frameWidth,
      this.frameY * this.frameHeight,
      this.frameWidth,
      this.frameHeight,
      this.position.x,
      this.position.y,

      this.size,
      this.frameHeight
    );
  }

  showMSJBar(c: CanvasRenderingContext2D) {
    c.save();
    c.translate(this.position.x, 0);
    c.font = "16px 'Mega-Man-Battle-Network-Regular'"; // Nombre que has definido en @font-face
    c.fillStyle = this.frameX == 0 ? "#ff0000" : "#000fff"; // Color del texto
    c.textAlign = "center"; // Alineación horizontal
    c.textBaseline = "middle"; // Alineación vertical

    const msj = `
      ${keyBindings.pressL}
      Press
      ${keyBindings.pressR}`;
    c.fillText(msj, 140, this.position.y + 38.5);
    c.fillStyle = this.frameX == 0 ? "#d6d6d6" : "#fdfddf"; // Color del texto
    c.fillText(msj, 142, this.position.y + 38);
    c.restore();
  }
  checkClick(x: number, y: number): void {
    void x;
    void y;
  }
  drawLivePlayer(c: CanvasRenderingContext2D) {
    const x = this.position.x - 70;
    const y = this.position.y + 25;
    const w = 60;
    const h = 28;
    c.fillStyle = "blue";

    c.fillRect(x - 3, y - 3, w + 6, h + 6);
    c.fillStyle = "blue";
    c.fillStyle = "black";

    c.fillRect(x, y, w, h);
    c.fillStyle = "blue";

    //*PAIN CURRENT LIVE OF PLAYER
    this.showText(c, ENTITY_MANAGER.player.live, {
      x: x + 30,
      y: y + 16,
    });
  }
  showText(
    c: CanvasRenderingContext2D,
    msj: string | number,
    posición: { x: number; y: number },
    font: number = 16
  ) {
    c.font = "" + font + "px 'Mega-Man-Battle-Network-Regular'"; // Nombre que has definido en @font-face
    c.fillStyle = "#484848"; // Color del texto
    c.textAlign = "center"; // Alineación horizontal
    c.textBaseline = "middle"; // Alineación vertical
    c.fillText(` ${msj}`, posición.x + 0.5, posición.y + 0.5);
    // Nombre que has definido en @font-face
    c.fillStyle = "#fdfddf"; // Color del texto
    c.fillText(`${msj}`, posición.x, posición.y);
  }
  showAllAlerts(c: CanvasRenderingContext2D) {
    // if (this.game.gameIsPaused && this.game.hasEnemys) {
    if (!GAME.hasFocus()) {
      this.showText(c, "Paused", { x: 210, y: 100 });
    }
    // }
    // if (!this.game.hasEnemys) {
    //   this.showText(c, "Stage Clears", { x: 210, y: 100 });
  }
}
