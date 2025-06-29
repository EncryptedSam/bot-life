
import JoyStick, { DirectionKey } from './JoyStick'
import ActionButton from './ActionButton'

interface Props {
    onTouchBullet(value: 'pressed' | 'released'): void;
    onTouchGlide(value: 'pressed' | 'released'): void;
    onTouchStick(value: DirectionKey[]): void
}

const GamePad = ({ onTouchBullet, onTouchGlide, onTouchStick }: Props) => {
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
                onChange={onTouchGlide}
            />

            <ActionButton
                x={50}
                y={230}
                type='fire'
                onChange={onTouchBullet}
            />

            <JoyStick
                x={10}
                y={100}
                align="bottom-right"
                onChange={onTouchStick}
            />

        </div>
    )
}

export default GamePad