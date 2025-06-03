// type Type = "hero" | "bullet" | "status" | "keys" | "";
type Type = "background";

type Range<N extends number, Result extends number[] = []> =
  Result['length'] extends N ? Result[number] : Range<N, [Result['length'], ...Result]>;



interface Entity {
  type: Type;
  position?: { x: number; y: number };
  velocity?: { x: number; y: number };
  direction?: { x: number; y: number };
  removed?: boolean;
  removedIds: number[];
}

interface Entity {
  type: "hero" | "bullet" | "status";
  position: {
    x: number;
    y: number;
  };
  velocity?: {
    dx: number;
    dy: number;
  };
  isRemoved: boolean;
}

export interface Hero extends Entity {
  type: "hero";
  state: "idle" | "firing";
  radius: number;
  flying: boolean;
}

export interface Bullet extends Entity {
  type: "bullet";
  isHit: boolean;
}

export interface Status extends Entity {
  type: "status";
  lastBullet: number | null;
}

export type AnyEntity = Hero | Bullet | Status;
