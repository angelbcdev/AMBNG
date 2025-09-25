import { Entity } from "@/data/player/entity";
import { FLOOR_MANAGER } from "./floorManager";
import PlayerBlue from "@/data/player/player/Player";
import { GAME_IS_PAUSE } from "./gameState";

class EntityManager {
  static instance: EntityManager | null = null;

  effect = [];
  npc = [];

  player = new PlayerBlue({
    possition: { x: 1, y: 1 },
    sideToPlay: 0,
  });

  static getInstance() {
    if (!this.instance) this.instance = new EntityManager();
    return this.instance;
  }
  initBattle() {
    this.player = new PlayerBlue({
      possition: { x: 1, y: 1 },
      sideToPlay: 0,
    });
    this.clearEntites();
    FLOOR_MANAGER.initFloors();
    this.asignarMatrixToEntity();
  }
  asignarMatrixToEntity() {
    this.npc.forEach((enemy) => {
      enemy.matrix = FLOOR_MANAGER.matrix;

      enemy.calculateMatrix();
    });
    this.player.matrix = FLOOR_MANAGER.matrix;
    this.player.calculateMatrix();
  }

  runFilters() {
    this.effect = this.effect.filter(
      (effect: Entity) => effect.delete !== true
    );

    this.npc = this.npc.filter((enemy: Entity) => {
      if (enemy.delete) {
        FLOOR_MANAGER.matrix[enemy.matrixY][enemy.matrixX].ocupated = false;
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
    row: number
  ) {
    this.effect
      .filter((effect: any) => effect.initialMatrixY == row)
      .forEach((effect) => {
        effect.draw(c, deltaTime);

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
    enemy.matrix = FLOOR_MANAGER.matrix;
    enemy.calculateMatrix();

    if (this.npc.length < 3) {
      this.npc.push(enemy);
    } else {
      alert("por el momento no se pueden agregar mas enemigos limitados a 2");
    }
  }

  validateCollisionEnemys() {
    this.npc.forEach((enemy: Entity) => {
      enemy.collisionArea(this.player);
    });
  }

  levelToPaint(c: CanvasRenderingContext2D, deltaTime: number, row: number) {
    [...this.npc, this.player]
      .filter((entity) => entity.matrixY == row)
      .sort((a, b) => b.y - a.y)
      .forEach((entity: any) => {
        entity.collisionAttacks = this.effect;
        entity.draw(c, deltaTime);

        if (!GAME_IS_PAUSE()) {
          entity.update(c, deltaTime);
        }
      });
  }
  //players
  playerIsLive() {
    return this.player.live > 0;
  }
  resetPlayers() {}

  getAllEntities() {
    return [...this.npc, this.player];
  }
  addPlayerElement({ element, player }: { element: any; player: Entity }) {
    const newElement = new element({
      possition: { x: player.matrixX + 1, y: player.matrixY },
      sideToPlay: player.side,
    });
    // newElement.sideToPlay set by constructor
    // newElement.sideToPlay = player.side;

    ENTITY_MANAGER.effect.push(newElement);
  }
}

export const ENTITY_MANAGER = EntityManager.getInstance();
