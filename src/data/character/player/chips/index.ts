import PlayerBlue from "../playerBlue";
import Attack from "../../attacks/attacks";
import { allChipsA, ChipData } from "./chipData";

export const IChips = {
  maze: "maze",
  bomb: "bomb",
  cannons: "cannons",
  swords: "swords",
  shield: "shield",
  punsh: "punsh",
  block: "block",
  breackPanel: "breackPanel",
  dash: "dash",
  healt80: "healt80",
  pannel1: "pannel1",
  pannel3: "pannel3",
  addlinePanel: "addlinePanel",
  randomeFloor: "randomeFloor",
};

export class BattleShip {
  static title = {
    maze: "maze",
    bomb: "bomb",
    cannons: "cannons",
    swords: "swords",
    shield: "shield",
    punsh: "punsh",
    block: "block",
    breackPanel: "breackPanel",
    dash: "dash",
    healt80: "healt80",
    pannel1: "pannel1",
    pannel3: "pannel3",
    addlinePanel: "addlinePanel",
    randomeFloor: "randomeFloor",
  };
  image: HTMLImageElement = new Image();
  with = 94;
  height = 84;
  posición = { x: 0, y: 0 };
  chipType: string | number;
  size: 2;
  class: string;
  damage: number;
  chipProyectile: Attack;
  actionForChip: string;
  name: string;
  gamechange: string;
  timeForAttack: number;
  liveToHeal: number;
  finiteMachine: string;
  spriteState: string;
  elementToAdd: string;

  constructor({ title }: { title: string }) {
    const currentChip = allChipsA.find(
      (chip) => chip.title === title
    ) as ChipData;
    this.image.src = currentChip.image;
    this.name = currentChip.title;
    this.chipType = currentChip.chipType;
    this.class = currentChip.clase;
    this.chipProyectile = currentChip.chipProyectile;
    this.size = 2;
    this.damage = currentChip?.damage || 0;
    this.actionForChip = currentChip.actionForChip;
    this.gamechange = currentChip.gamechange;
    this.liveToHeal = currentChip.liveToHeal;
    this.spriteState = currentChip.spriteState;
    this.finiteMachine = currentChip.finiteMachine;
    this.timeForAttack = currentChip.timeForAttack;
    this.elementToAdd = currentChip.elementToAdd;
  }
  draw(c: CanvasRenderingContext2D, x: number, _: number) {
    let realX =
      x < 7
        ? (x * this.with) / this.size + x + 7
        : ((x - 7) * this.with) / this.size + x;

    let realY = x < 7 ? 50 : 90 + 3;
    try {
      c.fillStyle = x == 0 ? "red" : "blue";
      c.fillRect(realX - 3, realY - 3, this.with / 1.9, this.height / 1.9);
      c.drawImage(this.image, realX, realY, this.with / 2.2, this.height / 2.2);

      this.damage > 0 && this.showDamage(c, realX, realY);
    } catch (error) {}
  }
  drawIcon(c: CanvasRenderingContext2D, x: number, y: number) {
    c.drawImage(this.image, x, y, this.with / 2.6, this.height / 2.6);
  }
  drawFullImage(c: CanvasRenderingContext2D, x: number, y: number) {
    c.drawImage(this.image, x, y, this.with, this.height);
  }
  showDamage(c: CanvasRenderingContext2D, realX: number, realY: number) {
    c.font = "8px 'Mega-Man-Battle-Network-Regular'";
    c.fillStyle = "#00000080";
    c.fillRect(realX - 3, realY - 3, 24, 16);

    c.fillStyle = "white";

    let live = this.damage > 0 ? `${this.damage}` : "";
    c.fillText(live, realX + 8, realY + 6);
  }
  userMakeAttack(player: PlayerBlue) {
    this.changeFMS(player);
    switch (this.actionForChip) {
      case "attack":
        this.createAttack(player);
        break;
      case "fieldChange":
        setTimeout(() => {
          player.game[this.gamechange](player, this.chipType);
        }, this.timeForAttack);

        break;
      case "heal":
        player.live += this.liveToHeal;
        break;

      case "addElement":
        console.log("create a block ", this.gamechange);

        setTimeout(() => {
          player.game[this.gamechange]({
            element: this.elementToAdd,
            player,
          });
        });
        break;
      default:
        break;
    }
  }
  changeFMS(player: PlayerBlue) {
    if (this.spriteState != null) {
      player.spriteToShip = player.states[this.spriteState];
    }

    if (this.finiteMachine != null) {
      player.changeState(player.stateReference[this.finiteMachine]);
    }
  }
  createAttack(player: PlayerBlue) {
    setTimeout(() => {
      player.addAttack({
        typeElemetns: this.chipProyectile,
        damage: this.damage,
        type: this.chipType,
      });
    }, this.timeForAttack);
  }
}

//swords-long

//
//addNewEnemy

export const allChips = [...allChipsA];
