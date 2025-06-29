import Hero from './Hero'

interface Props {
    onClickPlay?(): void
}

const Intro = ({ onClickPlay }: Props) => {
    return (
        <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center' >
            {/* <div
                className='absolute w-full h-full graph moving-background'
            /> */}

            <div className='absolute flex flex-col items-center'>

                <h1
                    className='text-3xl font-extrabold'
                    style={{ filter: 'drop-shadow(3px 3px 0px rgba(0,0,0,0.4))' }}
                >BOT LIFE</h1>

                <div className='h-[100px] w-[150px] inline-flex justify-center items-center' >
                    <Hero
                        x={75}
                        y={75}
                        firing={false}
                        flying={false}
                        scale={1}
                    />
                </div>

                <button
                    className='border-2 bg-white !px-2 text-[16px] rounded-full cursor-pointer'
                    style={{ filter: 'drop-shadow(3px 3px 0px rgba(0,0,0,0.4))' }}
                    onClick={onClickPlay}
                >START</button>

            </div>


        </div>
    )
}

export default Intro