import React, { useEffect, useState } from 'react'
import { detectCollision } from '../utils/detectCollision'
import { detectFirstHit } from '../utils/detectFirstHit'
import { detectFirstCollision } from '../utils/detectFirstCollision'
import { detectDualAxisHits } from '../utils/detectDualAxisHits'
import { sweptAABBvsCircle } from '../utils/sweptAABBvsCircle'
import Circle from './Hero'
import { isCircleInPath } from '../utils/isCircleInPath'


interface Point {
    x: number
    y: number
}

interface HeroBox {
    width: number
    height: number
}

interface Brick {
    x: number
    y: number
    width: number
    height: number
}

interface Circle {
    x: number
    y: number
    radius: number
}



const Collision = () => {
    const [heroBox, setHeroBox] = useState<HeroBox>({ height: 100, width: 100 });

    const [circles, setCircles] = useState<Circle[]>([{ x: 100, y: 100, radius: 50 }]);

    const [linePoints, setLinePoints] = useState<Point[]>([
        { x: 10, y: 10 },
        { x: 400, y: 400 }
    ]);

    const [pointC, setPointC] = useState<Point | null>(null);

    const [bricks, setBricks] = useState<Brick[]>([
        // { x: 100, y: 100, width: 25, height: 25 },
        { x: 100, y: 200, width: 100, height: 100 },
        // { x: 100, y: 200, width: 100, height: 100 },
    ]);

    const [brickId, setBrickId] = useState<null | number>(null);
    const [pointId, setPointId] = useState<null | number>(null);
    const [circleId, setCircleId] = useState<null | number>(null);


    useEffect(() => {
        let pointPrevState: Point | null = pointId != null ? linePoints[pointId] : null;
        let brickPrevState: Brick | null = brickId != null ? bricks[brickId] : null;
        let circlePrevState: Circle | null = circleId != null ? circles[circleId] : null;

        let x: number = 0;
        let y: number = 0;

        function handleMouseMove(event: MouseEvent) {
            let dx = event.clientX - x;
            let dy = event.clientY - y;

            if (brickPrevState && brickId != null) {
                setBricks((prevState) => {
                    let copy = JSON.parse(JSON.stringify(prevState));
                    copy[brickId] = { ...brickPrevState, x: brickPrevState.x + dx, y: brickPrevState.y + dy };
                    return copy;
                })
            }

            if (circlePrevState && circleId != null) {
                setCircles((prevState) => {
                    let copy = JSON.parse(JSON.stringify(prevState));
                    copy[circleId] = { ...circlePrevState, x: circlePrevState.x + dx, y: circlePrevState.y + dy };
                    return copy;
                })
            }

            if (pointPrevState && pointId != null) {
                setLinePoints((prevState) => {
                    let copy = JSON.parse(JSON.stringify(prevState));
                    copy[pointId] = { ...pointPrevState, x: pointPrevState.x + dx, y: pointPrevState.y + dy };
                    return copy;
                })
            }
        }

        function handleMouseDown(event: MouseEvent) {
            x = event.clientX;
            y = event.clientY;
        }

        function handleMouseUp() {
            setBrickId(null);
            setPointId(null);
            setCircleId(null);
        }

        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mousedown", handleMouseDown)
        window.addEventListener("mouseup", handleMouseUp)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mousedown", handleMouseDown)
            window.removeEventListener("mouseup", handleMouseUp)
        }
    }, [brickId, pointId, circleId])


    useEffect(() => {

        console.clear();

        function signedDistanceToLine(
            x1: number, y1: number,
            x2: number, y2: number,
            cx: number, cy: number
        ): number {
            const dx = x2 - x1;
            const dy = y2 - y1;
            return ((dx) * (y1 - cy) - (x1 - cx) * (dy)) / Math.sqrt(dx * dx + dy * dy);
        }

        function isCircleBetweenTwoLines(
            A1: [number, number], B1: [number, number],
            A2: [number, number], B2: [number, number],
            center: [number, number], radius: number
        ): boolean {
            const d1 = signedDistanceToLine(A1[0], A1[1], B1[0], B1[1], center[0], center[1]);
            const d2 = signedDistanceToLine(A2[0], A2[1], B2[0], B2[1], center[0], center[1]);

            const oppositeSides = d1 * d2 < 0;
            const clearFromLines = Math.abs(d1) >= radius && Math.abs(d2) >= radius;

            return oppositeSides && clearFromLines;
        }


        let x1 = linePoints[0].x;
        let y1 = linePoints[0].y;

        let x2 = linePoints[1].x;
        let y2 = linePoints[1].y;

        let hw = heroBox.width;
        let hh = heroBox.height;

        let cx = circles[0].x;
        let cy = circles[0].y;
        let r = circles[0].radius;

        {
            let A1: [number, number] = [x1 + hw, y1]
            let B1: [number, number] = [x2 + hw, y2]

            let A2: [number, number] = [x1, y1 + hh]
            let B2: [number, number] = [x2, y2 + hh]

            let center: [number, number] = [cx, cy]
            let radius = r;


            let res = isCircleBetweenTwoLines(A1, B1, A2, B2, center, radius);
            // console.log(res);
        }

        {
            type Point = { x: number; y: number };

            type Result = {
                contacts: boolean;
                position: "above" | "below" | "on";
            };

            function analyzeCircleLineContact(
                linePoint1: Point,
                linePoint2: Point,
                circleCenter: Point,
                r: number
            ): Result {
                const { x: x1, y: y1 } = linePoint1;
                const { x: x2, y: y2 } = linePoint2;
                const { x: cx, y: cy } = circleCenter;

                // Line: Ax + By + C = 0
                const A = y2 - y1;
                const B = x1 - x2;
                const C = x2 * y1 - x1 * y2;

                // Distance from center to line
                const distance = Math.abs(A * cx + B * cy + C) / Math.sqrt(A * A + B * B);

                // Check if the circle contacts the line
                const contacts = distance <= r;

                // Determine if the circle is above, below, or on the line
                const lineYAtCX = ((x2 - x1) === 0)
                    ? Infinity // Vertical line
                    : y1 + ((y2 - y1) / (x2 - x1)) * (cx - x1);

                let position: Result["position"];
                if (Math.abs(cy - lineYAtCX) < 1e-8) {
                    position = "on";
                } else {
                    position = cy < lineYAtCX ? "above" : "below";
                }

                return { contacts, position };
            }

            let p1 = { x: x1 + hw, y: y1 }
            let p2 = { x: x2 + hw, y: y2 }
            let pc = { x: cx, y: cy }





            // const result = analyzeCircleLineContact(p1, p2, pc, r);

            // console.log(result);

        }

        type Point = { x: number; y: number };



        function isCircleIntersectingPolygon(
            polygon: Point[],
            circleCenter: Point,
            radius: number
        ): boolean {
            // Step 1: Check if circle intersects any polygon edge
            for (let i = 0; i < polygon.length; i++) {
                const a = polygon[i];
                const b = polygon[(i + 1) % polygon.length];
                if (doesCircleIntersectLineSegment(circleCenter, radius, a, b)) {
                    return true;
                }
            }

            // Step 2: Check if circle center is inside polygon
            if (isPointInPolygon(circleCenter, polygon)) {
                return true;
            }

            // (Optional) Step 3: Check if polygon is fully inside the circle
            // If needed: check if all vertices are within the circle

            return false;
        }

        // Check if a point is inside polygon using ray casting
        function isPointInPolygon(point: Point, polygon: Point[]): boolean {
            let inside = false;
            for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
                const xi = polygon[i].x,
                    yi = polygon[i].y;
                const xj = polygon[j].x,
                    yj = polygon[j].y;

                const intersect =
                    yi > point.y !== yj > point.y &&
                    point.x <
                    ((xj - xi) * (point.y - yi)) / (yj - yi + Number.EPSILON) + xi;
                if (intersect) inside = !inside;
            }
            return inside;
        }

        // Check if circle intersects with a line segment
        function doesCircleIntersectLineSegment(
            circle: Point,
            radius: number,
            p1: Point,
            p2: Point
        ): boolean {
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const l2 = dx * dx + dy * dy;

            // Project center onto line segment, clamp between 0 and 1
            const t = Math.max(
                0,
                Math.min(
                    1,
                    ((circle.x - p1.x) * dx + (circle.y - p1.y) * dy) / (l2 || 1)
                )
            );
            const nearestX = p1.x + t * dx;
            const nearestY = p1.y + t * dy;

            const distX = circle.x - nearestX;
            const distY = circle.y - nearestY;

            return distX * distX + distY * distY <= radius * radius;
        }
        {

            let x1 = linePoints[0].x;
            let y1 = linePoints[0].y;

            let x2 = linePoints[1].x;
            let y2 = linePoints[1].y;

            let hw = heroBox.width;
            let hh = heroBox.height;

            let cx = circles[0].x;
            let cy = circles[0].y;
            let r = circles[0].radius;


            let res = isCircleIntersectingPolygon(
                [
                    { x: x1, y: y1 },
                    { x: x1 + hw, y: y1 },
                    { x: x2 + hw, y: y2 },
                    { x: x2 + hw, y: y2 + hh },
                    { x: x2, y: y2 + hh },
                    { x: x1, y: y1 + hh },
                ],
                { x: cx, y: cy },
                r
            );
            // console.log(res);
        }




    }, [linePoints, heroBox, bricks, circles])



    return (
        <div
            className='relative w-screen h-screen bg-gray-950 flex items-center justify-center'
        >
            <div className='relative w-[800px] h-[500px] bg-gray-950 select-none' >
                <svg
                    className='absolute pointer-events-none w-full h-full top-0 left-0'
                >
                    <line
                        x1={linePoints[0].x}
                        y1={linePoints[0].y}
                        x2={linePoints[1].x}
                        y2={linePoints[1].y}
                        stroke={'white'}
                        strokeWidth={1}
                        strokeDasharray={`${2},${2}`}
                    />
                    <line
                        x1={linePoints[0].x + heroBox.width}
                        y1={linePoints[0].y}
                        x2={linePoints[1].x + heroBox.width}
                        y2={linePoints[1].y}
                        stroke={'white'}
                        strokeWidth={1}
                        strokeDasharray={`${2},${2}`}
                    />
                    <line
                        x1={linePoints[0].x}
                        y1={linePoints[0].y + heroBox.height}
                        x2={linePoints[1].x}
                        y2={linePoints[1].y + heroBox.height}
                        stroke={'white'}
                        strokeWidth={1}
                        strokeDasharray={`${2},${2}`}
                    />
                    <line
                        x1={linePoints[0].x + heroBox.width}
                        y1={linePoints[0].y + heroBox.height}
                        x2={linePoints[1].x + heroBox.width}
                        y2={linePoints[1].y + heroBox.height}
                        stroke={'white'}
                        strokeWidth={1}
                        strokeDasharray={`${2},${2}`}
                    />
                </svg>

                {
                    bricks.map(({ height, width, x, y }, idx) => {
                        return (
                            <div
                                className='absolute cursor-pointer border border-white text-white inline-flex items-center justify-center'
                                key={`bick_${idx}`}
                                style={{ width, height, left: x, top: y }}
                                onMouseDown={() => { setBrickId(idx) }}
                            >
                                collidable
                            </div>
                        )
                    })
                }
                {
                    linePoints.map(({ x, y }, idx) => {
                        return (
                            <div
                                className='absolute cursor-pointer w-[0px] h-[0] inline-flex justify-center items-center'
                                style={{ left: x, top: y }}
                                key={`point_${idx}`}
                                onMouseDown={() => { setPointId(idx) }}
                            >
                                <div className='w-[8px] h-[8px] bg-white rounded-full shrink-0' ></div>
                                <span className='absolute top-[-30px] inline-flex shrink-0 text-nowrap text-white' >
                                    Point {idx == 0 ? 'A' : 'B'}
                                </span>
                            </div>
                        )
                    })
                }

                <div
                    className='absolute border border-white text-white inline-flex items-center justify-center'
                    style={{ width: heroBox.width, height: heroBox.height, left: linePoints[0].x, top: linePoints[0].y }}
                />

                <div
                    className='absolute border border-white border-dashed text-white inline-flex items-center justify-center'
                    style={{ width: heroBox.width, height: heroBox.height, left: linePoints[1].x, top: linePoints[1].y }}
                />
                {
                    pointC &&
                    <>
                        <div
                            className='absolute cursor-pointer w-[0px] h-[0] inline-flex justify-center items-center pointer-events-none'
                            style={{ left: pointC.x, top: pointC.y }}
                        >
                            <div className='w-[8px] h-[8px] bg-red-600 rounded-full shrink-0' />
                        </div>

                        <div
                            className='absolute cursor-pointer border border-red-600 border-dashed text-white inline-flex items-center justify-center pointer-events-none'
                            style={{ width: heroBox.width, height: heroBox.height, left: pointC.x, top: pointC.y }}

                        />
                    </>
                }

                {/* <Circle
                x={circles[0].x}
                y={circles[0].y}
                radius={circles[0].radius}
                onMouseDown={() => { setCircleId(0) }}
            /> */}


                {/* <div
                id='blue-dot'
                className='absolute cursor-pointer w-[0px] h-[0] inline-flex justify-center items-center pointer-events-none'
                style={{ left: 0, top: 0 }}
            >
                <div className='w-[8px] h-[8px] bg-blue-600 rounded-full shrink-0' />
            </div> */}
            </div>
        </div>
    )
}

export default Collision

/**
            <svg
                className='absolute'
                style={{ position: "absolute",  pointerEvents: "none" }}
            >
                <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={color}
                    strokeWidth={dotSize}
                    strokeDasharray={`${dotSize},${dotSpacing}`}
                />
            </svg>

 */