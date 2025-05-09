type Point = { x: number; y: number };
type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function getIntersection(
  p1: Point,
  p2: Point,
  p3: Point,
  p4: Point
): Point | null {
  // Line-line intersection formula
  const s1_x = p2.x - p1.x;
  const s1_y = p2.y - p1.y;
  const s2_x = p4.x - p3.x;
  const s2_y = p4.y - p3.y;

  const s =
    (-s1_y * (p1.x - p3.x) + s1_x * (p1.y - p3.y)) /
    (-s2_x * s1_y + s1_x * s2_y);
  const t =
    (s2_x * (p1.y - p3.y) - s2_y * (p1.x - p3.x)) /
    (-s2_x * s1_y + s1_x * s2_y);

  if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
    // Intersection detected
    return {
      x: p1.x + t * s1_x,
      y: p1.y + t * s1_y,
    };
  }

  return null; // No intersection
}

export function detectFirstHit(pointA: Point, pointB: Point, objects: Rect[]) {
  let closest = null;

  for (const obj of objects) {
    const sides = {
      top: [
        { x: obj.x, y: obj.y },
        { x: obj.x + obj.width, y: obj.y },
      ],
      right: [
        { x: obj.x + obj.width, y: obj.y },
        { x: obj.x + obj.width, y: obj.y + obj.height },
      ],
      bottom: [
        { x: obj.x, y: obj.y + obj.height },
        { x: obj.x + obj.width, y: obj.y + obj.height },
      ],
      left: [
        { x: obj.x, y: obj.y },
        { x: obj.x, y: obj.y + obj.height },
      ],
    };

    for (const [side, [p1, p2]] of Object.entries(sides)) {
      const intersection = getIntersection(pointA, pointB, p1, p2);
      if (intersection) {
        const dx = intersection.x - pointA.x;
        const dy = intersection.y - pointA.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (!closest || distance < closest.distance) {
          closest = {
            side,
            point: intersection,
            distance,
          };
        }
      }
    }
  }

  return closest;
}
