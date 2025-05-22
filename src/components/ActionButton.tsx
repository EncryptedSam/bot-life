import React from 'react'
import { BiShare } from 'react-icons/bi'
import { CgScreenShot } from 'react-icons/cg'
import { GiCannonShot, GiShotgun, GiShotgunRounds } from 'react-icons/gi'


interface Props {
    x: number
    y: number
    type: 'jump' | 'fire'
}

const ActionButton = ({ type, x, y }: Props) => {
    return (
        <div
            className='absolute rounded-full border-2 inline-flex justify-center items-center w-[45px] h-[45px] '
            style={{
                left: x,
                bottom: y,
            }}
        >
            <div className='absolute opacity-[0.7] bg-white w-full h-full rounded-full left-0 top-0' />
            {
                type == 'fire' &&
                <div className='absolute border-2 rounded-t-full border-black w-[10px] h-[22px]' >
                    <div className='absolute w-full border-0 border-b-2 bottom-[4px] h-0'  />
                </div>
            }

            {
                type == 'jump' &&
                <BiShare className='absolute rotate-[135deg]' size={26} stroke='' />
            }

        </div>
    )
}

export default ActionButton