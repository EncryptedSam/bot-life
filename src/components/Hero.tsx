import React from 'react'
import Jet from './Jet'

interface Props {
    x: number
    y: number
    firing: boolean
    flying: boolean
    showCenter?: boolean
    scale?: number
}

const Hero = ({ x, y, flying, firing, scale }: Props) => {
    return (
        <div
            className='absolute z-[1] inline-flex items-center justify-center w-0 h-0'
            style={{
                left: x,
                top: y,
                // scale: flying ? 1.4 : 1,
                scale: scale,
                filter: flying ? 'drop-shadow(6px 6px 0px rgba(0,0,0,0.4))' : 'drop-shadow(4px 4px 0px rgba(0,0,0,0.4))',
            }}
        >

            <div
                className='absolute shrink-0 border-black border-2 rounded-full cursor-pointer bg-gray-200'
                style={{
                    width: 19 * 2,
                    height: 19 * 2,
                }}
            >
                <div
                    className='absolute rotate-45 left-[4px] top-[-4px] border-t-0 border-l-0 w-[26px] h-[26px] border-2'

                />

            </div>

            <>
                {/* shooter-head */}
                <div
                    className={`absolute z-[1] bottom-[0px] rounded-b-full right-[-9px] w-[17px] h-[20px] border-2 border-black bg-gray-300`}
                >
                    <div
                        className='absolute border top-[3px] w-full '
                    />

                </div>

                <div
                    className={`absolute z-[-2] bottom-[4px] rounded-b-full right-[-6px] w-[11px] h-[20px] border-2 border-black bg-white ${firing ? 'firing' : ''}`}
                />
            </>

            <>
                {/* jets */}
                <div
                    className='absolute z-[1] top-[6px] rounded-t-full right-[5px] w-[13px] h-[16px] border-2 border-black bg-gray-400'
                />
                <div
                    className='absolute z-[1] top-[6px] rounded-t-full left-[5px] w-[13px] h-[16px] border-2 border-black bg-gray-400'
                />
            </>
            <>
                <Jet
                    align='right'
                />
                <Jet
                    align='left'
                />
            </>
        </div>
    )
}

export default Hero