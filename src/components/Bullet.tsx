import React from 'react'

interface Props {
    x: number
    y: number
}


const Bullet = ({ x, y }: Props) => {
    return (
        <div
            className='absolute z-[0] inline-flex items-center justify-center w-0 h-0'
            style={{
                left: x,
                top: y,
                // scale: flying ? 1.4 : 1,
                // filter: flying ? 'drop-shadow(6px 6px 0px rgba(0,0,0,0.4))' : 'drop-shadow(4px 4px 0px rgba(0,0,0,0.4))',
                filter: 'drop-shadow(4px 4px 0px rgba(0,0,0,0.4))',
            }}
        >
            <div
                className='absolute rounded-t-full w-[7px] h-[16px] border-2 border-black bg-white'
            >
                <hr className='absolute border-[1px] w-full bottom-[2px]' />
            </div>
        </div>
    )
}

export default Bullet