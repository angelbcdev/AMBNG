import { ToleteEnemy } from "@/entities/enemys/tolete";
import { ENTITY_MANAGER } from "./entityManager";
import { BeeTank } from "@/entities/enemys/Character/beeTank/beetank";
import { CannonDumb } from "@/entities/enemys/Character/cannon/cannonDumb";
import Fishy from "@/entities/enemys/Character/fishy/fishy";
import { Mettols } from "@/entities/enemys/Character/mettol/mettol";
import { GospelWolfEnemy } from "@/entities/enemys/Character/gospel";

// TODO: BeeTank

export const tolete = [
  new ToleteEnemy({
    possition: { x: 2, y: 0 },
    sideToPlay: 1,
  }),
  new ToleteEnemy({
    possition: { x: 2, y: 1 },
    sideToPlay: 1,
  }),
  new ToleteEnemy({
    possition: { x: 2, y: 2 },
    sideToPlay: 1,
  }),
];

class EnemyFactory {
  static instance: EnemyFactory;
  constructor() {
    if (!EnemyFactory.instance) {
      EnemyFactory.instance = this;
    }
    return EnemyFactory.instance;
  }
  static getInstance() {
    if (!EnemyFactory.instance) {
      EnemyFactory.instance = new EnemyFactory();
    }
    return EnemyFactory.instance;
  }

  addEnemy() {
    ENTITY_MANAGER.addNewEnemy({
      newEnemy: Mettols,
      position: { x: 0, y: 1 },
      level: 1,
    });
  }
}

export const ENEMY_FACTORY = EnemyFactory.getInstance();
