import { BackGround } from "@/UI/backGround/backGroundShow";
import {
  GAME_IS_BATTLE,
  GAME_IS_PAUSE,
  GAME_SET_LEVEL,
  GAME_TOGGLE_PAUSE,
} from "./gameState";
import { testWorld } from "@/scenes/worldScene/sources/utils";
import { PlayerIso } from "@/scenes/worldScene/sources/isoPlayer";
import {
  EnemyBoss,
  EnemyZone,
  mySquare,
  Path,
  Wall,
} from "@/scenes/worldScene/sources/isoEntitys";
import { keyBindings } from "@/config/keyBindings";
import { BATTLE_MANAGER } from "./battleManager";
import { DIALOGUE_MANAGER } from "@/scenes/worldScene/sources/isoLanDialogue";
import { Camera } from "@/scenes/worldScene/sources/camera";
import { IsoNavis } from "@/scenes/worldScene/sources/navis/isoNavis";
import { MoveNpc } from "@/scenes/worldScene/sources/navis/moveNpc";

const canvas = {
  width: 240,
  height: 160,
};

export class WorldManager {
  static instance: WorldManager | null = null;
  pause = GAME_IS_PAUSE();

  worldWidth = 0;
  worldHeight = 0;
  elapsed = 0;
  cam = null;
  bg: BackGround;
  // player = null;

  currentMap = 0;
  data_world_blocks = testWorld.blocks;
  data_world_maps = testWorld.maps;
  data_world_DefaultPath = testWorld.DefaultPath;
  wall = [];
  enemyZone = [];
  moveNPC = [];
  walkPath = [];
  isoNavis = [];
  spritesheet = false;
  player: PlayerIso;
  sortedElements: mySquare[] = [];
  // menuScreen = new PauseMenu();

  constructor() {
    this.init();
  }

  static getInstance() {
    if (!WorldManager.instance) {
      WorldManager.instance = new WorldManager();
    }
    return WorldManager.instance;
  }
  keyDown = (e: KeyboardEvent) => {
    //ADD move to isoPlayer
    this.player.checkKeyDown(e);
    const options = {
      [keyBindings.pressB]: () => {
        this.player.checkNavy(this.isoNavis);
      },
      [keyBindings.pressStart]: () => {
        BATTLE_MANAGER.menuScreen.in();
      },
      [keyBindings.pressR]: () => {
        if (BATTLE_MANAGER.dialogue.isHidden) {
          const msj = DIALOGUE_MANAGER.getRandomLine("lan", "isoWorld");

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
    this.worldWidth = 0;
    this.worldHeight = 0;
    this.elapsed = 0;
    this.cam = null;
    this.bg = new BackGround(1);
    // player = null;

    this.currentMap = 0;
    this.cam = new Camera();

    this.worldWidth = canvas.width;
    this.worldHeight = canvas.height;
    this.setMap(this.data_world_maps[this.currentMap]);
    this.player = this.player || new PlayerIso(104, 204, 16, 16);
  }

  update(deltaTime: number) {
    this.pause = GAME_IS_PAUSE();
    if (!this.pause && this.player) {
      // this.moveNPC.forEach((npc) => {
      //   npc.navi.update(deltaTime);
      // });

      this.player.update(deltaTime);
      this.player.mover(this.wall);
      this.updateMoveNPC(deltaTime);
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

    [this.player, ...this.isoNavis, ...this.moveNPC.map((e) => e.navi)]
      .sort((a, b) => a.x + a.y - (b.x + b.y))
      .forEach((navy) => {
        navy.drawIsoImageAreaPlayer(ctx, this.cam, 8);
      });
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
    ].sort((a, b) => a.x + a.y - (b.x + b.y));
  }
  drawUI(ctx: CanvasRenderingContext2D, deltaTime: number) {
    BATTLE_MANAGER.draw(ctx, deltaTime);
  }

  // Método helper (agregar a tu clase)
  private hasAdjacentEnemyZone(
    row: number,
    col: number,
    enemyZonePositions: Set<string>,
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
    this.moveNPC = [];
    this.isoNavis = [];

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

        if (this.data_world_blocks[element]) {
          const block = new this.data_world_blocks[element](
            col * blockSize,
            row * blockSize,
            blockSize,
            blockSize,
            true,
          );

          if (block instanceof PlayerIso) {
            this.player = block;
            const defaultPath = new this.data_world_DefaultPath(
              col * blockSize,
              row * blockSize,
              blockSize,
              blockSize,
              true,
            );
            this.walkPath.push(defaultPath);
            continue;
          }
          this.sortByElement(block, row, col, enemyZonePositions);

          // ---- Navi out word ----
          if (block instanceof IsoNavis || block instanceof MoveNpc) {
            const defaultPath = new this.data_world_DefaultPath(
              col * blockSize,
              row * blockSize,
              blockSize,
              blockSize,
              true,
            );
            this.walkPath.push(defaultPath);
          }
        }
      }
    }

    const bgForBattle = [1, 3, 4];

    this.bg.updateBackGround(bgForBattle[this.currentMap]);

    this.worldWidth = columns * blockSize;
    this.worldHeight = rows * blockSize;
    this.updateSortedElements();
    GAME_SET_LEVEL(this.currentMap + 1);
  }
  sortByElement(
    block: any,
    row: number,
    col: number,
    enemyZonePositions: Set<string>,
  ) {
    // ---- Navi out word ----
    if (block instanceof IsoNavis) {
      // const navi = new (block.x, block.y)();
      this.isoNavis.push(block.navi);
    }
    if (block instanceof MoveNpc) {
      this.moveNPC.push(block);
    }

    if (block instanceof Path) {
      this.walkPath.push(block);
      return;
    }

    if (block instanceof Wall) {
      this.wall.push(block);
      return;
    }

    // ---- Enemy logic ----
    let isEnemyZone = false;

    if (block instanceof EnemyBoss) {
      isEnemyZone = true;
    }

    if (block instanceof EnemyZone) {
      isEnemyZone =
        Math.random() > block.ratio &&
        !this.hasAdjacentEnemyZone(row, col, enemyZonePositions);
    }

    block.isEnemyZone = isEnemyZone;

    if (isEnemyZone) {
      enemyZonePositions.add(`${row},${col}`);
    }

    this.enemyZone.push(block);
  }

  in() {
    if (this.pause) {
      GAME_TOGGLE_PAUSE();
      BATTLE_MANAGER.menuScreen.showMenu = false;
      document.removeEventListener(
        "keydown",
        BATTLE_MANAGER.menuScreen.checkKey,
      );
    }
  }
  out() {}

  updateMoveNPC(deltaTime: number) {
    this.moveNPC.forEach((NPC) => {
      NPC.update();
      if (NPC.intersects(this.player)) {
        NPC.speed = 0;
        return;
      }

      //leftUp
      if (NPC.vx < 0) {
        NPC.x -= NPC.speed;

        validateDirection(NPC, this.wall, "vx", "left", "right");
        return;
      } else if (NPC.vx > 0) {
        NPC.x += NPC.speed;

        validateDirection(NPC, this.wall, "vx", "right", "left");
        return;
      } else if (NPC.vy < 0) {
        NPC.y -= NPC.speed;

        validateDirection(NPC, this.wall, "vy", "top", "bottom");
        return;
      } else if (NPC.vy > 0) {
        NPC.y += NPC.speed;

        validateYDwon(NPC, this.wall);

        return;
      }
    });
  }
}

type TDirection = "bottom" | "top" | "left" | "right";
const validateDirection = (
  NPC: MoveNpc,
  obj: MoveNpc[],
  direction: "vx" | "vy",
  oldPosition: TDirection,
  newPosition: TDirection,
) => {
  for (let i = 0, l = obj.length; i < l; i += 1) {
    if (NPC.id === obj[i].id) {
      return;
    }
    if (NPC.intersects(obj[i])) {
      NPC[oldPosition] = obj[i][newPosition];
      NPC[direction] = NPC[direction] * -1;
    }
  }
};

const validateYDwon = (NPC: MoveNpc, wall: MoveNpc[]) => {
  for (let i = 0, l = wall.length; i < l; i += 1) {
    if (NPC.id === wall[i].id) continue;

    if (NPC.intersects(wall[i])) {
      // Ajuste directo de la posición
      NPC.y = wall[i].top - NPC.height / 2;
      NPC.vy = NPC.vy * -1;
      break;
    }
  }
};

export const WORLD_MANAGER = WorldManager.getInstance();
