import BeeTank from "../../enemys/Character/beeTank/beetank";
import { Mettols } from "../../enemys/Character/mettol/mettol";
import { Game } from "../../game";

import { BottonCanvas } from "./botonCanvas";
import { ShowChipAreaWithChip } from "./chipAreaSelector";

const allEnemies = [Mettols, BeeTank];

export class GameUI {
  game: Game;
  img = new Image();
  frameX = 0;
  frameY = 0;
  frameWidth = 372;
  frameHeight = 48;
  size = 300;
  maxFrame = 2;
  position = {
    x: 90,
    y: -10,
  };
  frameTime = 0;
  frameInterval = 1000 / 6;
  sizeBar = 256;
  testButon = [
    new BottonCanvas({ position: { x: 320, y: 380 }, title: "Chips" }),
    new BottonCanvas({
      position: { x: 180, y: 380 },
      title: "ADD Enemy",
      isAviable: true,
    }),
  ];
  toCheckDev: any[] = [];
  chipSelected = new ShowChipAreaWithChip(this);

  constructor(game: Game) {
    this.img.src = "assects/UI/barWait.png";
    this.game = game;
    this.position = {
      x: 90,
      y: -10,
    };
  }
  draw(c: CanvasRenderingContext2D, deltaTime: number) {
    this.paintBarContainer(c);
    this.fillBar(c);
    this.updateFrame(c, deltaTime);
    this.testButon.forEach((botton) => {
      if (botton.title == "Chips") {
        botton.isAviable = this.game.isCompletedBarShip;
      }
      botton.draw(c);
    });
    this.drawLivePlayer(c);
    this.showAllAlerts(c);
    this.game.players[0].showChipts(c, deltaTime);
    if (this.game.isDev) {
      this.showDetails(c);
    }
    this.chipSelected.draw(c, deltaTime);
  }
  setDevData() {
    this.toCheckDev = [
      {
        title: "state",
        data: this.game?.players[0]?.currentState?.name || "no data",
      },
      {
        title: "shoot",
        data: this.game?.players[0]?.canShoot,
      },
      {
        title: "damage",
        data:
          this.game?.players[0]?.damage + this.game?.players[0]?.damageExtra,
      },
    ];
  }
  showDetails(c: CanvasRenderingContext2D) {
    const x = 340;
    const y = 70;
    if (this.game == null) {
      return;
    }
    this.setDevData();
    this.toCheckDev.forEach((dev, index) => {
      this.showText(c, dev.title, { x: x, y: index * 20 + y }, 8);
      this.showText(c, dev.data, { x: x + 50, y: index * 20 + y }, 8);
    });
  }
  updateFrame(c: CanvasRenderingContext2D, deltaTime: number) {
    if (this.game.isCompletedBarShip) {
      this.frameTime += deltaTime;
      if (this.frameTime > this.frameInterval) {
        this.frameTime = 0;
        if (!this.game.isPlayerSelectChip) {
          this.frameX++;
        } else {
          this.frameX = this.maxFrame;
        }
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
  fillBar(c: CanvasRenderingContext2D) {
    const currentProgressBarr =
      (this.game.currentTimeForSelectShip / this.game.timeForSelectShip) *
      this.sizeBar;
    c.fillStyle = this.game.isCompletedBarShip ? "#ffff0050" : "#ff003059";
    c.fillRect(
      this.position.x + 22,
      this.position.y + 28,
      currentProgressBarr,
      this.frameHeight - 33
    );
  }
  showMSJBar(c: CanvasRenderingContext2D) {
    c.save();
    c.translate(this.position.x, 0);
    c.font = "16px 'Mega-Man-Battle-Network-Regular'"; // Nombre que has definido en @font-face
    c.fillStyle = this.frameX == 0 ? "#ff0000" : "#000fff"; // Color del texto
    c.textAlign = "center"; // Alineación horizontal
    c.textBaseline = "middle"; // Alineación vertical
    c.fillText(`Press Space`, 140, this.position.y + 38.5);
    c.fillStyle = this.frameX == 0 ? "#d6d6d6" : "#fdfddf"; // Color del texto
    c.fillText(`Press Space`, 142, this.position.y + 38);
    c.restore();
  }
  checkClick(mouseX: number, mouseY: number) {
    let isPress = false;
    this.testButon.forEach((botton) => {
      const result = botton.checkClick(mouseX, mouseY);
      if (result && !isPress) {
        switch (result) {
          case "Chips":
            // this.game.showAreaSelecteShip();
            this.chipSelected.showArea();

            break;
          case "ADD Enemy":
            isPress = true;

            const randomeEnemy =
              allEnemies[Math.floor(Math.random() * allEnemies.length)];
            const randomPosition = {
              x: Math.floor(Math.random() * 2),
              y: Math.floor(Math.random() * 2),
            };
            const randomLevel = Math.floor(Math.random() * 3);
            this.game.addNewEnemy({
              newEnemy: randomeEnemy,
              position: randomPosition,
              level: randomLevel,
            });

            break;
        }
      }
    });
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

    this.showText(c, this.game.players[0].live, { x: x + 30, y: y + 16 });
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
    if (this.game.gameIsPaused && this.game.hasEnemys) {
      this.showText(c, "Paused", { x: 210, y: 100 });
    }
    if (!this.game.hasEnemys) {
      this.showText(c, "Stage Clear", { x: 210, y: 100 });
    }
  }
}
