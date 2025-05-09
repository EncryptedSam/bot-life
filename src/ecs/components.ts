export type EntityID = number;

export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  dx: number;
  dy: number;
}

export interface Oscillator {
  pointA: Position;
  pointB: Position;
  speed: number;
  direction: 1 | -1;
}

export type EntityDirection = "left" | "right";

export type EntityState =
  | "idle"
  | "run"
  | "jump"
  | "double-jump"
  | "fall"
  | "wall-jump"
  | "hit"
  | "collected";

export interface Sprite {
  images: Record<string, HTMLImageElement>; // e.g. "idle-right", "run-left", etc.
  frameWidth: number;
  frameHeight: number;
  currentFrame: number;
  totalFrames: Record<string, number>; // frames per animation key
  currentAnimation: string; // current key used for animation
  frameTime: number; // ms per frame
  elapsedTime: number; // ms since last frame update
}

export interface Entity {
  id: EntityID;
  position: Position;
  velocity?: Velocity;
  sprite: Sprite;
  direction?: EntityDirection;
  state?: EntityState;
  type?: string; // e.g. "hero", "fruit", "brick", "enemy"
  oscillator?: Oscillator; 
}
