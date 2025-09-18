import { EventBus, GameEvents } from "./EventBus";
import { EntityConfig } from "../types/types";

export interface Position {
  x: number;
  y: number;
}

export interface EntityConfig {
  position: Position;
  width?: number;
  height?: number;
  side?: number;
}

export abstract class Entity {
  protected eventBus: EventBus;
  protected position: { x: number; y: number };
  protected size: { width: number; height: number };
  protected destroyed: boolean;

  constructor(config: EntityConfig) {
    this.eventBus = EventBus.getInstance();
    this.position = config.position;
    this.size = config.size;
    this.destroyed = false;

    // Notificar creación
    this.eventBus.emit(GameEvents.ENTITY_CREATED, this);
  }

  getPosition(): { x: number; y: number } {
    return { ...this.position };
  }

  setPosition(position: { x: number; y: number }): void {
    this.position = { ...position };
  }

  getSize(): { width: number; height: number } {
    return { ...this.size };
  }

  isDestroyed(): boolean {
    return this.destroyed;
  }

  destroy(): void {
    if (!this.destroyed) {
      this.destroyed = true;
      this.eventBus.emit(GameEvents.ENTITY_DESTROYED, this);
    }
  }

  abstract update(deltaTime: number): void;
  abstract render(ctx: CanvasRenderingContext2D): void;
}
