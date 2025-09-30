import { EnemyBoss, EnemyZone, mySquare, Path, Wall } from "./isoEntitys";
import { PlayerIso } from "./isoPlayer";
import { testWorld } from "./utils";
import { BackGround } from "@/UI/backGround/backGroundShow";
import {
  GAME_IS_BATTLE,
  GAME_IS_PAUSE,
  GAME_TOGGLE_PAUSE,
} from "@/core/gameState";
import { keyBindings } from "@/config/keyBindings";
import { BATTLE_MANAGER } from "@/core/battleManager";

import { isoLanDialogue } from "./isoLanDialogue";

const canvas = {
  width: 240,
  height: 160,
};

class Camera {
  x: number = 0;
  y: number = 0;
  worldWidth: number = 0;
  worldHeight: number = 0;

  constructor() {
    this.x = 0;
    this.y = 0;
  }
  focus(x: number, y: number) {
    this.x = x - canvas.width / 2;
    this.y = y - canvas.height / 2;

    if (this.x < 0) {
      this.x = 0;
    } else if (this.x > this.worldWidth - canvas.width) {
      this.x = this.worldWidth - canvas.width;
    }
    if (this.y < 0) {
      this.y = 0;
    } else if (this.y > this.worldHeight - canvas.height) {
      this.y = this.worldHeight - canvas.height;
    }
  }

  isoFocus(x: number, y: number) {
    this.x = x / 2 - y / 2 - canvas.width / 2;
    this.y = x / 4 + y / 4 - canvas.height / 2;
  }
}

export class GameIso {
  lastPress = null;
  pressing = [];
  pause = GAME_IS_PAUSE();

  worldWidth = 0;
  worldHeight = 0;
  elapsed = 0;
  cam = null;
  bg = new BackGround(1);
  // player = null;

  currentMap = 0;
  data_world_bloks = testWorld.bloks;
  data_world_maps = testWorld.maps;
  wall = [];
  enemyZone = [];
  enemies = [];
  walkPath = [];
  spritesheet = false;
  player: PlayerIso;
  sortedElements: mySquare[] = [];
  // menuScreen = new PauseMenu();

  constructor() {
    this.init();
    this.cam = new Camera();
    this.player = new PlayerIso(64, 164, 16, 16);
  }
  keyDown = (e: KeyboardEvent) => {
    //ADD move to isoPlayer
    this.player.checkKeyDown(e);
    const options = {
      [keyBindings.pressStart]: () => {
        BATTLE_MANAGER.menuScreen.in();
      },
      [keyBindings.pressR]: () => {
        if (BATTLE_MANAGER.dialogue.isHidden) {
          const msj =
            isoLanDialogue[
              Math.floor(Math.random() * isoLanDialogue.length - 1)
            ];
          BATTLE_MANAGER.dialogue.showMessage(msj);
          this.player.returnIdle();
          this.player.pressKey = [];
        }
      },
    };
    if (options[e.key.toLowerCase()]) {
      options[e.key.toLowerCase()]();
    }
  };
  drawBackground(c: CanvasRenderingContext2D, deltaTime: number) {
    if (!this.pause) {
      this.bg.canMove = true;
    } else {
      this.bg.canMove = false;
    }
    this.bg.draw(c, deltaTime);
  }

  keyUp = (e: KeyboardEvent) => {
    this.player.checkKeyUp(e);
    const options = {};
    if (options[e.key.toLowerCase()]) {
      options[e.key.toLowerCase()]();
    }
  };
  init() {
    this.worldWidth = canvas.width;
    this.worldHeight = canvas.height;
    this.setMap(this.data_world_maps[this.currentMap]);
  }

  update(deltaTime: number) {
    this.pause = GAME_IS_PAUSE();
    if (!this.pause && this.player) {
      this.player.update(deltaTime);
      this.player.mover(this.wall);
      // GameOver Reset

      //* Out Screen
      if (this.player.x > this.worldWidth) {
        this.currentMap += 1;
        if (this.currentMap > this.data_world_maps.length - 1) {
          this.currentMap = 0;
        }
        this.setMap(this.data_world_maps[this.currentMap]);
        this.player.x = 0;
      } else if (this.player.y > this.worldHeight) {
        this.player.y = 0;
      } else if (this.player.x < 0) {
        this.currentMap -= 1;
        if (this.currentMap < 0) {
          this.currentMap = this.data_world_maps.length - 1;
        }
        this.setMap(this.data_world_maps[this.currentMap]);
        this.player.x = this.worldWidth;
      } else if (this.player.y < 0) {
        this.player.y = this.worldHeight;
      }

      this.checkEnemyZone();

      // Focus player
      //cam.focus(player.x, player.y);
      this.cam.isoFocus(this.player.x || 0, this.player.y || 0);

      // Elapsed time
      this.elapsed += deltaTime;
      if (this.elapsed > 360000) {
        this.elapsed -= 360000;
      }
    }
  }
  checkEnemyZone() {
    //* Check if player is in enemy zone
    for (let i = 0; i < this.enemyZone.length; i++) {
      const enemyZone = this.enemyZone[i];
      if (this.player.intersects(enemyZone)) {
        if (enemyZone.isEnemyZone) {
          enemyZone.isEnemyZone = false;
          //* Can send config to battle manager
          if (!GAME_IS_BATTLE()) {
            this.player.returnIdle();
            this.player.pressKey = [];
            BATTLE_MANAGER.inBattle(enemyZone.constructor.name);
          }
        }
      }
    }
  }
  draw(ctx: CanvasRenderingContext2D) {
    // Draw walk path
    this.drawWalkPath(ctx);

    // Draw map
    // this.fillIsoMap(ctx);

    // draw player
    this.player.drawIsoImageAreaPlayer(ctx, this.cam, 8);
  }
  drawWalkPath(ctx: CanvasRenderingContext2D) {
    this.sortedElements.forEach((element) => {
      element.drawIsoImageArea(ctx, this.cam, 8);
    });
  }
  updateSortedElements() {
    this.sortedElements = [
      ...this.enemyZone,
      ...this.wall,
      ...this.walkPath,
    ].sort((a, b) => a.y + a.x - (b.y + b.x));
  }
  drawUI(ctx: CanvasRenderingContext2D, deltaTime: number) {
    BATTLE_MANAGER.draw(ctx, deltaTime);
    // Debug last key pressed
    ctx.fillStyle = "#fff";
    //*PAINT MAP NAME
    this.painLevelName(ctx, 0, 20);
  }
  painLevelName(c: CanvasRenderingContext2D, x: number, y: number) {
    // c.fillStyle = "#fff";
    // c.fillRect(x, y, 162, 33);
    c.fillStyle = "#000";
    c.textAlign = "right";
    c.font = `20px Arial`;
    c.fillText(
      ` ${this.data_world_maps[this.currentMap].name}  `,
      x + 81,
      y + 26
    );
    c.fillStyle = "#fff";
    c.textAlign = "right";
    c.font = `20px Arial`;
    c.fillText(
      ` ${this.data_world_maps[this.currentMap].name}  `,
      x + 80,
      y + 24
    );
  }

  // Método helper (agregar a tu clase)
  private hasAdjacentEnemyZone(
    row: number,
    col: number,
    enemyZonePositions: Set<string>
  ): boolean {
    const directions = [
      [-1, 0], // arriba
      [1, 0], // abajo
      [0, -1], // izquierda
      [0, 1], // derecha
    ];

    return directions.some(([dRow, dCol]) => {
      const key = `${row + dRow},${col + dCol}`;
      return enemyZonePositions.has(key);
    });
  }
  setMap(map: {
    data: number[];
    height: number;
    id: number;
    name: string;
    opacity: number;
    type: string;
    visible: boolean;
    width: number;
    x: number;
    y: number;
  }) {
    const blockSize = 16;

    // Clean arrays
    this.walkPath = [];
    this.wall = [];
    this.enemyZone = [];
    this.enemies = [];

    // Set temporal para rastrear enemyZones (se limpia cada vez que se llama setMap)
    const enemyZonePositions = new Set<string>();

    const arrayChunks = [];
    for (let i = 0; i < map.data.length; i += map.width) {
      const chunk = map.data.slice(i, i + map.width);
      arrayChunks.push(chunk);
    }

    let col = 0,
      row = 0,
      columns = 0,
      rows = 0;

    for (row = 0, rows = arrayChunks.length; row < rows; row += 1) {
      for (
        col = 0, columns = arrayChunks[row].length;
        col < columns;
        col += 1
      ) {
        const element = arrayChunks[row][col];
        if (this.data_world_bloks[element]) {
          const block = new this.data_world_bloks[element](
            col * blockSize,
            row * blockSize,
            blockSize,
            blockSize,
            true
          );

          if (block instanceof Path) {
            this.walkPath.push(block);
          } else if (block instanceof Wall) {
            this.wall.push(block);
          } else {
            // Verificar si hay enemyZone adyacente antes de asignar
            if (block instanceof EnemyBoss) {
              block.isEnemyZone = true;
            } else {
              const canBeEnemyZone =
                Math.random() > block.ratio &&
                !this.hasAdjacentEnemyZone(row, col, enemyZonePositions);
              block.isEnemyZone = canBeEnemyZone;
            }

            // Si es enemyZone, agregar su posición al Set
            if (block.isEnemyZone) {
              enemyZonePositions.add(`${row},${col}`);
            }

            this.enemyZone.push(block);
          }
        }
      }
    }

    const bgForBattle = [1, 3, 4];
    const rdFloar = bgForBattle[Math.floor(Math.random() * bgForBattle.length)];
    this.bg.updateBackGround(rdFloar);

    this.worldWidth = columns * blockSize;
    this.worldHeight = rows * blockSize;
    this.updateSortedElements();
  }

  in() {
    if (this.pause) {
      GAME_TOGGLE_PAUSE();
      BATTLE_MANAGER.menuScreen.showMenu = false;
      document.removeEventListener(
        "keydown",
        BATTLE_MANAGER.menuScreen.checkKey
      );
    }
  }
  out() {}

  moveNPC() {
    let i = 0,
      l = 0,
      j = 0,
      jl = 0;
    // Move enemies
    for (i = 0, l = this.enemies.length; i < l; i += 1) {
      if (this.enemies[i].vx !== 0) {
        this.enemies[i].x += this.enemies[i].vx;

        for (j = 0, jl = this.wall.length; j < jl; j += 1) {
          if (this.enemies[i].intersects(this.wall[j])) {
            this.enemies[i].vx *= -1;
            this.enemies[i].x += this.enemies[i].vx;
            this.enemies[i].dir += 2;
            if (this.enemies[i].dir > 3) {
              this.enemies[i].dir -= 4;
            }
            break;
          }
        }
      }

      if (this.enemies[i].vy !== 0) {
        this.enemies[i].y += this.enemies[i].vy;

        for (j = 0, jl = this.wall.length; j < jl; j += 1) {
          if (this.enemies[i].intersects(this.wall[j])) {
            this.enemies[i].vy *= -1;
            this.enemies[i].y += this.enemies[i].vy;
            this.enemies[i].dir += 2;
            if (this.enemies[i].dir > 3) {
              this.enemies[i].dir -= 4;
            }
            break;
          }
        }
      }

      // Player Intersects Enemy
      if (this.player.intersects(this.enemies[i])) {
        // this.gameover = true;
        // this.pause = true;
      }
    }
  }
}
