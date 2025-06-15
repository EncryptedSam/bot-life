import { rectTouchesCircle } from "./rectTouchesCircle";

type Point = { x: number; y: number };
type Circle = { center: Point; radius: number };

export function getCircleDiameterEndpoints(
  circle: Circle,
  degree: number
): [Point, Point] {
  // Convert degrees to radians
  const radians = (degree * Math.PI) / 180;

  // Calculate the offset from center using trigonometry
  const offsetX = circle.radius * Math.cos(radians);
  const offsetY = circle.radius * Math.sin(radians);

  // First endpoint: center + offset
  const point1: Point = {
    x: circle.center.x + offsetX,
    y: circle.center.y + offsetY,
  };

  // Second endpoint: center - offset (opposite direction)
  const point2: Point = {
    x: circle.center.x - offsetX,
    y: circle.center.y - offsetY,
  };

  return [point1, point2];
}

function isPointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const pi = polygon[i];
    const pj = polygon[j];

    if (
      pi.y > point.y !== pj.y > point.y &&
      point.x < ((pj.x - pi.x) * (point.y - pi.y)) / (pj.y - pi.y) + pi.x
    ) {
      inside = !inside;
    }
  }

  return inside;
}

function getClosestPointOnLineSegment(
  point: Point,
  p1: Point,
  p2: Point
): Point {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  if (dx === 0 && dy === 0) {
    // Line segment is actually a point
    return p1;
  }

  // Calculate parameter t for the closest point on the line
  const t = Math.max(
    0,
    Math.min(
      1,
      ((point.x - p1.x) * dx + (point.y - p1.y) * dy) / (dx * dx + dy * dy)
    )
  );

  return {
    x: p1.x + t * dx,
    y: p1.y + t * dy,
  };
}

function getDistance(p1: Point, p2: Point): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function isCircleIntersectingLineSegment(
  circle: Circle,
  p1: Point,
  p2: Point
): boolean {
  const closestPoint = getClosestPointOnLineSegment(circle.center, p1, p2);

  const distance = getDistance(circle.center, closestPoint);

  return distance <= circle.radius;
}

function isCircleIntersectingPolygon(points: Point[], circle: Circle): boolean {
  if (points.length < 3) {
    throw new Error("At least 3 points are required to form a polygon");
  }

  const isCenterInside = isPointInPolygon(circle.center, points);

  if (isCenterInside) {
    return true;
  }

  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];

    if (isCircleIntersectingLineSegment(circle, p1, p2)) {
      return true;
    }
  }

  return false;
}

export function angleBetweenPoints(A: Point, B: Point): number {
  const dx = B.x - A.x;
  const dy = B.y - A.y;
  const radians = Math.atan2(dy, dx);
  let degrees = radians * (180 / Math.PI);

  if (degrees < 0) {
    degrees += 360;
  }

  return degrees;
}

interface Lines {
  line1: [Point, Point];
  line2: [Point, Point];
}

function getLlinePoints(
  deg: number,
  a: Point,
  b: Point,
  height: number,
  width: number
): Lines | null {
  if (deg >= 0 && deg <= 90) {
    let line1: Lines["line1"] = [
      { x: a.x + width, y: a.y },
      { x: b.x + width, y: b.y },
    ];

    let line2: Lines["line2"] = [
      { x: a.x, y: a.y + height },
      { x: b.x, y: b.y + height },
    ];

    return { line1, line2 };
  }

  if (deg >= 90 && deg <= 180) {
    let line1: Lines["line1"] = [
      { x: a.x, y: a.y },
      { x: b.x, y: b.y },
    ];

    let line2: Lines["line2"] = [
      { x: a.x + width, y: a.y + height },
      { x: b.x + width, y: b.y + height },
    ];

    return { line1, line2 };
  }

  if (deg >= 180 && deg <= 270) {
    let line1: Lines["line1"] = [
      { x: a.x + width, y: a.y },
      { x: b.x + width, y: b.y },
    ];

    let line2: Lines["line2"] = [
      { x: a.x, y: a.y + height },
      { x: b.x, y: b.y + height },
    ];

    return { line1, line2 };
  }

  if (deg >= 270 && deg <= 360) {
    let line1: Lines["line1"] = [
      { x: a.x, y: a.y },
      { x: b.x, y: b.y },
    ];

    let line2: Lines["line2"] = [
      { x: a.x + width, y: a.y + height },
      { x: b.x + width, y: b.y + height },
    ];

    return { line1, line2 };
  }

  return null;
}

type AABBRect = {
  a: Point;
  b: Point;
  height: number;
  width: number;
};

type Rect = {
  height: number;
  width: number;
  point: Point; // assuming this is the top-left corner
};

function rectCircleIntersect(rect: Rect, circle: Circle): boolean {
  // Find the closest point on the rectangle to the circle's center
  const closestX = Math.max(
    rect.point.x,
    Math.min(circle.center.x, rect.point.x + rect.width)
  );
  const closestY = Math.max(
    rect.point.y,
    Math.min(circle.center.y, rect.point.y + rect.height)
  );

  // Calculate the distance from the circle's center to this closest point
  const distanceX = circle.center.x - closestX;
  const distanceY = circle.center.y - closestY;
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;

  // Check if the distance is less than or equal to the circle's radius
  return distanceSquared <= circle.radius * circle.radius;
}

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

export function detectRectCircleCollision(
  aabb: AABBRect,
  circle: Circle
): Point[] {
  let res = rectCircleIntersect(
    { height: aabb.height, width: aabb.width, point: { ...aabb.a } },
    circle
  );

  //   console.log(res);

  //   const deg = angleBetweenPoints(aabb.a, aabb.b);

  //   let lines = getLlinePoints(deg, aabb.a, aabb.b, aabb.height, aabb.width);

  //   if (lines != null) {
  //     let res = isCircleIntersectingPolygon(
  //       [...lines.line1, ...lines.line2],
  //       circle
  //     );

  //     console.log(res);

  //     return [...lines.line1, ...lines.line2];
  //   }

  return [];
}

interface AABBCircle {
  a: Point;
  b: Point;
  radius: number;
}

export function detectCircleCircleCollision(
  aabb: AABBCircle,
  circle: Circle
): boolean {
  let res = circleCircleIntersect(
    { center: { ...aabb.a }, radius: aabb.radius },
    circle
  );

  if (res) {
    return true;
  }

  res = circleCircleIntersect(
    { center: { ...aabb.b }, radius: aabb.radius },
    circle
  );
  if (res) {
    return true;
  }

  let deg = angleBetweenPoints(
    { x: aabb.a.x, y: aabb.a.y },
    { x: aabb.b.x, y: aabb.b.y }
  );

  let circle1: Circle = {
    center: { x: aabb.a.x, y: aabb.a.y },
    radius: aabb.radius,
  };
  let circle2: Circle = {
    center: { x: aabb.b.x, y: aabb.b.y },
    radius: aabb.radius,
  };

  let point1 = getCircleDiameterEndpoints(circle1, deg + 90);
  let point2 = getCircleDiameterEndpoints(circle2, deg + 90);

  res = rectTouchesCircle([...point1, ...point2], circle);

  if (res) {
    return true;
  }

  return false;
}
