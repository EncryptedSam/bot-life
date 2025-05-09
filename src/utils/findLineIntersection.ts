type Point = { x: number; y: number };
type Direction = "vertical" | "horizontal";

export function findLineIntersection(
  fixedValue: number,
  direction: Direction,
  point1: Point,
  point2: Point
): Point | string {
  const { x: x1, y: y1 } = point1;
  const { x: x2, y: y2 } = point2;

  if (direction === "vertical") {
    // Handle vertical intersection: x = fixedValue
    if (x1 === x2) {
      return x1 === fixedValue
        ? "Infinite intersections (lines overlap)"
        : "No intersection (parallel vertical lines)";
    }

    const m = (y2 - y1) / (x2 - x1);
    const b = y1 - m * x1;
    const x = fixedValue;
    const y = m * x + b;

    return { x, y };
  }

  if (direction === "horizontal") {
    // Handle horizontal intersection: y = fixedValue
    if (y1 === y2) {
      return y1 === fixedValue
        ? "Infinite intersections (lines overlap)"
        : "No intersection (parallel horizontal lines)";
    }

    const m = (y2 - y1) / (x2 - x1);
    const b = y1 - m * x1;
    const y = fixedValue;
    const x = (y - b) / m;

    return { x, y };
  }

  return "Invalid direction";
}
