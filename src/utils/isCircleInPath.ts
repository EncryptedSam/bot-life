// Define a Point interface for clarity
interface Point {
  x: number;
  y: number;
}

// Function to check if the circle collides with the object's path from A to B
export function isCircleInPath(
  pointA: Point, // Center of the square at the start
  pointB: Point, // Center of the square at the end
  squareWidth: number, // Width of the square
  squareHeight: number, // Height of the square
  circleCenter: Point, // Center of the collidable circle
  circleRadius: number // Radius of the collidable circle
): boolean {
  // Step 1: Validate inputs
  if (squareWidth <= 0 || squareHeight <= 0 || circleRadius <= 0) {
    return false; // Invalid dimensions
  }

  // Step 2: Approximate the square as a circle for collision detection
  // The square's circumradius (distance from center to corner) is half the diagonal
  const squareDiagonal = Math.sqrt(
    squareWidth * squareWidth + squareHeight * squareHeight
  );
  const squareEffectiveRadius = squareDiagonal / 2;

  // Step 3: Compute the closest distance from the circle's center to the line segment AB
  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;

  // If A and B are the same point, treat it as a static collision check
  if (Math.abs(dx) < 0.0001 && Math.abs(dy) < 0.0001) {
    const distToCircle = Math.sqrt(
      (circleCenter.x - pointA.x) ** 2 + (circleCenter.y - pointA.y) ** 2
    );
    return distToCircle <= squareEffectiveRadius + circleRadius;
  }

  // Parametric form of the line: P(t) = A + t * (B - A), t in [0,1]
  // Find the closest point on the line segment to the circle's center
  const t =
    ((circleCenter.x - pointA.x) * dx + (circleCenter.y - pointA.y) * dy) /
    (dx * dx + dy * dy);

  // Clamp t to the range [0,1] to ensure the closest point is on the segment
  const tClamped = Math.max(0, Math.min(1, t));

  // Compute the closest point on the segment
  const closestPoint: Point = {
    x: pointA.x + tClamped * dx,
    y: pointA.y + tClamped * dy,
  };

  // Step 4: Compute the distance from the circle's center to the closest point
  const distance = Math.sqrt(
    (circleCenter.x - closestPoint.x) ** 2 +
      (circleCenter.y - closestPoint.y) ** 2
  );

  // Step 5: Check for collision
  // Collision occurs if the distance is less than or equal to the sum of the radii
  return distance <= squareEffectiveRadius + circleRadius;
}

// Example usage (based on the diagram)
const pointA: Point = { x: 0, y: 0 }; // Assuming Point A is at origin for simplicity
const pointB: Point = { x: 10, y: 10 }; // Point B, assuming some distance
const squareWidth = 4; // Example width of the square
const squareHeight = 4; // Example height of the square
const circleCenter: Point = { x: 5, y: 5 }; // Circle roughly at the midpoint
const circleRadius = 2; // Example radius

const result = isCircleInPath(
  pointA,
  pointB,
  squareWidth,
  squareHeight,
  circleCenter,
  circleRadius
);

console.log(result); // Likely true, as the circle is on the path
