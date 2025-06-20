import React from 'react'
import { BiShare } from 'react-icons/bi'
import { usePressRepeat } from '../hooks/usePressRepeat'


interface Props {
    x: number
    y: number
    type: 'jump' | 'fire'
    onChange(value: 'pressed' | 'released'): void
}

const ActionButton = ({ type, x, y, onChange }: Props) => {

    // const handlers = usePressRepeat({onChange,interval: 100 });
    // const handlers = usePressRepeat({
    //     onChange: (status) => {
    //       console.log("Status:", status); // "pressed" (repeats), then "released"
    //     },
    //     interval: 100, // optional: how often "pressed" fires
    //   });


    return (
        <button
            className='absolute rounded-full border-2 inline-flex justify-center items-center w-[45px] h-[45px] '
            style={{
                left: x,
                bottom: y,
            }}
            // {...handlers} 

            onMouseUp={() => { onChange && onChange('released') }}
            onTouchCancel={() => { onChange && onChange('released') }}
            onTouchEnd={() => { onChange && onChange('released') }}
            onTouchStart={() => { onChange && onChange('pressed') }}
            onMouseDown={() => { onChange && onChange('pressed') }}
        >
            <div className='absolute opacity-[0.7] bg-white w-full h-full rounded-full left-0 top-0' />
            {
                type == 'fire' &&
                <div className='absolute border-2 rounded-t-full border-black w-[10px] h-[22px]' >
                    <div className='absolute w-full border-0 border-b-2 bottom-[4px] h-0' />
                </div>
            }

            {
                type == 'jump' &&
                <BiShare className='absolute rotate-[135deg]' size={26} stroke='' />
            }

        </button>
    )
}

export default ActionButton