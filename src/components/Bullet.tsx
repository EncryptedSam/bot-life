

interface Props {
    x: number
    y: number
}


const Bullet = ({ x, y }: Props) => {
    return (
        <div
            className='absolute z-[0] inline-flex items-center justify-center w-0 h-0'
            style={{
                left: x,
                top: y,
            }}
        >
            <div
                className='absolute rounded-t-full w-[7px] h-[16px] border-2 border-black bg-gray-300'
            >
                <hr className='absolute border-[1px] w-full bottom-[2px]' />
            </div>
        </div>
    )
}

export default Bullet