import { GalleryIcon } from "@/assets/Icons";
import ModalContainer from "@/components/modal/ModalContainer";

const CardImage = ({ imageSrc, branch, setIsOpen }) => {
    return (
        <div className="relative w-full xl:col-span-1 md:col-span-5 md:h-auto h-[200px] md:rounded-l-lg rounded-b-lg overflow-hidden">

            <img
                src={imageSrc}
                alt={`شعبه ${branch}`}
                className="w-full xl:h-[330px] md:h-[300px] h-[200px] object-cover object-center"
            />
            <div
                className="w-full h-full absolute top-0 right-0 md:bg-black/50 flex md:items-center md:justify-center items-end justify-start md:p-0 p-3.5 cursor-pointer"
                onClick={() => setIsOpen(true)}
            >

                <button
                    className="md:w-16 md:h-16 w-11 h-11 md:bg-white/20 hover:md:bg-white/30 bg-black/30 hover:bg-black/40 rounded-full flex items-center justify-center duration-300"
                >
                    <div
                        className="md:w-12 md:h-12 w-9 h-9 md:bg-white/30 bg-black/40 rounded-full flex items-center justify-center"
                    >
                        <GalleryIcon className="md:w-8 md:h-8 w-7 h-7" />
                    </div>
                </button>

            </div>

        </div>
    );
}

export default CardImage;