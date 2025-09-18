import { GameState } from "./GameState";
import { EntityManager } from "./EntityManager";
import { GAME_CONFIG } from "../config/gameConfig";

export class Game {
  private static instance: Game;
  private gameState: GameState;
  private entityManager: EntityManager;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private lastTime: number;
  private isRunning: boolean;

  private constructor() {
    this.gameState = GameState.getInstance();
    this.entityManager = EntityManager.getInstance();
    this.isRunning = false;
    this.lastTime = 0;

    // Inicializar canvas
    this.canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;
    this.canvas.width = GAME_CONFIG.canvas.width;
    this.canvas.height = GAME_CONFIG.canvas.height;
  }

  static getInstance(): Game {
    if (!Game.instance) {
      Game.instance = new Game();
    }
    return Game.instance;
  }

  start(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      this.lastTime = performance.now();
      this.gameLoop();
    }
  }

  stop(): void {
    this.isRunning = false;
  }

  private gameLoop(): void {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Actualizar estado del juego
    this.update(deltaTime);

    // Limpiar canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Renderizar
    this.render();

    // Solicitar siguiente frame
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  private update(deltaTime: number): void {
    if (this.gameState.isPaused()) return;

    // Actualizar entidades
    this.entityManager.update(deltaTime);
  }

  private render(): void {
    // Renderizar entidades
    this.entityManager.render(this.ctx);
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  pause(): void {
    this.gameState.pause();
  }

  resume(): void {
    this.gameState.resume();
  }

  reset(): void {
    this.entityManager.clear();
    this.gameState.setState("MENU");
    this.start();
  }
}
