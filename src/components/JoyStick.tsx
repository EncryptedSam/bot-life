import React, { useEffect, useRef } from 'react'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'


type Point = { x: number; y: number };

function getBoundedAngleAndPoint(origin: Point, point: Point, radius: number): {
    angle: number;          // 0 to 360 degrees
    point: Point;           // new point (possibly clamped to the circle's edge)
} {
    const dx = point.x - origin.x;
    const dy = point.y - origin.y;

    // Get raw angle in radians
    const angleRad = Math.atan2(dy, dx); // -π to π
    const angleDeg = (angleRad * 180) / Math.PI;

    // Normalize to 0 - 360
    const angle360 = (angleDeg + 360) % 360;

    // Distance between origin and point
    const dist = Math.sqrt(dx * dx + dy * dy);

    // If outside radius, clamp it to the circle's edge
    if (dist > radius) {
        const ratio = radius / dist;
        const clampedX = origin.x + dx * ratio;
        const clampedY = origin.y + dy * ratio;

        return {
            angle: angle360,
            point: { x: clampedX, y: clampedY },
        };
    }

    return {
        angle: angle360,
        point,
    };
}



interface ArrowsProps {
    width?: number
    deg?: number
}


const Arrows = ({ width, deg }: ArrowsProps) => {


    return (
        <div
            className='absolute inline-flex justify-between items-center !h-[0px]'
            style={{
                width,
                transform: `rotate(${deg}deg)`
            }}
        >
            <BiChevronLeft
                className='text-[18px] shrink-0'
            />
            <BiChevronRight
                className='text-[18px] shrink-0'
            />
        </div>
    )
}


export type DirectionKey = "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown";


interface Props {
    x: number
    y: number
    align: 'top-right' | 'top-left' | 'bottom-left' | 'bottom-right'
    onChange?(value: DirectionKey[]): void
}


const JoyStick = ({ x, y, onChange }: Props) => {
    const stickBaseRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let allowMove = false;
        let x1 = 0;
        let y1 = 0;

        let left = 0;
        let top = 0;


        const handleMouseMove = (event: MouseEvent | TouchEvent) => {
            if (!allowMove) return;
            const thumb = thumbRef.current;
            if (!thumb) return;

            let clientX: number;
            let clientY: number;

            if (event instanceof TouchEvent) {
                const touch = event.touches[0] || event.changedTouches[0];
                if (!touch) return;
                clientX = touch.clientX;
                clientY = touch.clientY;
            } else {
                clientX = event.clientX;
                clientY = event.clientY;
            }

            const dx = clientX - x1;
            const dy = clientY - y1;

            let origin: Point = {
                x: left,
                y: top
            }

            let currentPoint: Point = {
                x: left + dx,
                y: top + dy
            }

            let radius = 30

            let { angle: deg, point } = getBoundedAngleAndPoint(origin, currentPoint, radius);

            let keys: DirectionKey[] = [];

            if (deg >= 337.5 || deg < 22.5) keys = ["ArrowRight"];
            else if (deg >= 22.5 && deg < 67.5) keys = ["ArrowDown", "ArrowRight"];
            else if (deg >= 67.5 && deg < 112.5) keys = ["ArrowDown"];
            else if (deg >= 112.5 && deg < 157.5) keys = ["ArrowLeft", "ArrowDown"];
            else if (deg >= 157.5 && deg < 202.5) keys = ["ArrowLeft"];
            else if (deg >= 202.5 && deg < 247.5) keys = ["ArrowUp", "ArrowLeft"];
            else if (deg >= 247.5 && deg < 292.5) keys =["ArrowUp"] ;
            else if (deg >= 292.5 && deg < 337.5) keys = ["ArrowRight", "ArrowUp"];

            onChange?.(keys);

            thumb.style.left = `${point.x}px`;
            thumb.style.top = `${point.y}px`;
        };


        const handleMouseDown = (event: MouseEvent | TouchEvent) => {
            const stickBase = stickBaseRef.current;
            if (!stickBase) return;
            if (event.target !== stickBase) return;

            const thumb = thumbRef.current;
            if (!thumb) return;

            allowMove = true;

            if (event instanceof TouchEvent) {
                const touch = event.touches[0] || event.changedTouches[0];
                if (!touch) return;
                x1 = touch.clientX;
                y1 = touch.clientY;
            } else {
                x1 = event.clientX;
                y1 = event.clientY;
            }

            const { left: l, top: t } = window.getComputedStyle(thumb);
            left = parseInt(l);
            top = parseInt(t);
        };

        const handleMouseUp = (event: MouseEvent | TouchEvent) => {
            allowMove = false;
            x1 = 0;
            y1 = 0;

            const thumb = thumbRef.current;
            if (!thumb) return;
            thumb.style.left = `0px`
            thumb.style.top = `0px`

            onChange?.([]);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);

        window.addEventListener("touchstart", handleMouseDown);
        window.addEventListener("touchmove", handleMouseMove);
        window.addEventListener("touchend", handleMouseUp);


        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);

            window.removeEventListener("touchstart", handleMouseDown);
            window.removeEventListener("touchmove", handleMouseMove);
            window.removeEventListener("touchend", handleMouseUp);
        }

    }, [stickBaseRef, thumbRef, onChange])



    return (
        <div
            className={`absolute touch-none z-20 inline-flex items-center justify-center bottom-0 h-0 w-0`}
            style={{
                right: x + 50,
                bottom: y + 50,
            }}
        >

            <div
                ref={stickBaseRef}
                className='absolute shrink-0 w-[100px] h-[100px] rounded-full bg-white opacity-[0.7] border-2'
            />


            <Arrows
                width={90}
                deg={0}
            />

            {/* <Arrows
                width={90}
                deg={45}
            /> */}
            
            <Arrows
                width={90}
                deg={90}
            />
            
            {/* <Arrows
                width={90}
                deg={135}
            /> */}

            <div
                className='absolute w-0 h-0 inline-flex items-center justify-center pointer-events-none'
                ref={thumbRef}
            >
                <div
                    className='absolute shrink-0 w-[55px] h-[55px] rounded-full bg-white opacity-[0.7] border-2'
                />
            </div>
        </div>
    )
}

export default JoyStick


/**

* 
* 
* 
*/