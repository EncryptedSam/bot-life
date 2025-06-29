interface Props {
    number?: number
}

const CountDown = ({ number }: Props) => {
    return (
        <div
            className="absolute w-full h-full flex left-0 top-0 justify-center items-center"
        >
            <span
                className="text-9xl"
                style={{ textShadow: '6px 6px 0px rgba(0, 0, 0, 0.4)' }}
            >
                {
                    parseInt(`${number}`)
                }
            </span>
        </div>
    )
}

export default CountDown