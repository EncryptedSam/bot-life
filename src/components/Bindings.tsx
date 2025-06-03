import React from 'react'
import { BiChevronDown, BiChevronLeft, BiChevronRight, BiChevronUp, BiSpaceBar, BiX } from 'react-icons/bi'


interface Props {
    onCancel?(): void
}

const Bindings = ({ onCancel }: Props) => {
    return (
        <div
            className="relative text-sm flex flex-col w-[300px] rounded-lg overflow-hidden border-2"
            style={{
                filter: 'drop-shadow(6px 6px 0px rgba(0,0,0,0.4))'
            }}
        >
            <div
                className='relative h-[28px] bg-gray-300 border-b-2 inline-flex items-center justify-between !px-2'
            >
                <span className='font-semibold' >Bindings</span>
                <button
                    className='absolute h-full inline-flex items-center justify-center right-1 text-2xl text-black cursor-pointer'
                    onClick={onCancel}
                >
                    <BiX />
                </button>
            </div>
            <div
                className='flex-1 bg-white flex items-center justify-center !py-8'
            >
                <table
                    className='w-[200px] border-2 [&>*>tr>td]:!px-2 [&>*>tr>td]:!py-0 [&>*>tr>td]:!border-1 [&>thead>tr>td]:!font-medium'
                >
                    <thead>
                        <tr>
                            <td>Action</td>
                            <td>Keys</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='font-normal' >Move Up</td>
                            <td className='text-center' >
                                <BiChevronUp className='inline-block' size={18} />
                            </td>
                        </tr>
                        <tr>
                            <td className='font-normal' >Move Down</td>
                            <td className='text-center' >
                                <BiChevronDown className='inline-block' size={18} />
                            </td>
                        </tr>
                        <tr>
                            <td className='font-normal' >Move Right</td>
                            <td className='text-center' >
                                <BiChevronRight className='inline-block' size={18} />
                            </td>
                        </tr>
                        <tr>
                            <td className='font-normal' >Move Left</td>
                            <td className='text-center' >
                                <BiChevronLeft className='inline-block' size={18} />
                            </td>
                        </tr>
                        <tr>
                            <td className='font-normal' >Glide</td>
                            <td className='text-center' >
                                <BiSpaceBar className='inline-block' size={18} />
                            </td>
                        </tr>
                        <tr>
                            <td className='font-normal' >Shoot</td>
                            <td className='text-center' >z
                            </td>
                        </tr>
                    </tbody>


                </table>
            </div>
        </div>
    )
}

export default Bindings