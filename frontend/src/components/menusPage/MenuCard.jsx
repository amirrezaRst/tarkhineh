import { HeartIcon, StarIcon } from "@/assets/Icons";
import StarRating from "./StarRating";

const MenuCard = () => {
    return (
        <div
            className="bg-white 3xl:h-[230px] xl:h-[210px] md:h-[250px] h-[160px] flex 2xl:gap-2 border border-[#CBCBCB] rounded-lg overflow-hidden hover:shadow-lg duration-300"
        >

            <img
                src="/images/food-image-2.jpg"
                alt=""
                className="h-full 3xl:w-[230px] 2xl:w-[210px] xl:w-[190px] lg:w-[170px] md:w-[240px] w-[140px] object-cover"
            />

            {/*//TODO Card Content */}
            <div className="w-full p-4 flex flex-col justify-between">

                <div className="flex items-center justify-between">
                    <h3 className="3xl:text-2xl text-1.5xl text-[#353535] font-semibold">
                        دلمه برگ مو
                    </h3>
                    <button className="hover:scale-110 duration-200">
                        <HeartIcon className="stroke-[#717171]" />
                    </button>
                </div>

                <div className="flex xl:flex-row flex-col xl:items-center justify-between gap-2 mb-3.5">
                    <p className="text-[#353535] 3xl:text-super-base text-super-sm flex-1">
                        پیاز، برنج، لپه، سبزی دلمه، سرکه
                    </p>
                    <div className="flex xl:flex-col flex-row justify-between gap-4">

                        {/* <div className="flex items-center justify-center gap-2">
                                                        <span
                                                         className="text-[ 3xl:text-lg text-base#ADADAD] line-through"
                                                         >۱۶۵٬۰۰۰</span>
                                                        <span
                                                         className="bg-[#FFF 3xl:text-base2F2] text-sm text-[#C30000] rounded-full pt-0.5 px-2"
                                                         >
                                                         %۱۰
                                                         </span>
                                                    </div> */}

                        <span className="text-[#353535] 3xl:text-lg text-super-base">
                            ۱۴۲٬۵۰۰ تومان
                        </span>

                    </div>
                </div>

                <div className="flex xl:flex-row flex-col xl:items-center justify-between xl:gap-6 gap-3">
                    {/* <div className="flex items-center">
                        <StarIcon /> <StarIcon /> <StarIcon /> <StarIcon /> <StarIcon />
                    </div> */}
                    <StarRating rate={3.5} />
                    <button
                        className="bg-[#417F56] w-full rounded-md 3xl:leading-10 leading-9 text-super-sm px-4 text-white"
                    >
                        افزودن به سبد خرید
                    </button>
                </div>

            </div>

        </div>
    );
}

export default MenuCard;




