import React from 'react'

interface Props {
    children?: React.ReactNode
}


const Modal = ({ children }: Props) => {
    return (
        <div className="absolute flex items-center justify-center top-0 left-0 w-full h-full z-20" >
            {/* <div
                className="absolute bg-white opacity-[0.6] w-full h-full top-0 left-0"
            /> */}
            {children}
        </div>
    )
}

export default Modal