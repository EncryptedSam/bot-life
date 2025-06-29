import { useEffect, useState } from 'react'
import Circle from './Hero'
import { detectRectCircleCollision } from '../utils/isCircleIntersectingOrBetween'
import Rect from './Rect'

interface Point {
    x: number
    y: number
}

interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Circle {
    x: number
    y: number
    radius: number
}

const CollisionRectCircle = () => {
    const [rects, setRects] = useState<Rect[]>([
        { x: 10, y: 10, height: 100, width: 100 },
        { x: 400, y: 400, height: 100, width: 100 }
    ]);

    const [circles, setCircles] = useState<Circle[]>([
        { x: 200, y: 200, radius: 50 },
    ]);

    const [rectId, setRectId] = useState<null | number>(null);
    const [circleId, setCircleId] = useState<null | number>(null);

    const [points, _setPoints] = useState<Point[]>([]);

    useEffect(() => {
        let rectPrevState: Rect | null = rectId != null ? rects[rectId] : null;
        let circlePrevState: Circle | null = circleId != null ? circles[circleId] : null;

        let x: number = 0;
        let y: number = 0;

        function handleMouseMove(event: MouseEvent) {
            let dx = event.clientX - x;
            let dy = event.clientY - y;

            if (circlePrevState && circleId != null) {
                setCircles((prevState) => {
                    let copy = JSON.parse(JSON.stringify(prevState));
                    copy[circleId] = { ...circlePrevState, x: circlePrevState.x + dx, y: circlePrevState.y + dy };
                    return copy;
                })
            }

            if (rectPrevState && rectId != null) {
                setRects((prevState) => {
                    let copy = JSON.parse(JSON.stringify(prevState));
                    copy[rectId] = { ...rectPrevState, x: rectPrevState.x + dx, y: rectPrevState.y + dy };
                    return copy;
                })
            }

        }

        function handleMouseDown(event: MouseEvent) {
            x = event.clientX;
            y = event.clientY;
        }

        function handleMouseUp() {
            setRectId(null);
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
    }, [rectId, circleId])

    useEffect(() => {

        let res = detectRectCircleCollision(
            {
                a: { x: rects[0].x, y: rects[0].y },
                b: { x: rects[1].x, y: rects[1].y },
                height: rects[0].height,
                width: rects[0].width
            },
            {
                center: { x: circles[0].x, y: circles[0].y },
                radius: circles[0].radius
            }
        )

        console.clear();
        console.log(res);


    }, [circles, rects])


    return (
        <div
            className='relative w-screen h-screen bg-gray-950 flex items-center justify-center'
        >
            <div className='relative w-[800px] h-[500px] bg-gray-950 select-none' >
                <svg
                    className='absolute pointer-events-none w-full h-full top-0 left-0'
                >
                    <line
                        x1={rects[0].x}
                        y1={rects[0].y}
                        x2={rects[1].x}
                        y2={rects[1].y}
                        stroke={'white'}
                        strokeWidth={1}
                        strokeDasharray={`${2},${2}`}
                    />
                    <line
                        x1={rects[0].x + rects[0].width}
                        y1={rects[0].y}
                        x2={rects[1].x + rects[1].width}
                        y2={rects[1].y}
                        stroke={'white'}
                        strokeWidth={1}
                        strokeDasharray={`${2},${2}`}
                    />
                    <line
                        x1={rects[0].x}
                        y1={rects[0].y + rects[0].height}
                        x2={rects[1].x}
                        y2={rects[1].y + rects[1].height}
                        stroke={'white'}
                        strokeWidth={1}
                        strokeDasharray={`${2},${2}`}
                    />
                    <line
                        x1={rects[0].x + rects[0].width}
                        y1={rects[0].y + rects[0].height}
                        x2={rects[1].x + rects[1].width}
                        y2={rects[1].y + rects[1].height}
                        stroke={'white'}
                        strokeWidth={1}
                        strokeDasharray={`${2},${2}`}
                    />

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
                    rects.map(({ x, y, height, width }, idx) => {

                        return (
                            <Rect
                                key={`point_${idx}`}
                                height={height}
                                width={width}
                                x={x}
                                y={y}
                                onMouseDown={() => { setRectId(idx) }}
                            />
                        )
                    })
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

export default CollisionRectCircle