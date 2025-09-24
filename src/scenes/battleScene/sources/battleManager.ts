import { Entity } from "@/data/player/entity";
import { MATRIX_MANAGER } from "./matrixManager";
import PlayerBlue from "@/data/player/player/Player";

class BattleManager {
  static instance: BattleManager | null = null;
  effect = [];
  npc = [];
  player = new PlayerBlue({
    possition: { x: 1, y: 1 },
    sideToPlay: 0,
  });

  static getInstance() {
    if (!this.instance) this.instance = new BattleManager();
    return this.instance;
  }

  runFilters() {
    this.effect = this.effect.filter(
      (effect: Entity) => effect.delete !== true
    );

    this.npc = this.npc.filter((enemy: Entity) => {
      if (enemy.delete) {
        MATRIX_MANAGER.matrix[enemy.matrixY][enemy.matrixX].ocupated = false;
      }
      return enemy.delete !== true;
    });

    this.npc.forEach((enemy) => {
      enemy.AllattackToShow = enemy.AllattackToShow.filter(
        (attack) => attack.delete !== true
      );
    });
  }
  levelToPaintAttack(
    c: CanvasRenderingContext2D,
    deltaTime: number,
    row: number,
    isPaused: boolean
  ) {
    this.effect
      .filter((effect: any) => effect.initialMatrixY == row)
      .forEach((effect) => {
        effect.draw(c, deltaTime);
        if (isPaused) return;
        effect.update(c, deltaTime);
      });
  }
  //Ataks
  extractAttacks() {
    this.player.AllattackToShow = this.player.AllattackToShow.filter(
      (attack) => attack.delete !== true
    );

    const attacksPlayers = this.player.AllattackToShow;

    const attacksNpc = this.npc.map((npc) => npc.AllattackToShow).flat(1);
    this.effect = [...attacksPlayers, ...attacksNpc];
  }
  clearEntites() {
    this.effect = [];
    this.npc = [];
  }
  // Enemys
  addNewEnemy({ newEnemy, position, level }) {
    const enemy = new newEnemy({
      possition: { x: position.x, y: position.y },
      sideToPlay: this.player.side == 0 ? 1 : 0,
      level: level,
    });

    if (BATTLE_MANAGER.npc.length < 3) {
      enemy.game = this;

      BATTLE_MANAGER.npc.push(enemy);
    } else {
      alert("por el momento no se pueden agregar mas enemigos limitados a 2");
    }
  }

  validateCollisionEnemys() {
    this.npc.forEach((enemy: Entity) => {
      enemy.collisionArea(this.player);
    });
  }

  levelToPaint(
    c: CanvasRenderingContext2D,
    deltaTime: number,
    row: number,
    gameIsPaused: boolean
  ) {
    [...this.npc, this.player]
      .filter((entity) => entity.matrixY == row)
      .sort((a, b) => b.y - a.y)
      .forEach((entity: any) => {
        entity.collisionAttacks = this.effect;
        entity.draw(c, deltaTime);
        console.log(gameIsPaused);
        if (!gameIsPaused) {
          entity.update(c, deltaTime);
        }
      });
  }
  //players
  playerIsLive() {
    return this.player.live > 0;
  }
  resetPlayers() {
    this.player.live = 100;
    this.player.allChips = [];
  }

  getAllEntities() {
    return [...this.npc, this.player];
  }
}

export const BATTLE_MANAGER = BattleManager.getInstance();
