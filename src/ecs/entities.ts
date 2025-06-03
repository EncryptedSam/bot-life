import { Bullet, Hero, Status } from "./components";

export function createHero(position?: Hero["position"]): Hero {
  return {
    type: "hero",
    position: { x: 230, y: 650, ...position },
    velocity: { dx: 0, dy: 0 },
    radius: 19,
    state: "idle",
    isRemoved: false,
    flying: false,
  };
}

export function createBullet(position: Bullet["position"]): Bullet {
  return {
    type: "bullet",
    position,
    velocity: { dx: 0, dy: -150 },
    isHit: false,
    isRemoved: false,
  };
}

export function createStatus(): Status {
  return {
    type: "status",
    position: { x: 0, y: 0 },
    velocity: { dx: 0, dy: 0 },
    lastBullet: null,
    isRemoved: false,
  };
}
