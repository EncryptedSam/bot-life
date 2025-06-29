type Point = { x: number, y: number };
type Circle = { center: Point, radius: number };
type RectSweep = { pointA: Point, pointB: Point, width: number, height: number };


// Check if a moving AABB rectangle intersects a circle (static)
export function sweptAABBvsCircle(rect: RectSweep, circle: Circle): boolean {
  const { pointA, pointB, width, height } = rect;
  const velocity = {
    x: pointB.x - pointA.x,
    y: pointB.y - pointA.y,
  };

  // Build AABB bounds at start and end positions
  const rectA = {
    minX: pointA.x,
    minY: pointA.y,
    maxX: pointA.x + width,
    maxY: pointA.y + height,
  };

  const rectB = {
    minX: pointB.x,
    minY: pointB.y,
    maxX: pointB.x + width,
    maxY: pointB.y + height,
  };

  // Build the swept AABB that covers from A to B
  const sweptAABB = {
    minX: Math.min(rectA.minX, rectB.minX),
    minY: Math.min(rectA.minY, rectB.minY),
    maxX: Math.max(rectA.maxX, rectB.maxX),
    maxY: Math.max(rectA.maxY, rectB.maxY),
  };

  // Early out: if the swept AABB doesn't intersect the circle's AABB, no collision
  const circleAABB = {
    minX: circle.center.x - circle.radius,
    minY: circle.center.y - circle.radius,
    maxX: circle.center.x + circle.radius,
    maxY: circle.center.y + circle.radius,
  };

  const aabbOverlap =
    sweptAABB.maxX >= circleAABB.minX &&
    sweptAABB.minX <= circleAABB.maxX &&
    sweptAABB.maxY >= circleAABB.minY &&
    sweptAABB.minY <= circleAABB.maxY;

  if (!aabbOverlap) return false;

  // Approximate: sweep the rectangle's center as a point toward the circle
  const rectCenterStart = {
    x: pointA.x + width / 2,
    y: pointA.y + height / 2,
  };

  const dx = circle.center.x - rectCenterStart.x;
  const dy = circle.center.y - rectCenterStart.y;
  const radiusSum = circle.radius + Math.max(width, height) / 2;

  const a = velocity.x ** 2 + velocity.y ** 2;
  const b = 2 * (velocity.x * dx + velocity.y * dy);
  const c = dx ** 2 + dy ** 2 - radiusSum ** 2;

  const discriminant = b ** 2 - 4 * a * c;

  if (discriminant < 0) return false;

  const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
  const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);

  // If any time `t` within [0,1] exists, a collision occurs during the sweep
  return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1);
}
