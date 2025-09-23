import { EventBus, GameEvents } from "./EventBus";

export type GameStateType =
  | "MENU"
  | "WORLD"
  | "BATTLE"
  | "PAUSED"
  | "GAME_OVER";

export class GameState {
  private static instance: GameState;
  private eventBus: EventBus;
  private currentState: GameStateType;
  private previousState: GameStateType | null;

  private constructor() {
    this.eventBus = EventBus.getInstance();
    this.currentState = "WORLD";
    this.previousState = null;
  }
  endBattle() {
    this.setState("WORLD");
  }
  setGameOver() {
    this.setState("GAME_OVER");
  }

  static getInstance(): GameState {
    if (!GameState.instance) {
      GameState.instance = new GameState();
    }
    return GameState.instance;
  }

  getCurrentState(): GameStateType {
    return this.currentState;
  }

  getPreviousState(): GameStateType | null {
    return this.previousState;
  }

  setState(newState: GameStateType): void {
    if (this.currentState !== newState) {
      this.previousState = this.currentState;
      this.currentState = newState;
      this.eventBus.emit(
        GameEvents.GAME_STATE_CHANGED,
        this.currentState,
        this.previousState
      );
    }
  }

  isInState(state: GameStateType): boolean {
    return this.currentState === state;
  }

  isInBattle(): boolean {
    return this.currentState === "BATTLE";
  }

  isInWorld(): boolean {
    return this.currentState === "WORLD";
  }

  isPaused(): boolean {
    return this.currentState === "PAUSED";
  }

  isGameOver(): boolean {
    return this.currentState === "GAME_OVER";
  }

  pause(): void {
    if (this.currentState !== "PAUSED") {
      this.setState("PAUSED");
    }
  }
  startBattle(): void {
    this.setState("BATTLE");
  }
  startWorld(): void {
    this.setState("WORLD");
  }

  resume(): void {
    if (this.previousState) {
      this.setState(this.previousState);
    }
  }
}
