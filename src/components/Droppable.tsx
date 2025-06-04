import React from 'react'
import { TbBrandNetflix } from 'react-icons/tb'


interface Props {
    types?: 'food' | 'washroom' | 'water' | 'family' | 'medkit' | 'alcohol' | 'drink' | 'work' | 'sleep' | 'chat' | 'music' | 'bullets' | ''
    x: number
    y: number
}

const Droppable = ({ x, y }: Props) => {
    return (
        <div
            className='absolute inline-flex w-0 h-0 justify-center items-center'
            style={{
                top: y,
                left: x
            }}
        >
            <div
                className="absolute inline-flex rounded-full w-[40px] h-[40px] text-black justify-center items-center  border-2 bg-white flex-1"
                style={{
                    // filter: 'drop-shadow(4px 4px 0px rgba(0,0,0,0.4))',
                    // transform: 'perspective(600px) rotateY(30deg) scaleX(1.2)'
                    // top:y,
                    // left:x
                }}
            >
                <div className='absolute top-[-15px] w-full h-[8px] rounded-full border-2 border-black bg-white' />
                <TbBrandNetflix size={24} />

            </div>
        </div>

    )
}

export default Droppable