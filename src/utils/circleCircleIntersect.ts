type Point = { x: number; y: number };
type Circle = { center: Point; radius: number };


export function circleCircleIntersect(
  circle1: Circle,
  circle2: Circle
): boolean {
  // Calculate the distance between the centers
  const distanceX = circle1.center.x - circle2.center.x;
  const distanceY = circle1.center.y - circle2.center.y;
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;

  // Calculate the sum of radii
  const radiusSum = circle1.radius + circle2.radius;
  const radiusSumSquared = radiusSum * radiusSum;

  // Circles intersect if distance between centers <= sum of radii
  return distanceSquared <= radiusSumSquared;
}