

interface Props {
    x: number;
    y: number;
    radius: number;
    onMouseDown?(): void;
}

const Circle = ({ radius, x, y, onMouseDown }: Props) => {
    return (
        <div
            className='absolute inline-flex justify-center items-center w-0 h-0'
            style={{
                left: x,
                top: y,
            }}
        >
            <div
                className='shrink-0 border border-white'
                style={{
                    width: 2 * radius,
                    height: 2 * radius
                }}
                onMouseDown={onMouseDown}
            />

        </div>
    )
}

export default Circle