import React from 'react'
import ProgressBar from './ProgressBar'
import Button from './Button'

const ScoreBoard = () => {
    return (
        <div
            className='absolute top-0 right-0 w-full z-10'
        >
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
                type='money'
            />

            <ProgressBar
                x={10}
                y={10}
                align='right'
                type='bullets'
            />

            <Button
                x={10}
                y={60}
                align='right'
                value='vault'
            />

            <Button
                x={10}
                y={110}
                align='right'
                value='play'
            />

        </div>
    )
}

export default ScoreBoard