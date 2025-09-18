import { Entity } from "../core/Entity";
import { EntityConfig } from "../types/types";

export class TestEntity extends Entity {
  private color: string;

  constructor(config: EntityConfig) {
    super(config);
    this.color = "#ff0000";
  }

  update(deltaTime: number): void {
    // Mover la entidad
    this.position.x += 1;
    if (this.position.x > 400) {
      this.position.x = 0;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height
    );
  }
}
