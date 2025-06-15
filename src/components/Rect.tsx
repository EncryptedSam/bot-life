import React from 'react'

interface Props {
    x: number;
    y: number;
    width: number;
    height: number;
    onMouseDown?(): void;
}

const Rect = ({ height, width, x, y, onMouseDown }: Props) => {
    return (
        <div
            className='absolute border border-white !cursor-pointer pointer-events-auto'
            style={{
                height,
                width,
                left: x,
                top: y
            }}
            onMouseDown={onMouseDown}
        >
        </div>
    )
}

export default Rect