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
            style={{
                left: x,
                top: y,
                scale: flying ? 1.4 : 1,
                filter: flying ? 'drop-shadow(6px 6px 0px rgba(0,0,0,0.4))' : 'drop-shadow(4px 4px 0px rgba(0,0,0,0.4))',
                // transform: 'perspective(600px) rotateY(30deg) scaleX(1.2)' 

            }}
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
                }}
                onMouseDown={onMouseDown}
            />

            <div
                className='absolute z-[1] bottom-[0px] rounded-b-full right-[-9px] w-[17px] h-[20px] border-2 border-black bg-white'
            />
            <div
                className='absolute z-[-2] bottom-[4px] rounded-b-full right-[-6px] w-[11px] h-[20px] border-2 border-black bg-white'
            />

            <div
                className='absolute z-[1] top-[6px] rounded-t-full right-[5px] w-[13px] h-[16px] border-2 border-black bg-white'
            />
            <div
                className='absolute z-[1] top-[6px] rounded-t-full left-[5px] w-[13px] h-[16px] border-2 border-black bg-white'
            />
            {/* <div className="flame z-20"></div> */}

        </div>
    )
}

export default Circle