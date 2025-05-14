import React from 'react'

interface Props {
    x: number
    y: number
    radius: number
    flying: boolean
    showCenter?: boolean
    onMouseDown?(): void
}

const Circle = ({ x, y, radius, showCenter, flying, onMouseDown }: Props) => {
    return (
        <div
            className='absolute inline-flex items-center justify-center w-0 h-0'
            style={{ left: x, top: y }}
        >
            {
                showCenter &&
                <div
                    className='absolute shrink-0 border border-red-600 rounded-full cursor-pointer'
                    style={{ width: 4, height: 4 }}
                />
            }


            <div
                className='absolute shrink-0 border-black border-2 rounded-full cursor-pointer bg-white'
                style={{
                    width: radius * 2,
                    height: radius * 2,
                    boxShadow: flying ? 'rgb(0, 0, 0, 0.4) 6px 6px 1px' : 'rgb(0, 0, 0, 0.4) 4px 4px 1px',
                    scale: flying ? 1.4 : 1
                }}
                onMouseDown={onMouseDown}
            />
        </div>
    )
}

export default Circle