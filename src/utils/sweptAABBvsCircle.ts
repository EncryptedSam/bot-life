type Box = { x: number; y: number; width: number; height: number };
type Velocity = { dx: number; dy: number };
type Collision = { time: number; normalX: number; normalY: number } | null;

export function sweptAABBvsCircle(
  moving: Box,
  velocity: Velocity,
  circle: { cx: number; cy: number; radius: number }
): Collision {
  const boxCenterX = moving.x + moving.width / 2;
  const boxCenterY = moving.y + moving.height / 2;

  const inflatedRadius =
    circle.radius + Math.max(moving.width, moving.height) / 2;

  const relX = boxCenterX - circle.cx;
  const relY = boxCenterY - circle.cy;

  const dx = velocity.dx;
  const dy = velocity.dy;

  const a = dx * dx + dy * dy;
  const b = 2 * (relX * dx + relY * dy);
  const c = relX * relX + relY * relY - inflatedRadius * inflatedRadius;

  const discriminant = b * b - 4 * a * c;

  if (discriminant < 0 || a === 0) return null;

  const sqrtD = Math.sqrt(discriminant);
  const t1 = (-b - sqrtD) / (2 * a);
  const t2 = (-b + sqrtD) / (2 * a);

  const time = t1 >= 0 && t1 <= 1 ? t1 : t2 >= 0 && t2 <= 1 ? t2 : 1;

  if (time === 1) return null;

  const impactX = boxCenterX + dx * time;
  const impactY = boxCenterY + dy * time;

  let normalX = impactX - circle.cx;
  let normalY = impactY - circle.cy;
  const len = Math.hypot(normalX, normalY);

  if (len === 0) return null;

  normalX /= len;
  normalY /= len;

  const result = { time, normalX, normalY };
  return result;
}
