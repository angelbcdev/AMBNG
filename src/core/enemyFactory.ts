import { ToleteEnemy } from "@/entities/enemys/tolete";
import { ENTITY_MANAGER } from "./entityManager";
// import { BeeTank } from "@/entities/enemys/Character/beeTank/beetank";
import { CannonDumb } from "@/entities/enemys/Character/cannon/cannonDumb";
import Fishy from "@/entities/enemys/Character/fishy/fishy";
import { Mettols } from "@/entities/enemys/Character/mettol/mettol";
import { GospelWolfEnemy } from "@/entities/enemys/gospel/gospel";
import { EnemyZone } from "@/scenes/worldScene/sources/isoEntitys";
import { Gustman } from "@/entities/naviz/gustman/gustman";
// import { EnemyBoss, EnemyZone } from "@/scenes/worldScene/sources/isoEntitys";

// TODO: BeeTank

const normalEnemys = [CannonDumb, Fishy, Mettols];

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
  addEspecifiEnemy() {
    ENTITY_MANAGER.addNewEnemy({
      newEnemy: Mettols,
      position: { x: 0, y: 1 },
      level: 1,
    });
  }

  addEnemy(type: "EnemyBoss" | "EnemyZone" | "test") {
    // this.addEspecifiEnemy();
    // return;

    if (type == EnemyZone.name) {
      // Paso 1: Determinar cantidad de enemigos
      const enemyCount = Math.floor(Math.random() * 2) + 1;

      // Paso 2: Preparar columnas disponibles
      const availableColumns = [0, 1, 2, 3];

      // Paso 3: Seleccionar columnas únicas
      const selectedColumns: number[] = [];
      for (let i = 0; i < enemyCount; i++) {
        const randomIndex = Math.floor(Math.random() * availableColumns.length);
        selectedColumns.push(availableColumns[randomIndex]);
        availableColumns.splice(randomIndex, 1);
      }

      // Paso 6: Crear cada enemigo
      selectedColumns.forEach((column) => {
        // Paso 4: Tipo aleatorio
        const randomEnemyType =
          normalEnemys[Math.floor(Math.random() * normalEnemys.length)];

        // Paso 5: Nivel aleatorio
        const randomLevel = Math.floor(Math.random() * 3) + 1;

        // Agregar enemigo
        ENTITY_MANAGER.addNewEnemy({
          newEnemy: randomEnemyType,
          position: { x: 2, y: column },
          level: randomLevel,
        });
      });
    } else if (type == "test") {
      ENTITY_MANAGER.addNewEnemy({
        newEnemy: Gustman,
        position: {
          x: 1,
          y: 1,
        },
        level: 1,
      });
      // ENTITY_MANAGER.addNewEnemy({
      //   newEnemy: Gustman,
      //   position: { x: 0, y: 1 },
      //   level: 1,
      // });
    } else {
      ENTITY_MANAGER.addNewEnemy({
        newEnemy: GospelWolfEnemy,
        position: { x: 0, y: 1 },
        level: 1,
      });
    }
  }
}

export const ENEMY_FACTORY = EnemyFactory.getInstance();
