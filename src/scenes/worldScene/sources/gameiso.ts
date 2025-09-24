import { GAME } from "@/scenes/sceneManager";
import { EnemyZone, mySquare, WalkPath, Wall } from "./isoEntitys";
import { PlayerIso } from "./isPlayer";
import { testWorld } from "./utils";
import { BackGround } from "@/newUI/backGround/backGroundShow";
import { PauseMenu } from "@/newUI/menu/pauseMenu";

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
  pause = false;
  gameover = true;
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
  player = new PlayerIso(64, 64, 16, 16);
  menuScreen = new PauseMenu();
  constructor() {
    this.init();
    this.cam = new Camera();
  }
  checkKeyDown = (e: KeyboardEvent) => {
    this.player.checkKeyDown(e);
    const options = {
      Enter: () => {
        if (!this.pause) {
          this.pause = true;
          this.menuScreen.showMenu = true;
          if (this.menuScreen.showMenu) {
            // this.menuScreen.in();
            document.addEventListener("keydown", this.menuScreen.checkKey);
          }
          // else {
          //   // this.menuScreen.out();
          //   document.removeEventListener("keydown", this.menuScreen.checkKey);
          // }
        }
      },
    };
    if (options[e.key]) {
      options[e.key]();
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

  checkKeyUp = (e: KeyboardEvent) => {
    this.player.checkKeyUp(e);
  };
  init() {
    // Get canvas and context

    this.worldWidth = canvas.width;
    this.worldHeight = canvas.height;

    // Create camera and player

    // Set initial map
    this.setMap(this.data_world_maps[this.currentMap]);

    // Start game
  }

  update(deltaTime: number) {
    if (!this.pause) {
      this.player.update(deltaTime);
      this.player.mover(this.wall);
      // GameOver Reset
      if (this.gameover) {
        this.reset();
      }

      // Out Screen
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
      this.cam.isoFocus(this.player.x, this.player.y);

      // Elapsed time
      this.elapsed += deltaTime;
      if (this.elapsed > 360000) {
        this.elapsed -= 360000;
      }
    }
    // Pause/Unpause
    if (this.lastPress === "KEY_ENTER") {
      this.pause = !this.pause;
      this.lastPress = null;
    }
  }
  checkEnemyZone() {
    for (let i = 0; i < this.enemyZone.length; i++) {
      if (this.player.intersects(this.enemyZone[i])) {
        const rng = Math.random();
        if (rng > 0.98754) {
          GAME.changeScene(GAME.statesKeys.battle);
          this.player.pressKey = [];
          this.player.returnIdle();
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
    this.player.drawIsoImageAreaPlayer(
      ctx,
      this.cam,

      8
    );
  }
  drawWalkPath(ctx: CanvasRenderingContext2D) {
    this.walkPath
      .sort((a, b) => b.x + b.y + (a.x + a.y))
      .forEach((element) => {
        element.drawIsoImageArea(ctx, this.cam, 8);
      });
  }
  drawUI(ctx: CanvasRenderingContext2D, deltaTime: number) {
    this.menuScreen.draw(ctx, deltaTime);
    // Debug last key pressed
    ctx.fillStyle = "#fff";
    ctx.fillText(this.data_world_maps[this.currentMap].name, 4, 20);

    // Draw pause
    if (this.pause) {
      ctx.textAlign = "center";
      if (this.gameover) {
        ctx.fillText("GAMEOVER", 430 / 2, 430 / 2);
      } else {
        ctx.fillText("PAUSE", 430 / 2, 430 / 2);
      }
      ctx.textAlign = "left";
    }
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
  reset() {
    this.player.dir = 1;
    this.player.left = 64;
    this.player.top = 160;
    this.gameover = false;
  }

  in() {
    document.addEventListener("keyup", this.checkKeyUp);
    document.addEventListener("keydown", this.checkKeyDown);
    if (this.pause) {
      this.pause = false;
      this.menuScreen.showMenu = false;
      document.removeEventListener("keydown", this.menuScreen.checkKey);
    }
  }
  out() {
    document.removeEventListener("keyup", this.checkKeyUp);
    document.removeEventListener("keydown", this.checkKeyDown);
  }

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
        this.gameover = true;
        this.pause = true;
      }
    }
  }
}
