import React from 'react'
import ProgressBar from './ProgressBar'
import Button from './Button'


interface ProgressValue {
    total: number;
    acquired: number;
    segments: number;
}


interface Props {
    onClickPlay?(): void
    onClickVault?(): void
    onClickPad?(): void
    data: {
        energy: ProgressValue,
        stress: ProgressValue,
        money: ProgressValue,
        bullets: ProgressValue
    }
}


const ScoreBoard = ({ onClickPlay, onClickVault, onClickPad, data }: Props) => {
    return (
        <div
            className='absolute top-0 right-0 w-full z-10'
        >
            <ProgressBar
                x={10}
                y={10}
                type='energy'
                value={data.energy}
            />
            <ProgressBar
                x={10}
                y={60}
                type='stress'
                value={data.stress}
            />
            <ProgressBar
                x={10}
                y={110}
                type='money'
                value={data.money}
            />

            <ProgressBar
                x={10}
                y={10}
                align='right'
                type='bullets'
                value={data.bullets}
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