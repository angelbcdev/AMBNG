import { Entity } from "../core/Entity";

export interface Vector2 {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rectangle {
  position: Vector2;
  size: Size;
}

export interface SpriteConfig {
  image: HTMLImageElement;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  frameRate: number;
}

export interface AnimationConfig {
  name: string;
  frames: number[];
  frameRate: number;
  loop: boolean;
}

export interface EntityConfig {
  position: Vector2;
  size: Size;
  sprite?: SpriteConfig;
  animations?: Record<string, AnimationConfig>;
}

export interface Collision {
  entity: Entity;
  direction: "top" | "bottom" | "left" | "right";
}
