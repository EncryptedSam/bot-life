export type EntityID = number;

export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  dx: number;
  dy: number;
}

export interface Sprite {
  image: HTMLImageElement;
  frameWidth: number;
  frameHeight: number;
  currentFrame: number;
  totalFrames: number;
  frameTime: number;
  elapsedTime: number;
}

export interface Entity {
  id: EntityID;
  position: Position;
  velocity?: Velocity;
  sprite: Sprite;
}
