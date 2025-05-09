type Point = { x: number; y: number };
type Rect = { x: number; y: number; width: number; height: number };
type CollisionResult = {
  sides: ("left" | "right" | "top" | "bottom")[];
  pointC: Point;
} | null;

export function detectCollision(
  pointA: Point,
  pointB: Point,
  boxSize: { width: number; height: number },
  obstacles: Rect[]
): CollisionResult {
  let earliestCollision: {
    time: number;
    sides: ("left" | "right" | "top" | "bottom")[];
    pointC: Point;
  } | null = null;

  const velocity = {
    x: pointB.x - pointA.x,
    y: pointB.y - pointA.y,
  };

  for (const obstacle of obstacles) {
    const result = sweptAABB(
      {
        x: pointA.x,
        y: pointA.y,
        width: boxSize.width,
        height: boxSize.height,
      },
      velocity,
      obstacle
    );

    if (
      result &&
      (earliestCollision === null || result.time < earliestCollision.time)
    ) {
      earliestCollision = result;
    }
  }

  return earliestCollision
    ? { sides: earliestCollision.sides, pointC: earliestCollision.pointC }
    : null;
}

function sweptAABB(
  moving: Rect,
  velocity: { x: number; y: number },
  target: Rect
): {
  time: number;
  sides: ("left" | "right" | "top" | "bottom")[];
  pointC: Point;
} | null {
  const invEntry: Point = {
    x:
      velocity.x > 0
        ? target.x - (moving.x + moving.width)
        : target.x + target.width - moving.x,
    y:
      velocity.y > 0
        ? target.y - (moving.y + moving.height)
        : target.y + target.height - moving.y,
  };

  const invExit: Point = {
    x:
      velocity.x > 0
        ? target.x + target.width - moving.x
        : target.x - (moving.x + moving.width),
    y:
      velocity.y > 0
        ? target.y + target.height - moving.y
        : target.y - (moving.y + moving.height),
  };

  const entry: Point = {
    x: velocity.x === 0 ? -Infinity : invEntry.x / velocity.x,
    y: velocity.y === 0 ? -Infinity : invEntry.y / velocity.y,
  };

  const exit: Point = {
    x: velocity.x === 0 ? Infinity : invExit.x / velocity.x,
    y: velocity.y === 0 ? Infinity : invExit.y / velocity.y,
  };

  const entryTime = Math.max(entry.x, entry.y);
  const exitTime = Math.min(exit.x, exit.y);

  if (entryTime > exitTime || (entry.x < 0 && entry.y < 0) || entryTime > 1) {
    return null;
  }

  const sides: ("left" | "right" | "top" | "bottom")[] = [];
  if (entry.x > entry.y) {
    sides.push(velocity.x > 0 ? "right" : "left");
  } else if (entry.y > entry.x) {
    sides.push(velocity.y > 0 ? "bottom" : "top");
  } else {
    if (velocity.x !== 0) sides.push(velocity.x > 0 ? "right" : "left");
    if (velocity.y !== 0) sides.push(velocity.y > 0 ? "bottom" : "top");
  }

  const pointC: Point = {
    x: moving.x + velocity.x * entryTime + moving.width / 2,
    y: moving.y + velocity.y * entryTime + moving.height / 2,
  };

  return { time: entryTime, sides, pointC };
}
