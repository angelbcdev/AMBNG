import PlayerBlue from "@/data/player/player/Player";
import Attack from "@/data/attacks/attacks";
import { allChipsA, ChipData } from "./chipData";
import { FLOOR_MANAGER } from "@/core/floorManager";
import { ENTITY_MANAGER } from "@/core/entityManager";

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
  id: string;
  idForMove: string = "N/A";

  constructor({ title }: { title: string }) {
    const currentChip = allChipsA.find(
      (chip) => chip.title === title
    ) as ChipData;
    this.id = getRandomeIDforMove();
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
    const realX =
      x < 7
        ? (x * this.with) / this.size + x + 7
        : ((x - 7) * this.with) / this.size + x;

    const realY = x < 7 ? 50 : 90 + 3;
    try {
      c.fillStyle = x == 0 ? "red" : "blue";
      c.fillRect(realX - 3, realY - 3, this.with / 1.9, this.height / 1.9);
      c.drawImage(this.image, realX, realY, this.with / 2.2, this.height / 2.2);

      if (this.damage > 0) {
        this.showDamage(c, realX, realY);
      }
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

    const live = this.damage > 0 ? `${this.damage}` : "";
    c.fillText(live, realX + 8, realY + 6);
  }
  userMakeAttack(player: PlayerBlue) {
    console.log("this.actionForChip", this.actionForChip);
    this.changeFMS(player);
    switch (this.actionForChip) {
      case "attack":
        this.createAttack(player);
        break;
      case "fieldChange":
        setTimeout(() => {
          FLOOR_MANAGER[this.gamechange](player, this.chipType);
        }, this.timeForAttack);

        break;
      case "heal":
        player.live += this.liveToHeal;
        break;

      case "addElement":
        setTimeout(() => {
          ENTITY_MANAGER[this.gamechange]({
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
  drawName(
    c: CanvasRenderingContext2D,
    x: number,
    y: number,
    extraX: string = ""
  ) {
    c.font = "16px 'Mega-Man-Battle-Network-Regular'";

    c.fillStyle = "black";
    c.fillText(this.name + (extraX ? `-${extraX}` : ""), x, y);

    c.fillStyle = "white";
    c.fillText(this.name + (extraX ? `-${extraX}` : ""), x - 3, y - 3);
  }
}

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

export const allChips = [...allChipsA];
