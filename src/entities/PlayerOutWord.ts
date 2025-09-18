import { Entity } from "../core/Entity";
import { EntityConfig } from "../types/types";

export class PlayerOutWord extends Entity {
  private speed: number = 3;
  private targetX: number | null = null;
  private targetY: number | null = null;
  private isMoving: boolean = false;

  constructor(config: EntityConfig) {
    super(config);
    this.setupMouseControls();
  }

  private setupMouseControls(): void {
    document.addEventListener("click", (event) => {
      const canvas = document.getElementById(
        "game-canvas"
      ) as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();

      // Convertir coordenadas del mouse a coordenadas del canvas
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // Establecer el objetivo de movimiento
      this.targetX = mouseX;
      this.targetY = mouseY;
      this.isMoving = true;
    });
  }

  update(_: number): void {
    if (this.isMoving && this.targetX !== null && this.targetY !== null) {
      // Calcular la dirección hacia el objetivo
      const dx = this.targetX - this.position.x;
      const dy = this.targetY - this.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.speed) {
        // Llegamos al objetivo
        this.position.x = this.targetX;
        this.position.y = this.targetY;
        this.isMoving = false;
        this.targetX = null;
        this.targetY = null;
      } else {
        // Mover hacia el objetivo
        const angle = Math.atan2(dy, dx);
        this.position.x += Math.cos(angle) * this.speed;
        this.position.y += Math.sin(angle) * this.speed;
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Dibujar el personaje
    ctx.fillStyle = "#4287f5";
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Dibujar indicador de movimiento si hay un objetivo
    if (this.isMoving && this.targetX !== null && this.targetY !== null) {
      ctx.strokeStyle = "#4287f5";
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(this.position.x, this.position.y);
      ctx.lineTo(this.targetX, this.targetY);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
}
