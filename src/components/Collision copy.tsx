import React, { useEffect, useState } from 'react'
import { detectCollision } from '../utils/detectCollision'
import { detectFirstHit } from '../utils/detectFirstHit'
import { detectFirstCollision } from '../utils/detectFirstCollision'
import { detectDualAxisHits } from '../utils/detectDualAxisHits'
import { sweptAABBvsCircle } from '../utils/sweptAABBvsCircle'
import Circle from './Circle'
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

        let cx = circles[0].x;
        let cy = circles[0].y;
        let r = circles[0].radius;

        {
            let p1 = { x: x1, y: y1 - r }
            let p2 = { x: x1 + heroBox.width, y: y1 }

            let maxd = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)) + r

            let td = Math.sqrt(Math.pow(cx - x1, 2) + Math.pow(cy - y1, 2))
            let bd = Math.sqrt(Math.pow(cx - p2.x, 2) + Math.pow(cy - p2.y, 2))

            console.log(maxd, td + bd);

        }




        // let crossed = doesLineIntersectCircle(x1, y1, x2, y2, cx, cy, r);
        // console.log(crossed);


        const circleRes = isCircleInPath(
            linePoints[0],
            linePoints[0],
            heroBox.width,
            heroBox.height,
            { x: circles[0].x, y: circles[0].y },
            circles[0].radius
        )


        // const collisionResult = detectFirstCollision(moving, velocity, bricks);
        const collisionResult = detectFirstCollision(linePoints[0], linePoints[1], heroBox.width, heroBox.height, bricks);
        // const collisionResult = detectDualAxisHits(linePoints[0], linePoints[1], heroBox.width, heroBox.height, bricks);


        if (collisionResult == null) {
            setPointC(null);
            return;
        };
        collisionResult;

    }, [linePoints, heroBox, bricks, circles])



    return (
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