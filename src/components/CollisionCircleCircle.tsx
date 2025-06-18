import React, { useEffect, useState } from 'react'
import Circle from './Hero'
import { angleBetweenPoints, detectCircleCircleCollision, detectRectCircleCollision, getCircleDiameterEndpoints } from '../utils/isCircleIntersectingOrBetween'
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

const CollisionCircleCircle = () => {
    const [circles, setCircles] = useState<Circle[]>([
        { x: 20, y: 20, radius: 50 },
        { x: 200, y: 200, radius: 50 },
        { x: 20, y: 200, radius: 50 },
    ]);

    const [circleId, setCircleId] = useState<null | number>(null);

    const [points, setPoints] = useState<Point[]>([]);

    useEffect(() => {
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
        }

        function handleMouseDown(event: MouseEvent) {
            x = event.clientX;
            y = event.clientY;
        }

        function handleMouseUp() {
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
    }, [circleId])


    useEffect(() => {
        let circle1 = { center: { x: circles[0].x, y: circles[0].y }, radius: circles[0].radius };
        let circle2 = { center: { x: circles[1].x, y: circles[1].y }, radius: circles[1].radius };

        let deg = angleBetweenPoints({ x: circles[0].x, y: circles[0].y }, { x: circles[1].x, y: circles[1].y })

        let point1 = getCircleDiameterEndpoints(circle1, deg + 90);
        let point2 = getCircleDiameterEndpoints(circle2, deg + 90);

        setPoints([...point1, ...point2]);
    }, [circles]);


    useEffect(() => {

        let aCircle = circles[0];
        let bCircle = circles[1];
        let circle = circles[2];


        let res = detectCircleCircleCollision({
            a: { x: aCircle.x, y: aCircle.y }, b: { x: bCircle.x, y: bCircle.y }, radius: aCircle.radius
        }, { center: { x: circle.x, y: circle.y }, radius: circle.radius }
        )

        console.clear();
        console.log(res);

    }, [circles])


    return (
        <div
            className='relative w-screen h-screen bg-gray-950 flex items-center justify-center'
        >
            <div className='relative w-[800px] h-[500px] bg-gray-950 select-none' >
                <svg
                    className='absolute pointer-events-none w-full h-full top-0 left-0'
                >
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

export default CollisionCircleCircle
