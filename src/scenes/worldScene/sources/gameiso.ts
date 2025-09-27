import { EnemyZone, mySquare, WalkPath, Wall } from "./isoEntitys";
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
import { INPUT_MANAGER, inputStateKeys } from "@/input/inputManager";
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
      [keyBindings.openPauseMenu]: () => {
        BATTLE_MANAGER.menuScreen.in();
      },
      [keyBindings.showDialogue]: () => {
        if (BATTLE_MANAGER.dialogue.isHidden) {
          const msj =
            isoLanDialogue[
              Math.floor(Math.random() * isoLanDialogue.length - 1)
            ];
          BATTLE_MANAGER.dialogue.showDialogue(msj);
          this.player.returnIdle();
          this.player.pressKey = [];
          INPUT_MANAGER.setState(inputStateKeys.DIALOGUE);
        }
      },
      // z: () => {
      //   BATTLE_MANAGER.dialogue.hideDialogue();
      // },
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
      if (this.player.intersects(this.enemyZone[i])) {
        const rng = Math.random();
        if (rng > 0.98754) {
          //* Can send config to battle manager
          if (!GAME_IS_BATTLE()) {
            BATTLE_MANAGER.inBattle({
              backGround: 2,
              floorImage: 3,
            });
          }
          this.player.returnIdle();
          this.player.pressKey = [];
          this.enemyZone.splice(i, 1);
        }
      }
    }
  }
  draw(ctx: CanvasRenderingContext2D) {
    // Draw walk path
    this.drawWalkPath(ctx);

    // Draw map
    this.fillIsoMap(ctx);

    // draw player
    this.player.drawIsoImageAreaPlayer(ctx, this.cam, 8);
  }
  drawWalkPath(ctx: CanvasRenderingContext2D) {
    this.walkPath
      .sort((a, b) => b.x + b.y + (a.x + a.y))
      .forEach((element) => {
        element.drawIsoImageArea(ctx, this.cam, 8);
      });
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
  fillIsoMap(ctx: CanvasRenderingContext2D) {
    this.wall
      .sort((a, b) => a.y - b.y)
      .forEach((element) => {
        element.drawIsoImageArea(
          ctx,
          this.cam,

          8
        );
      });

    this.enemyZone
      .sort((a, b) => a.y + b.y)
      .forEach((element) => {
        element.drawIsoImageArea(
          ctx,
          this.cam,

          8
        );
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
    // this.bg.updateBackGround(Math.floor(Math.random() * mapDetails.length));

    // cleand arrays
    this.walkPath = [];
    this.wall = [];
    this.enemyZone = [];
    this.enemies = [];

    const arrayChunks = [];
    for (let i = 0; i < map.data.length; i += map.width) {
      const chunk = map.data.slice(i, i + map.width);
      arrayChunks.push(chunk);
    }

    let col = 0,
      row = 0,
      columns = 0,
      rows = 0,
      enemy = null;

    for (row = 0, rows = arrayChunks.length; row < rows; row += 1) {
      for (
        col = 0, columns = arrayChunks[row].length;
        col < columns;
        col += 1
      ) {
        if (arrayChunks[row][col] === this.data_world_bloks.blockRoad) {
          this.walkPath.push(
            new WalkPath(
              col * blockSize,
              row * blockSize,
              blockSize + 2,
              blockSize + 2,
              true
            )
          );
        }

        if (arrayChunks[row][col] === this.data_world_bloks.blockWall) {
          this.wall.push(
            new Wall(
              col * blockSize,
              row * blockSize,
              blockSize,
              blockSize,
              true
            )
          );
        } else if (
          arrayChunks[row][col] === this.data_world_bloks.blockEnemyZone
        ) {
          this.walkPath.push(
            new WalkPath(
              col * blockSize,
              row * blockSize,
              blockSize + 2,
              blockSize + 2,
              true
            )
          );
          this.enemyZone.push(
            new EnemyZone(
              col * blockSize,
              row * blockSize,
              blockSize,
              blockSize,
              true
            )
          );
        } else if (arrayChunks[row][col] > 2) {
          enemy = new mySquare(
            col * blockSize,
            row * blockSize,
            blockSize,
            blockSize,
            true
          );
          if (arrayChunks[row][col] === 3) {
            enemy.vx = 8;
            enemy.dir = 1;
          } else if (arrayChunks[row][col] === 4) {
            enemy.vy = 8;
            enemy.dir = 2;
          }
          this.enemies.push(enemy);
        }
      }
    }
    this.worldWidth = columns * blockSize;
    this.worldHeight = rows * blockSize;
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
