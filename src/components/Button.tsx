
import { BsBoxes } from 'react-icons/bs'
import { FaRegKeyboard } from 'react-icons/fa'
import { GoGift } from 'react-icons/go'
import { IoPauseOutline, IoPlayOutline, IoSettingsOutline } from 'react-icons/io5'
import { TbArrowsExchange2 } from 'react-icons/tb'

interface Props {
    x: number
    y: number
    onClick?(): void
    align?: 'left' | 'right'
    value?: 'settings' | 'play' | 'pause' | 'gifts' | 'exchange' | 'vault' | 'gamepad' | 'keypad'
}

const Button = ({ x, y, align = 'left', value, onClick }: Props) => {




    return (
        <button
            className='absolute inline-flex justify-center items-center border-2 z-[1] border-black w-[36px] h-[36px] rounded-full bg-white cursor-pointer'
            style={{
                left: align == 'left' ? x : undefined,
                right: align == 'right' ? x : undefined,
                top: y,
                filter: 'drop-shadow(6px 6px 0px rgba(0,0,0,0.4))'
            }}
            onClick={onClick}
        >
            {value == 'pause' && <IoPauseOutline size={20} />}
            {value == 'play' && <IoPlayOutline size={20} />}
            {value == 'settings' && <IoSettingsOutline size={20} />}
            {value == 'gifts' && <GoGift size={20} />}
            {value == 'exchange' && <TbArrowsExchange2 size={20} />}
            {value == 'vault' && <BsBoxes size={20} />}
            {value == 'keypad' && <FaRegKeyboard size={20} />}
        </button>
    )
}

export default Button