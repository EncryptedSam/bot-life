import React from 'react'
import { BiHome, BiRefresh } from 'react-icons/bi'
import { BsPlay } from 'react-icons/bs'

const PauseCard = () => {
    return (
        <div
            className='absolute w-[180px] h-[80px] border-2 rounded-full bg-white inline-flex justify-center items-center'
            style={{
                filter: 'drop-shadow(6px 6px 0px rgba(0,0,0,0.4))'
            }}
        >
            <span className='text-2xl font-medium !mb-[10px]'>PAUSE</span>

            <div className='absolute h-0 bottom-[0px] !space-x-3 w-full flex justify-center items-center' >
                <button
                    className='bg-white w-[35px] h-[35px]  rounded-full border-2 inline-flex justify-center items-center cursor-pointer'
                >
                    <BiRefresh size={20} />
                </button>
                <button
                    className='bg-white w-[40px] h-[40px] rounded-full border-2 inline-flex justify-center items-center cursor-pointer'
                >
                    <BsPlay className='!ml-1' size={30} />
                </button>
                <button
                    className='bg-white w-[35px] h-[35px]  rounded-full border-2 inline-flex justify-center items-center cursor-pointer'
                >
                    <BiHome size={20} />
                </button>
            </div>

        </div>
    )
}

export default PauseCard