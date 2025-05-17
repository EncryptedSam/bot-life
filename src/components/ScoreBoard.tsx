import React from 'react'
import ProgressBar from './ProgressBar'
import Button from './Button'

const ScoreBoard = () => {
    return (
        <div
            className='absolute top-0 right-0 w-full z-10'
        // style={{ filter: 'drop-shadow(6px 6px 0px rgba(0,0,0,0.4))' }}
        >

            {/* <div
                className='absolute top-0 left-0 h-[30px] w-[150px] bg-white rounded-br-[12px] border-0 border-b-2 border-r-2 border-black'
            >

            </div>
            <div
                className='absolute top-[28px] left-0 h-[120px] w-[30px] bg-white rounded-br-[12px] border-0 border-b-2 border-r-2 border-black'
            >

            </div>

            
            <div
                className='absolute top-[28px] left-0 h-[120px] w-[30px] bg-white rounded-br-[12px] border-0 border-b-2 border-r-2 border-black'
            >

            </div> */}

            <ProgressBar
                x={10}
                y={10}
                type='energy'
            />
            <ProgressBar
                x={10}
                y={60}
                type='stress'
            />
            <ProgressBar
                x={10}
                y={110}
                type='productivity'
            />


            <ProgressBar
                x={10}
                y={10}
                align='right'
                type='money'
            />
            <ProgressBar
                x={10}
                y={60}
                align='right'
                type='bullets'
            />

            <Button
                x={10}
                y={110}
                align='right'
                value='settings'
            />

            <Button
                x={10}
                y={160}
                align='right'
                value='play'
            />

        </div>
    )
}

export default ScoreBoard