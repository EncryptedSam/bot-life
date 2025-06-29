
import { BsEmojiExpressionless } from 'react-icons/bs'
import { GoGraph, GoZap } from 'react-icons/go'
import { GiBullets } from 'react-icons/gi'
import { PiMoneyThin } from 'react-icons/pi'

interface Props {
    x: number
    y: number
    align?: 'left' | 'right'
    type: 'stress' | 'energy' | 'productivity' | 'money' | 'bullets'
    value: { total: number, acquired: number, segments: number }
}

const ProgressBar = ({ x, y, align = 'left', type, value }: Props) => {

    let total = (value.acquired / value.total) * 100;

    let divisor = value.total / value.segments;

    let sub = ((((value.acquired - 1) % divisor) + 1) / divisor) * 100;

    const getBarsStyle = (element?: 'wrapper' | 'total' | 'sub' | 'total-align' | 'sub-align') => {

        if (element == 'wrapper') {

            if (align == 'left') {
                return '!ml-[-10px]'
            }

            if (align == 'right') {
                return '!mr-[-10px]'
            }

        }

        if (element == 'total') {

            if (align == 'left') {
                return 'rounded-tr-full !mt-[-6px]'
            }

            if (align == 'right') {
                return 'rounded-tl-full !mt-[-6px] right-0'
            }

        }

        if (element == 'total-align') {
            if (align == 'left') {
                return 'left-0'
            }

            if (align == 'right') {
                return 'right-0'
            }
        }

        if (element == 'sub-align') {
            if (align == 'left') {
                return 'left-0'
            }

            if (align == 'right') {
                return 'right-0'
            }
        }

    }

    const iconHolder = (
        <div className='relative inline-flex justify-center items-center border-2 z-[1] border-black w-[36px] h-[36px] rounded-full bg-white' >
            {type == 'productivity' && <GoGraph size={20} />}
            {type == 'energy' && <GoZap size={20} />}
            {type == 'stress' && <BsEmojiExpressionless size={20} />}
            {type == 'money' && <PiMoneyThin size={20} />}
            {type == 'bullets' && <GiBullets size={20} className='scale-[-1]' />}
        </div>
    )

    return (
        <div
            className='absolute flex items-center'
            style={{
                left: align == 'left' ? x : undefined,
                right: align == 'right' ? x : undefined,
                top: y,
                filter: 'drop-shadow(6px 6px 0px rgba(0,0,0,0.4))'
            }}
        >

            {align == 'left' && iconHolder}
            <div className={`relative !ml-[-10px] flex flex-col ${getBarsStyle('wrapper')}`} >
                {
                    value && <>
                        {
                            <div
                                className={`border-2 absolute overflow-hidden text-white bg-white border-black w-[40px] h-[8px] ${getBarsStyle('total')}`}
                            >
                                <div
                                    className={`absolute h-full bg-gray-500 ${getBarsStyle('total-align')}`}
                                    style={{ width: `${total}%` }}
                                />
                            </div>
                        }

                        {
                            <div className='border-2 relative overflow-hidden border-black w-[90px] h-[14px] rounded-full bg-white' >
                                <div
                                    className={`absolute h-full bg-gray-400 ${getBarsStyle('sub-align')}`}
                                    style={{ width: `${sub}%` }}
                                />
                            </div>
                        }
                    </>
                }

            </div>
            {align == 'right' && iconHolder}
        </div>
    )
}

export default ProgressBar