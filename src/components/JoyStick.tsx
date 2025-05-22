import React, { useEffect } from 'react'
import { BiChevronDown, BiChevronLeft, BiChevronRight, BiChevronUp } from 'react-icons/bi'
import useDimensionObserver from '../hooks/useDimensionObserver'



interface Props {
    x: number
    y: number
    align: 'top-right' | 'top-left' | 'bottom-left' | 'bottom-right'
}


const JoyStick = ({ x, y }: Props) => {
    // useDimensionObserver

    return (
        <div
            className={`absolute z-20 inline-flex items-center justify-center bottom-0 h-0 w-0`}
            style={{
                right: x + 50,
                bottom: y + 50,
            }}
        >

            <div
                className='absolute shrink-0 w-[100px] h-[100px] rounded-full bg-white opacity-[0.7] border-2'
            />
            <div
                className='absolute shrink-0 w-[55px] h-[55px] rounded-full bg-white opacity-[0.7] border-2'
            />

            <BiChevronRight
                className='absolute left-[26px] text-[20px]'
            />

            <BiChevronLeft
                className='absolute right-[26px] text-[20px]'
            />

            <BiChevronUp
                className='absolute bottom-[26px] text-[20px]'
            />

            <BiChevronDown
                className='absolute top-[26px] text-[20px]'
            />

        </div>
    )
}

export default JoyStick