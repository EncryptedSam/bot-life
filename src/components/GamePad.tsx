import React from 'react'
import JoyStick from './JoyStick'
import ActionButton from './ActionButton'



const GamePad = () => {
    return (
        <div
            className='absolute bottom-0 right-0 w-full z-10'
            style={{
                filter: 'drop-shadow(6px 6px 0px rgba(0,0,0,0.4))'
            }}
        >
            <ActionButton
                x={20}
                y={150}
                type='jump'
            />

            <ActionButton
                x={50}
                y={230}
                type='fire'
            />

            <JoyStick
                x={10}
                y={100}
                align="bottom-right"
            />

        </div>
    )
}

export default GamePad