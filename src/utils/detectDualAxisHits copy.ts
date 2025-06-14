type Point = { x: number; y: number };
type Rect = { x: number; y: number; width: number; height: number };
type HitResult = { object: Rect; side: string; time: number };

export function detectDualAxisHits(
  pointA: Point,
  pointB: Point,
  movingWidth: number,
  movingHeight: number,
  collidables: Rect[]
): HitResult[] {
  const velocity = {
    x: pointB.x - pointA.x,
    y: pointB.y - pointA.y,
  };

  const movingObj = {
    x: pointA.x,
    y: pointA.y,
    width: movingWidth,
    height: movingHeight,
  };

  const results: HitResult[] = [];

  for (const target of collidables) {
    const result = sweptAABB(movingObj, velocity, target);
    if (result && result.entryBoth) {
      results.push({
        object: target,
        side: result.side,
        time: result.time,
      });
    }
  }

  return results;
}

function sweptAABB(
  moving: Rect,
  velocity: Point,
  target: Rect
): { time: number; side: string; entryBoth: boolean } | null {
  const invEntry = { x: 0, y: 0 };
  const invExit = { x: 0, y: 0 };

  if (velocity.x > 0) {
    invEntry.x = target.x - (moving.x + moving.width);
    invExit.x = target.x + target.width - moving.x;
  } else {
    invEntry.x = target.x + target.width - moving.x;
    invExit.x = target.x - (moving.x + moving.width);
  }

  if (velocity.y > 0) {
    invEntry.y = target.y - (moving.y + moving.height);
    invExit.y = target.y + target.height - moving.y;
  } else {
    invEntry.y = target.y + target.height - moving.y;
    invExit.y = target.y - (moving.y + moving.height);
  }

  const entry = {
    x: velocity.x === 0 ? -Infinity : invEntry.x / velocity.x,
    y: velocity.y === 0 ? -Infinity : invEntry.y / velocity.y,
  };

  const exit = {
    x: velocity.x === 0 ? Infinity : invExit.x / velocity.x,
    y: velocity.y === 0 ? Infinity : invExit.y / velocity.y,
  };

  const entryTime = Math.max(entry.x, entry.y);
  const exitTime = Math.min(exit.x, exit.y);

  if (
    entryTime > exitTime ||
    (entry.x < 0 && entry.y < 0) ||
    entryTime < 0 ||
    entryTime > 1
  ) {
    return null;
  }

  const entryBoth =
    entry.x >= 0 && entry.x <= 1 && entry.y >= 0 && entry.y <= 1;

  let side: string;
  if (entry.x > entry.y) {
    side = velocity.x > 0 ? "left" : "right";
  } else {
    side = velocity.y > 0 ? "top" : "bottom";
  }

  return { time: entryTime, side, entryBoth };
}
