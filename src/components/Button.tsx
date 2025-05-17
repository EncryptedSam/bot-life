import React from 'react'
import { CiSettings } from 'react-icons/ci'
import { GoZap } from 'react-icons/go'
import { IoPauseOutline, IoPlayOutline, IoSettingsOutline } from 'react-icons/io5'

interface Props {
    x: number
    y: number
    onClick?(): void
    align?: 'left' | 'right'
    value?: 'settings' | 'play' | 'pause'
}

const Button = ({ x, y, align = 'left', value }: Props) => {




    return (
        <button
            className='absolute inline-flex justify-center items-center border-2 z-[1] border-black w-[36px] h-[36px] rounded-full bg-white'
            style={{
                left: align == 'left' ? x : undefined,
                right: align == 'right' ? x : undefined,
                top: y,
                filter: 'drop-shadow(6px 6px 0px rgba(0,0,0,0.4))'
            }}
        >
            {value == 'pause' && <IoPauseOutline size={20} />}
            {value == 'play' && <IoPlayOutline size={20} />}
            {value == 'settings' && <IoSettingsOutline size={20} />}
        </button>
    )
}

export default Button