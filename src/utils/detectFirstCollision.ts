type Point = { x: number; y: number };
type Rect = { x: number; y: number; width: number; height: number };
type HitResult = { object: Rect; side: string; time: number } | null;

export function detectFirstCollision(
  pointA: Point,
  pointB: Point,
  movingWidth: number,
  movingHeight: number,
  collidables: Rect[]
): HitResult {
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

  let earliest: HitResult = null;

  for (const target of collidables) {
    const result = sweptAABB(movingObj, velocity, target);

    if (result && (!earliest || result.time < earliest.time)) {
      earliest = {
        object: target,
        side: result.side,
        time: result.time,
      };
    }
  }

  return earliest;
}

function sweptAABB(
  moving: Rect,
  velocity: Point,
  target: Rect
): { time: number; side: string } | null {
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

  // Add range checks for straight-line movement
  if (velocity.y === 0) {
    const movingYMin = moving.y;
    const movingYMax = moving.y + moving.height;
    const targetYMin = target.y;
    const targetYMax = target.y + target.height;
    if (movingYMax < targetYMin || movingYMin > targetYMax) {
      return null; // No overlap in y-axis, no collision possible
    }
  }

  if (velocity.x === 0) {
    const movingXMin = moving.x;
    const movingXMax = moving.x + moving.width;
    const targetXMin = target.x;
    const targetXMax = target.x + target.width;
    if (movingXMax < targetXMin || movingXMin > targetXMax) {
      return null; // No overlap in x-axis, no collision possible
    }
  }

  // Calculate entry and exit times
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

  // Collision validation
  if (
    entryTime > exitTime ||
    (entry.x < 0 && entry.y < 0) ||
    entryTime < 0 ||
    entryTime > 1
  ) {
    return null; // No valid collision
  }

  // Determine collision side
  let side: string;
  if (velocity.y === 0) {
    // Horizontal movement: determine if collision is on top or bottom
    if (moving.y + moving.height <= target.y) {
      side = "top"; // Moving object hits the top of the target
    } else if (moving.y >= target.y + target.height) {
      side = "bottom"; // Moving object hits the bottom of the target
    } else {
      // If the moving object is overlapping in y, use x-axis to determine side
      side = velocity.x > 0 ? "left" : "right";
    }
  } else if (velocity.x === 0) {
    // Vertical movement: determine if collision is on left or right
    if (moving.x + moving.width <= target.x) {
      side = "left"; // Moving object hits the left of the target
    } else if (moving.x >= target.x + target.width) {
      side = "right"; // Moving object hits the right of the target
    } else {
      // If the moving object is overlapping in x, use y-axis to determine side
      side = velocity.y > 0 ? "top" : "bottom";
    }
  } else {
    // Diagonal movement: use the original entry time comparison
    if (entry.x > entry.y) {
      side = velocity.x > 0 ? "left" : "right";
    } else {
      side = velocity.y > 0 ? "top" : "bottom";
    }
  }

  return { time: entryTime, side };
}
