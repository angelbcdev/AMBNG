export const GAME_CONFIG = {
  canvas: {
    width: 430,
    height: 430,
  },
  player: {
    speed: 2.5,
    jumpForce: 10,
    gravity: 0.5,
  },
  world: {
    tileSize: 64,
    gravity: 0.5,
  },
  battle: {
    maxEnemies: 3,
    battleDuration: 1000,
  },
  assets: {
    sprites: {
      player: '/assets/sprites/player.png',
      enemies: '/assets/sprites/enemies.png',
      tiles: '/assets/sprites/tiles.png',
    },
    backgrounds: {
      world: '/assets/backgrounds/world.png',
      battle: '/assets/backgrounds/battle.png',
    },
  },
} as const 