type EventCallback = (...args: any[]) => void;

export class EventBus {
  private static instance: EventBus;
  private events: Map<string, Set<EventCallback>> = new Map();

  private constructor() {}

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  on(event: string, callback: EventCallback): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(callback);
  }

  off(event: string, callback: EventCallback): void {
    if (this.events.has(event)) {
      this.events.get(event)!.delete(callback);
    }
  }

  emit(event: string, ...args: any[]): void {
    if (this.events.has(event)) {
      this.events.get(event)!.forEach((callback) => callback(...args));
    }
  }

  clear(): void {
    this.events.clear();
  }
}

export const GameEvents = {
  ENTITY_CREATED: "entity:created",
  ENTITY_DESTROYED: "entity:destroyed",
  GAME_STATE_CHANGED: "game:stateChanged",
  COLLISION_DETECTED: "collision:detected",
  PLAYER_ATTACK: "player:attack",
  ENEMY_ATTACK: "enemy:attack",
  GAME_OVER: "game:over",
  LEVEL_COMPLETE: "level:complete",
};
