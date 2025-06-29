import { circleCircleIntersect } from "./circleCircleIntersect";
import { rectTouchesCircle } from "./rectTouchesCircle";

type Point = { x: number; y: number };
export type Circle = { center: Point; radius: number };

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

export type AABBRect = {
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

export function detectRectCircleCollision(aabb: AABBRect, circle: Circle) {
  let res = rectCircleIntersect(
    { point: { ...aabb.a }, height: aabb.height, width: aabb.width },
    circle
  );

  if (res) {
    return true;
  }

  res = rectCircleIntersect(
    { point: { ...aabb.b }, height: aabb.height, width: aabb.width },
    circle
  );

  if (res) {
    return true;
  }

  let deg = angleBetweenPoints(
    { x: aabb.a.x, y: aabb.a.y },
    { x: aabb.b.x, y: aabb.b.y }
  );

  let lines = getLlinePoints(deg, aabb.a, aabb.b, aabb.height, aabb.width);

  if (lines) {
    let { line1, line2 } = lines;

    res = rectTouchesCircle([...line1, ...line2], circle);

    if (res) {
      return true;
    }
  }

  return false;
}

export interface AABBCircle {
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
