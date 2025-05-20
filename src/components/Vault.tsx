import { useState } from 'react'
import { BiX } from 'react-icons/bi'
import { BsChevronCompactRight, BsChevronLeft, BsChevronRight, BsEmojiExpressionless } from 'react-icons/bs'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { GiBullets } from 'react-icons/gi'
import { GoZap } from 'react-icons/go'
import { PiMoneyThin } from 'react-icons/pi'

type Tab = 'drops' | 'convert'


const Vault = () => {
    const [currentTab, setCurrentTab] = useState<Tab>('drops');

    const getClassNames = (isTrue: boolean) => {

        if (isTrue) {
            return 'relative bg-white border-b-0 !pb-[2px]'
        }

        return 'bg-gray-300'
    }

    return (
        <div
            className="relative flex flex-col w-[300px] rounded-lg  bg-gray-300 overflow-hidden"
            style={{
                filter: 'drop-shadow(6px 6px 0px rgba(0,0,0,0.4))'
            }}
        >
            <div 
                className='absolute z-[-1] w-full h-full border-2 rounded-lg'
            />


            <div className='relative h-[28px] !mb-[-2px] !space-x-[-8px]' >
                <button
                    className={`w-[120px] text-sm border-2 font-medium rounded-tl-lg rounded-tr-lg  h-full cursor-pointer ${getClassNames(currentTab == 'drops')}`}
                    onClick={() => { setCurrentTab('drops') }}
                >
                    Drops
                </button>
                <button
                    className={`w-[120px] text-sm border-2 font-medium rounded-tl-lg rounded-tr-lg h-full cursor-pointer ${getClassNames(currentTab == 'convert')}`}
                    onClick={() => { setCurrentTab('convert') }}
                >
                    Convert
                </button>
                <button className='absolute h-full inline-flex items-center justify-center right-1 text-2xl text-black cursor-pointer' >
                    <BiX />
                </button>
            </div>
            <div className='flex-1 bg-white border-2 rounded-b-lg border-black' >

                {
                    currentTab == 'drops' &&
                    <div className='flex flex-col h-full !py-3 !pt-4 justify-center !space-y-3' >
                        <p className='text-sm text-center font-medium !px-5' >Use or claim the drops you've collected at any time.</p>
                        <div className='flex items-center w-full !px-3' >
                            <button className='font-semibold text-2xl cursor-pointer' >
                                <BsChevronLeft />
                            </button>
                            <div className='w-full text-nowrap !space-x-[7px] h-[100px] overflow-auto overflow-y-hidden scroll-hide'>
                                <div className='inline-block rounded-[4px] h-[100px] w-[70px] border-black border-2' />
                                <div className='inline-block rounded-[4px] h-[100px] w-[70px] border-black border-2' />
                                <div className='inline-block rounded-[4px] h-[100px] w-[70px] border-black border-2' />
                            </div>
                            <button className='font-semibold text-2xl cursor-pointer' >
                                <BsChevronRight />
                            </button>
                        </div>
                        <div className='grid grid-cols-2 gap-2 !px-5' >
                            <div className='inline-flex flex-col items-center w-full' >
                                <div className='w-full flex justify-between items-center' >
                                    <GoZap className='pl-1' size={14} />
                                    <span className='!pr-1 font-medium text-[12px]' >100</span>
                                </div>
                                <div className='w-full h-[8px] rounded-full border-2' >

                                </div>
                            </div>
                            <div className='inline-flex flex-col items-center w-full' >
                                <div className='w-full flex justify-between items-center' >
                                    <BsEmojiExpressionless className='pl-1' size={14} />
                                    <span className='!pr-1 font-medium text-[12px]' >100</span>
                                </div>
                                <div className='w-full h-[8px] rounded-full border-2' >

                                </div>
                            </div>
                            <div className='inline-flex flex-col items-center w-full' >
                                <div className='w-full flex justify-between items-center' >
                                    <PiMoneyThin className='pl-1' size={14} />
                                    <span className='!pr-1 font-medium text-[12px]' >100</span>
                                </div>
                                <div className='w-full h-[8px] rounded-full border-2' >

                                </div>
                            </div>
                            <div className='inline-flex flex-col items-center w-full' >
                                <div className='w-full flex justify-between items-center' >
                                    <GiBullets className='scale-[-1] pl-1' size={14} />
                                    <span className='!pr-1 font-medium text-[12px]' >100</span>
                                </div>
                                <div className='w-full h-[8px] rounded-full border-2' >

                                </div>
                            </div>
                        </div>
                    </div>
                }

                {
                    currentTab == 'convert' &&
                    <div className='flex flex-col h-full !py-3 !pt-4 justify-center items-center !space-y-3' >
                        <p className='text-sm text-center font-medium !px-5' >To convert, you need 100 Money. You will receive 25 Bullets.</p>
                        <div className='w-full flex justify-center items-center !space-x-2'>
                            <div className='inline-block rounded-[4px] h-[100px] w-[70px] border-black border-2' />
                            <BsChevronCompactRight className='pl-1 text-black opacity-[0.8]' size={50} />
                            <div className='inline-block rounded-[4px] h-[100px] w-[70px] border-black border-2' />
                        </div>
                        <div className='grid place-items-center !px-5' >

                            <div className='inline-flex items-center text-sm !space-x-2'>
                                <span className='inline-block font-medium' >1</span>
                                <div className='inline-flex items-center !space-x-1 border-2 rounded-[4px]' >
                                    <button className='inline-flex w-[25px] bg-gray-200 h-[20px] justify-center items-center border-0 border-r-2 cursor-pointer' >
                                        <FiMinus size={16} />
                                    </button>
                                    <div className='inline-flex font-medium justify-center items-center  h-full w-[50px] ' >
                                        2888
                                    </div>
                                    <button className='inline-flex w-[25px] bg-gray-200 h-[20px] justify-center items-center border-0 border-l-2 cursor-pointer' >
                                        <FiPlus size={16} />
                                    </button>
                                </div>
                                <span className='inline-block w-0 font-medium' >1000</span>
                            </div>
                        </div>
                        <button className='inline-flex !px-2 rounded-[4px] bg-gray-200 font-medium text-sm justify-center items-center border-2 cursor-pointer' >Exchange</button>
                    </div>
                }

            </div>

        </div>
    )
}

export default Vault

