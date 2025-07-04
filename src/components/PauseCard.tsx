
import { BiHome, BiRefresh } from 'react-icons/bi'
import { BsPlay } from 'react-icons/bs'

interface Props {
    onClickPlay?(): void
    onClickHome?(): void
    onClickRestart?(): void
}

const PauseCard = ({ onClickHome, onClickPlay, onClickRestart }: Props) => {
    return (
        <div
            className='absolute w-[200px] h-[80px] border-2 rounded-full bg-gray-200 inline-flex justify-center items-center'
            style={{
                filter: 'drop-shadow(6px 6px 0px rgba(0,0,0,0.4))'
            }}
        >
            <span className='text-2xl font-medium !mb-[10px]'>PAUSE</span>

            <div className='absolute h-0 bottom-[0px] !space-x-3 w-full flex justify-center items-center' >
                <button
                    className='bg-white w-[40px] h-[40px]  rounded-full border-2 inline-flex justify-center items-center cursor-pointer'
                    onClick={onClickRestart}
                >
                    <BiRefresh size={20} />
                </button>
                <button
                    className='bg-white w-[50px] h-[50px] rounded-full border-2 inline-flex justify-center items-center cursor-pointer'
                    onClick={onClickPlay}
                >
                    <BsPlay className='!ml-1' size={30} />
                </button>
                <button
                    className='bg-white w-[40px] h-[40px]  rounded-full border-2 inline-flex justify-center items-center cursor-pointer'
                    onClick={onClickHome}
                >
                    <BiHome size={20} />
                </button>
            </div>

        </div>
    )
}

export default PauseCard