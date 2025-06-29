

interface Props {
    // x: number
    // y: number
    align: 'right' | 'left'
}

// const Jet = ({ x, y, align }: Props) => {
const Jet = ({ align }: Props) => {


    return (
        <div className={`z-[-1] absolute inline-flex blur-[1px] w-0 h-0 top-[15px] jet-firing ${align == 'left' ? 'right-[19px]' : 'left-[5px]'}`} >
            {/* <div className='h-[14px] w-[14px] rounded-[1%_100%] rotate-45 bg-blue-300 shrink-0 ' /> */}
            <div className='absolute z-1 h-[8px] w-[8px] top-[3px] left-[3px] rounded-[1%_100%] rotate-45 bg-white opacity-[0.9] shrink-0 ' />
            <div className='border-black border-2 h-[14px] w-[14px] rounded-[1%_100%] rotate-45 bg-blue-400 opacity-[0.9] shrink-0 ' />
        </div>
    )
}

export default Jet