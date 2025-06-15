import React, { useEffect, useState } from 'react'
import Circle from './Hero'
import { angleBetweenPoints, circleCircleIntersect, detectRectCircleCollision, getCircleDiameterEndpoints } from '../utils/isCircleIntersectingOrBetween'

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
    const [circles, setCircles] = useState<Circle[]>([
        { x: 50, y: 50, radius: 50 },
        { x: 200, y: 200, radius: 50 },
    ]);


    const [points, setPoints] = useState<Point[]>([]);


    const [brickId, setBrickId] = useState<null | number>(null);
    const [pointId, setPointId] = useState<null | number>(null);
    const [circleId, setCircleId] = useState<null | number>(null);

    console.log(circleId);

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

        let x1 = linePoints[0].x;
        let y1 = linePoints[0].y;

        let x2 = linePoints[1].x;
        let y2 = linePoints[1].y;

        let playerWidth = heroBox.width;
        let playerHeight = heroBox.height;


        let cx = circles[0].x;
        let cy = circles[0].y;
        let r = circles[0].radius;

        // let res = detectDualAxisHits({ x: x1, y: y1 }, { x: x2, y: y2 }, hw, hh, bricks[0]);

        // let res = sweptAABBvsCircle({ height: hh, width: hw, pointA: { x: x1, y: y1 }, pointB: { x: x2, y: y2 } }, { center: { x: cx, y: cy }, radius: r })

        // console.log(res);

        // isCircleIntersectingOrBetween()

        // let res = detectRectCircleCollision({ a: { x: x1, y: y1 }, b: { x: x2, y: y2 }, width: playerWidth, height: playerHeight }, { center: { x: cx, y: cy }, radius: r });

        let circle1 = {center: {x:circles[0].x,y:circles[0].y}, radius:circles[0].radius };
        let circle2 = {center: {x:circles[1].x,y:circles[1].y}, radius:circles[1].radius };

        let res1 = circleCircleIntersect(circle1, circle2)

        // console.log(res1);

        // console.log({ center:{x: cx, y: cy}, radius: r });
        let deg = angleBetweenPoints({x:circles[0].x,y:circles[0].y}, {x:circles[1].x,y:circles[1].y})

        let point1 = getCircleDiameterEndpoints(circle1, deg+90);
        let point2 = getCircleDiameterEndpoints(circle2, deg+90);


        setPoints([...point1, ...point2]);


    }, [linePoints, heroBox, bricks, circles])

    console.log(points);


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
                    {/* 0----------------------------------------------------- */}
                    {
                        points.length === 4 &&
                        <>
                            <line
                                x1={points[0].x}
                                y1={points[0].y}
                                x2={points[1].x}
                                y2={points[1].y}
                                stroke={'red'}
                                strokeWidth={1}
                                strokeDasharray={`${2},${2}`}
                            />
                            <line
                                x1={points[1].x}
                                y1={points[1].y}
                                x2={points[3].x}
                                y2={points[3].y}
                                stroke={'red'}
                                strokeWidth={1}
                                strokeDasharray={`${2},${2}`}
                            />
                            <line
                                x1={points[3].x}
                                y1={points[3].y}
                                x2={points[2].x}
                                y2={points[2].y}
                                stroke={'red'}
                                strokeWidth={1}
                                strokeDasharray={`${2},${2}`}
                            />
                            <line
                                x1={points[2].x}
                                y1={points[2].y}
                                x2={points[0].x}
                                y2={points[0].y}
                                stroke={'red'}
                                strokeWidth={1}
                                strokeDasharray={`${2},${2}`}
                            />
                        </>
                    }


                </svg>

                {
                    points.map((point, idx) => {
                        return (
                            <div
                                key={`point_${idx}`}
                                className='absolute h-0 w-0 inline-flex justify-center items-center'
                                style={{
                                    top: point.y,
                                    left: point.x
                                }}
                            >
                                <div
                                    className='border border-red-50 w-[10px] h-[10px] shrink-0'
                                />
                            </div>
                        )
                    })
                }

                {
                /* {
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
                } */
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

                {
                    circles.map(({ radius, x, y }, idx) => {
                        return (
                            <div
                                key={`circle_${idx}`}
                                id='blue-dot'
                                className='absolute cursor-pointer w-[0] h-[0] inline-flex justify-center items-center'
                                style={{ left: x, top: y }}
                            >
                                <div
                                    className='w-[8px] h-[8px] bg-blue-600 rounded-full shrink-0'
                                    style={{ width: radius * 2, height: radius * 2 }}
                                    onMouseDown={() => { setCircleId(idx) }}
                                />
                            </div>
                        )
                    })
                }

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