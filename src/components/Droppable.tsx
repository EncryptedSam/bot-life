import React from 'react'
import { TbBrandNetflix } from 'react-icons/tb'


interface Props {
    types: 'food' | 'washroom' | 'water' | 'family' | 'medkit' | 'alcohol' | 'drink' | 'work' | 'sleep' | 'chat' | 'music' | 'bullets' | ''
}

const Droppable = () => {
    return (
        <div
            className="absolute inline-flex top-80 rounded-full left-60 w-[40px] h-[40px] text-black justify-center items-center  border-2 bg-white"
            style={{
                filter: 'drop-shadow(4px 4px 0px rgba(0,0,0,0.4))',
                // transform: 'perspective(600px) rotateY(30deg) scaleX(1.2)'
            }}
        >
            <div className='absolute top-[-15px] w-full h-[8px] rounded-full border-2 border-black bg-white' />
            <TbBrandNetflix size={24} />

        </div>

    )
}

export default Droppable