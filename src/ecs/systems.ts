import { isMax } from "../utils/isMax";
import { AnyEntity } from "./components";
import { createBullet, createHero, createStatus } from "./entities";

export function initGame(entitiesRef: React.RefObject<AnyEntity[]>) {
  if (entitiesRef.current.length > 0) return;
  const entities = entitiesRef.current;

  entities.push(createHero());
  entities.push(createStatus());
}

export function resetGame(entitiesRef: React.RefObject<AnyEntity[]>) {
  if (entitiesRef.current == null) return;
  entitiesRef.current = [];
  initGame(entitiesRef);
}

export function updatePosition(
  entitiesRef: React.RefObject<AnyEntity[]>,
  delta: number
) {
  if (entitiesRef.current == null) return;
  const entities = entitiesRef.current;

  entities.forEach((entity) => {

    
    entity.position.x += entity.velocity.dx * delta;
    entity.position.y += entity.velocity.dy * delta;

    if (entity.type == "bullet" && entity.position.y < 0) {
      entity.isRemoved = true;
    }
  });
}

export function processKeysInput(
  entitiesRef: React.RefObject<AnyEntity[]>,
  keys: string[]
) {
  if (entitiesRef.current.length == 0) return;
  const entities = entitiesRef.current;
  const hero = entities.find((entity) => entity.type === "hero");
  if (!hero) return;

  hero.state = "idle";
  if (keys.includes(" ")) {
    const status = entities.find((entity) => entity.type === "status");
    if (!status) return;
    let shoot = true;

    if (typeof status.lastBullet == "number") {
      shoot = (performance.now() - status.lastBullet) / 200 > 1;
    }

    if (shoot) {
      const bullet = createBullet({
        x: hero.position.x,
        y: hero.position.y - 30,
      });
      entities.push(bullet);
      status.lastBullet = performance.now();
    }

    hero.state = "firing";
  }

  if (hero && hero.velocity) {
    hero.velocity.dx = 0;
    hero.velocity.dy = 0;

    if (isMax(keys, ["ArrowRight", "ArrowLeft"], "ArrowLeft")) {
      hero.velocity.dx = -100;
    }

    if (isMax(keys, ["ArrowRight", "ArrowLeft"], "ArrowRight")) {
      hero.velocity.dx = 100;
    }

    if (isMax(keys, ["ArrowUp", "ArrowDown"], "ArrowUp")) {
      hero.velocity.dy = -100;
    }

    if (isMax(keys, ["ArrowUp", "ArrowDown"], "ArrowDown")) {
      hero.velocity.dy = 100;
    }
  }
}

export function cleanupRemovedEntities(
  entitiesRef: React.RefObject<AnyEntity[]>
): void {
  if (entitiesRef.current.length == 0) return;
  const entities = entitiesRef.current;
  for (let i = entities.length - 1; i >= 0; i--) {
    if (entities[i].isRemoved) {
      entities.splice(i, 1);
    }
  }
}
