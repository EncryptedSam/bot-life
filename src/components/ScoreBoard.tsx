import React from 'react'
import ProgressBar from './ProgressBar'
import Button from './Button'

interface Props {

    onClickPlay?(): void
    onClickVault?(): void
    onClickPad?(): void
}


const ScoreBoard = ({ onClickPlay, onClickVault, onClickPad }: Props) => {
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
                onClick={onClickVault}
            />

            <Button
                x={10}
                y={110}
                align='right'
                value='keypad'
                onClick={onClickPad}
            />

            <Button
                x={10}
                y={240}
                align='right'
                value='play'
                onClick={onClickPlay}
            />

        </div>
    )
}

export default ScoreBoard