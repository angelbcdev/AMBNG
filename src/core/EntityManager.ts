import { Entity } from "./Entity";
import { EventBus, GameEvents } from "./EventBus";

export class EntityManager {
  private static instance: EntityManager;
  private eventBus: EventBus;
  private entities: Set<Entity>;
  private entitiesByType: Map<string, Set<Entity>>;

  private constructor() {
    this.eventBus = EventBus.getInstance();
    this.entities = new Set();
    this.entitiesByType = new Map();

    // Suscribirse a eventos de entidades
    this.eventBus.on(
      GameEvents.ENTITY_CREATED,
      this.handleEntityCreated.bind(this)
    );
    this.eventBus.on(
      GameEvents.ENTITY_DESTROYED,
      this.handleEntityDestroyed.bind(this)
    );
  }

  static getInstance(): EntityManager {
    if (!EntityManager.instance) {
      EntityManager.instance = new EntityManager();
    }
    return EntityManager.instance;
  }

  private handleEntityCreated(entity: Entity): void {
    this.entities.add(entity);
    const type = entity.constructor.name;
    if (!this.entitiesByType.has(type)) {
      this.entitiesByType.set(type, new Set());
    }
    this.entitiesByType.get(type)!.add(entity);
  }

  private handleEntityDestroyed(entity: Entity): void {
    this.entities.delete(entity);
    const type = entity.constructor.name;
    if (this.entitiesByType.has(type)) {
      this.entitiesByType.get(type)!.delete(entity);
    }
  }

  addEntity(entity: Entity): void {
    this.handleEntityCreated(entity);
  }

  removeEntity(entity: Entity): void {
    this.handleEntityDestroyed(entity);
  }

  getEntities(): Entity[] {
    return Array.from(this.entities);
  }

  getEntitiesByType(type: string): Entity[] {
    return this.entitiesByType.has(type)
      ? Array.from(this.entitiesByType.get(type)!)
      : [];
  }

  update(deltaTime: number): void {
    this.entities.forEach((entity) => {
      if (!entity.isDestroyed()) {
        entity.update(deltaTime);
      }
    });
  }

  render(ctx: CanvasRenderingContext2D): void {
    this.entities.forEach((entity) => {
      if (!entity.isDestroyed()) {
        entity.render(ctx);
      }
    });
  }

  clear(): void {
    this.entities.clear();
    this.entitiesByType.clear();
  }
}
