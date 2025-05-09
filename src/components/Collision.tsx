import React, { useEffect, useState } from 'react'
import { detectCollision } from '../utils/detectCollision'
import { detectFirstHit } from '../utils/detectFirstHit'
import { detectFirstCollision } from '../utils/detectFirstCollision'
import { detectDualAxisHits } from '../utils/detectDualAxisHits'


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

    const [brickId, setBrickId] = useState<null | number>(null);
    const [pointId, setPointId] = useState<null | number>(null);

    useEffect(() => {
        let pointPrevState: Point | null = pointId != null ? linePoints[pointId] : null;
        let brickPrevState: Brick | null = brickId != null ? bricks[brickId] : null;
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

            if (brickPrevState && brickId != null) {
                setBricks((prevState) => {
                    let copy = JSON.parse(JSON.stringify(prevState));
                    copy[brickId] = { ...brickPrevState, x: brickPrevState.x + dx, y: brickPrevState.y + dy };
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
        }

        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mousedown", handleMouseDown)
        window.addEventListener("mouseup", handleMouseUp)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mousedown", handleMouseDown)
            window.removeEventListener("mouseup", handleMouseUp)
        }
    }, [brickId, pointId])


    useEffect(() => {

        const moving = { ...linePoints[0], ...heroBox };
        const velocity = linePoints[1];

        console.clear();
        // const collisionResult = detectFirstCollision(moving, velocity, bricks);
        const collisionResult = detectFirstCollision(linePoints[0], linePoints[1], heroBox.width, heroBox.height, bricks);
        // const collisionResult = detectDualAxisHits(linePoints[0], linePoints[1], heroBox.width, heroBox.height, bricks);

        if (collisionResult == null) {
            setPointC(null);
            return;
        };
        collisionResult;
        console.log(collisionResult);


        // setPointC({ x: object.x, y: object.y });
        // setPointC(point);

        // setPointC({ x: x - ((65 / 100) * heroBox.width), y: y - ((65 / 100) * heroBox.height) });


        // let collisionResult = detectCollision(linePoints[0], linePoints[1], heroBox, bricks);

        // if (collisionResult == null) {
        //     setPointC(null);
        //     return;
        // };
        // let { pointC: { x, y } } = collisionResult;

        // setPointC({ x: x - ((65 / 100) * heroBox.width), y: y - ((65 / 100) * heroBox.height) });

    }, [linePoints, heroBox, bricks])


    useEffect(() => {
        type Box = {
            x: number
            y: number
            width: number
            height: number
        }

        type Velocity = {
            dx: number
            dy: number
        }

        type Collision = {
            time: number // 0 to 1
            normalX: number // -1, 0, or 1
            normalY: number // -1, 0, or 1
        }


        function sweptAABB(moving: Box, velocity: Velocity, target: Box) {
            let { dx, dy } = velocity;
            let { height: mh, width: mw, x: mx, y: my } = moving;
            let { x: tx, y: ty, width: tw, height: th } = target;

            let xInvEntry;
            let xInvExit;
            let yInvEntry;
            let yInvExit;

            if (dx > 0) {
                xInvEntry = tx - (mx + mw)
                xInvExit = (tx + tw) - mx
            }

            if (dy > 0) {
                yInvEntry = ty - (my + mh)
                yInvExit = (ty + th) - my
            }

            if (typeof xInvEntry == 'number' && typeof yInvEntry == 'number' && typeof xInvExit == 'number' && typeof yInvExit == 'number') {
                let xEntry = (xInvEntry / dx);
                let xExit = (xInvExit / dx);
                let yEntry = (yInvEntry / dy);
                let yExit = (yInvExit / dy);

                console.log({ xEntry, yEntry })
                console.log({ xExit, yExit })

                const entryTime = Math.max(xEntry, yEntry)
                const exitTime = Math.min(xExit, yExit)

                console.log(entryTime > exitTime);

                if (entryTime > exitTime || xEntry < 0 && yEntry < 0 || xEntry > 1 || yEntry > 1) {
                    return { time: 1, normalX: 0, normalY: 0 }
                }

                console.log(entryTime)
            }

        }

        let velocity: Velocity = {
            dx: linePoints[1].x - linePoints[0].x,
            dy: linePoints[1].y - linePoints[0].y
        }

        sweptAABB({ ...linePoints[0], ...heroBox }, velocity, bricks[0])


    }, [linePoints, heroBox, bricks])


    return (
        <div className='relative w-[800px] h-[500px] bg-gray-900 select-none' >
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
                            key={`bick_${idx}`}
                            className='absolute rounded-full cursor-pointer border border-white text-white inline-flex items-center justify-center'
                            style={{ width, height, left: x, top: y }}
                            onMouseDown={() => { setBrickId(idx) }}
                        >
                            o{idx + 1}
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