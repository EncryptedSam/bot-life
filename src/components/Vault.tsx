import { useEffect, useState } from 'react'
import { BiX } from 'react-icons/bi'
import { BsChevronCompactRight } from 'react-icons/bs'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { GiBullets } from 'react-icons/gi'
import { PiMoneyThin } from 'react-icons/pi'


interface CardProps {
    type: 'bullets' | 'money'
    value: number
}

const Card = ({ type, value }: CardProps) => {

    return (
        <div className='inline-flex flex-col rounded-[4px] h-[100px] w-[70px] border-black border-2' >
            <div
                className='flex-1 flex justify-center items-center text-[40px]'
            >
                {type == 'bullets' && <GiBullets className='scale-[-1] size-[35px]'/>}
                {type == 'money' && <PiMoneyThin  />}

            </div>
            <div
                className='bg-gray-300 font-medium border-0 border-t-2 w-full inline-flex justify-center items-center h-[22px]'
            >
                {value}
            </div>
        </div>
    )
}


type Data = {
    bullets: number,
    money: number,
    bulletCost: number
};

interface Props {
    onCancel?(): void
    data: Data
    onExchange?({ bullets, money }: { bullets: number, money: number }): void
}


const Vault = ({ onCancel, data, onExchange }: Props) => {
    const [state, setState] = useState<Data>(data);
    // const [state, setState] = useState<Data>({
    //     bulletCost: 0,
    //     bullets: 0,
    //     money: 0
    // });


    useEffect(() => {
        // setState(data)
        // console.log('hol')
        // }, [data.bulletCost, data.bullets, data.money])
    }, [])


    const handleIncrement = () => {
        let { bulletCost, bullets, money } = state;

        money -= bulletCost;

        if (money < 0) return;

        bullets += 1;

        if (bullets > 1000) return;
        // console.log('inc')

        setState({
            money,
            bulletCost,
            bullets
        });
    }

    const handleDecrement = () => {
        let { bulletCost, bullets, money } = state;


        money += bulletCost;

        if (money > 1000) return;

        bullets -= 1;

        if (bullets < 0) return;


        if (data.money - money < 0) return;

        setState({
            money,
            bulletCost,
            bullets
        });
    }

    const handleExchange = () => {
        if (typeof onExchange == 'function') {
            onExchange({
                bullets: state.bullets,
                money: state.money
            });
        }

        if (typeof onCancel == 'function') {
            onCancel();
        }
    }


    return (
        <div
            className="relative text-sm flex flex-col w-[300px] rounded-lg overflow-hidden border-2"
            style={{
                filter: 'drop-shadow(6px 6px 0px rgba(0,0,0,0.4))'
            }}
        >
            <div
                className='relative h-[28px] bg-gray-300 border-b-2 inline-flex items-center justify-between !px-2'
            >
                <span className='font-semibold' >Convert</span>
                <button
                    className='absolute h-full inline-flex items-center justify-center right-1 text-2xl text-black cursor-pointer'
                    onClick={onCancel}
                >
                    <BiX />
                </button>
            </div>

            <div className='flex-1 bg-white rounded-b-lg' >
                <div className='flex flex-col h-full !py-3 !pt-4 justify-center items-center !space-y-5' >
                    <p className='text-sm text-center font-medium !px-5' >To convert, you need atleast 10 Money. You will receive 1 Bullet.</p>
                    <div className='w-full flex justify-center items-center !space-x-2'>
                        <Card
                            value={state.money}
                            type='money'
                        />
                        <BsChevronCompactRight className='pl-1 text-black opacity-[0.8]' size={50} />
                        <Card
                            value={state.bullets}
                            type='bullets'
                        />
                    </div>
                    <div className='grid place-items-center !px-5' >

                        <div className='inline-flex items-center text-sm !space-x-2'>
                            <span className='inline-block font-medium' >1</span>
                            <div className='inline-flex items-center !space-x-1 border-2 rounded-[4px]' >
                                <button
                                    className='inline-flex w-[25px] bg-gray-200 h-[20px] justify-center items-center border-0 border-r-2 cursor-pointer'
                                    onClick={handleDecrement}
                                >
                                    <FiMinus size={16} />
                                </button>
                                <div className='inline-flex font-medium justify-center items-center  h-full w-[50px] ' >
                                    {data.money - state.money}
                                </div>
                                <button
                                    className='inline-flex w-[25px] bg-gray-200 h-[20px] justify-center items-center border-0 border-l-2 cursor-pointer'
                                    onClick={handleIncrement}
                                >
                                    <FiPlus size={16} />
                                </button>
                            </div>
                            <span className='inline-block w-0 font-medium' >{state.money}</span>
                        </div>
                    </div>
                    <button
                        className='inline-flex !px-2 rounded-[4px] bg-gray-200 font-medium text-sm justify-center items-center border-2 cursor-pointer'
                        onClick={handleExchange}
                    >Exchange</button>
                </div>
            </div>

        </div>
    )
}

export default Vault

