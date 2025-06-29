import { Item } from '../ecs/all';
import { IconType } from 'react-icons';

import {
    MdOutlineRestaurant,
    MdOutlineLocalBar,
    MdOutlineBathroom,
    MdOutlineBedtime,
    MdOutlineMedicalServices,
    MdOutlineMusicNote,
    MdOutlineFamilyRestroom,
    MdOutlineWorkOutline,
} from "react-icons/md";
import { GiBullets } from "react-icons/gi"; // no outlined version available
import { PiBeerBottle } from 'react-icons/pi';
import { HiOutlineChatBubbleLeftRight } from 'react-icons/hi2';
import { LuGlassWater } from 'react-icons/lu';

export const itemIcons: { [key in Item]: IconType } = {
    food: MdOutlineRestaurant,
    water: LuGlassWater,
    drinks: MdOutlineLocalBar,
    bullets: GiBullets, // fallback - no outlined version
    bathroom: MdOutlineBathroom,
    sleep: MdOutlineBedtime,
    work: MdOutlineWorkOutline,
    "medi kit": MdOutlineMedicalServices,
    chat: HiOutlineChatBubbleLeftRight,
    music: MdOutlineMusicNote,
    alcohol: PiBeerBottle,
    "family time": MdOutlineFamilyRestroom,
};
interface Props {
    type: Item
    x: number
    y: number
    hp: number
    hurt: number
}

const Droppable = ({ x, y, hp, hurt, type }: Props) => {

    let opacity = 0.7;
    if (hurt >= 0 && hurt <= 0.8) {
        opacity = 1
    }

    const Icon = itemIcons[type];



    return (
        <div
            className='absolute inline-flex w-0 h-0 justify-center items-center'
            style={{
                top: y,
                left: x
            }}
        >
            <div
                className="absolute inline-flex rounded-full w-[40px] h-[40px] text-black justify-center items-center  border-2 bg-white flex-1"
                style={{ border: `2px solid rgba(0, 0, 0, ${opacity})` }}
            >
                {/* <TbBrandNetflix
                    size={24}
                    style={{ opacity: opacity }}
                /> */}
                {
                    <Icon
                        size={24}
                        style={{
                            opacity: opacity,
                            transform: type == 'bullets' ? 'scale(-1)' : ''
                        }}
                    />
                }

                <div
                    className='absolute top-[-15px] w-full h-[8px] rounded-full border-2 border-black bg-white'
                    style={{ opacity: hurt }}
                >
                    <div
                        className='absolute h-full w-full left-0 top-0 bg-gray-400'
                        style={{ width: `${hp}%` }}
                    />
                </div>
            </div>
        </div>

    )
}

export default Droppable