type Point = { x: number; y: number };

export function rectTouchesCircle(
  rectPoints: [Point, Point, Point, Point],
  circle: { center: Point; radius: number }
): boolean {
  // Step 1: Sort points to form a polygon in clockwise order
  const center = {
    x: rectPoints.reduce((sum, p) => sum + p.x, 0) / 4,
    y: rectPoints.reduce((sum, p) => sum + p.y, 0) / 4,
  };

  const sorted = rectPoints.slice().sort((a, b) => {
    const angleA = Math.atan2(a.y - center.y, a.x - center.x);
    const angleB = Math.atan2(b.y - center.y, b.x - center.x);
    return angleA - angleB;
  });

  // Step 2: Check if circle center is inside the rectangle
  if (pointInPolygon(circle.center, sorted)) return true;

  // Step 3: Check each edge of the rectangle for intersection
  for (let i = 0; i < 4; i++) {
    const p1 = sorted[i];
    const p2 = sorted[(i + 1) % 4];
    if (lineSegmentIntersectsCircle(p1, p2, circle.center, circle.radius)) {
      return true;
    }
  }

  return false;
}

// Helper: Check if point is inside polygon
function pointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x,
      yi = polygon[i].y;
    const xj = polygon[j].x,
      yj = polygon[j].y;

    const intersect =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi + 0.00001) + xi;

    if (intersect) inside = !inside;
  }
  return inside;
}

// Helper: Check if line segment intersects circle
function lineSegmentIntersectsCircle(
  p1: Point,
  p2: Point,
  center: Point,
  radius: number
): boolean {
  // Vector from p1 to p2
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  // Vector from p1 to circle center
  const fx = p1.x - center.x;
  const fy = p1.y - center.y;

  const a = dx * dx + dy * dy;
  const b = 2 * (fx * dx + fy * dy);
  const c = fx * fx + fy * fy - radius * radius;

  let discriminant = b * b - 4 * a * c;
  if (discriminant < 0) {
    return false;
  }

  discriminant = Math.sqrt(discriminant);
  const t1 = (-b - discriminant) / (2 * a);
  const t2 = (-b + discriminant) / (2 * a);

  return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1);
}
