import React from 'react'
import { BiHome } from 'react-icons/bi'
import { BsPlay } from 'react-icons/bs'

const YouLose = () => {
    return (
        <div
            className='absolute w-[180px] h-[80px] border-2 rounded-full bg-gray-100 inline-flex justify-center items-center'
            style={{
                filter: 'drop-shadow(6px 6px 0px rgba(0,0,0,0.4))'
            }}
        >
            <div className='!mb-[10px] text-center !space-y-[-6px]' >
                <h1 className='text-2xl font-medium '>YOU LOSE</h1>
                <p className='text-lg font-medium '>Try Again?</p>
            </div>

            <div className='absolute text-[16px] font-medium h-0 bottom-[-2px] !space-x-3 w-full flex justify-center items-center' >
                <button
                    className='bg-gray-200 w-[45px] h-[25px] rounded-full border-2 inline-flex justify-center items-center cursor-pointer'
                >
                    No
                </button>
                <button
                    className='bg-gray-200 w-[45px] h-[25px]  rounded-full border-2 inline-flex justify-center items-center cursor-pointer'
                >
                    Yes
                </button>
            </div>

        </div>
    )
}

export default YouLose