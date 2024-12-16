import { ChevronIcon, GalleryIcon } from "@/assets/Icons";
import Image from "next/image";

const BranchCard = ({ imageSrc, name, address }) => (
    <div className="bg-white md:h-[410px] h-[140px] md:block flex group border border-[#CBCBCB] hover:border-[#417F56] rounded-lg transition-all duration-300 overflow-hidden">
        <div className="relative md:w-full w-[45%] md:h-[280px] group-hover:md:h-[230px] transition-all duration-500">
            <Image
                src={`/images/${imageSrc}`}
                alt={name}
                className="w-full h-full object-cover object-center"
                width={200}
                height={200}
            />
            <div className="absolute top-0 right-0 w-full h-full md:bg-black/50 flex md:items-center md:justify-center justify-start items-end p-2 md:opacity-0 group-hover:opacity-100 duration-600">
                <button className="md:w-16 md:h-16 w-11 h-11 md:bg-white/20 hover:md:bg-white/30 bg-black/30 hover:bg-black/40 rounded-full flex items-center justify-center duration-300">
                    <GalleryIcon className="md:w-8 md:h-8 w-7 h-7" />
                </button>
            </div>
        </div>
        <div className="relative md:block flex flex-col justify-center px-4 md:pb-8 pb-5 pt-5 flex-1 text-center">
            <h3 className="md:text-xl font-medium text-[#353535] md:mb-3.5 mb-2">{name}</h3>
            <p className="text-[#717171] md:text-base text-sm md:mb-4">{address}</p>
            <button className="md:flex items-center flex-nowrap hidden absolute -bottom-20 group-hover:bottom-0 right-[50%] translate-x-[50%] border border-[#315F41] rounded-md text-[#315F41] text-super-sm py-1 px-4 leading-6 transition-all duration-600">
                صفحه شعبه <ChevronIcon className="fill-[#315F41] rotate-90 inline" />
            </button>
        </div>
    </div>
);

export default BranchCard;
