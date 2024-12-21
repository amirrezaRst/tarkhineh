import { XmarkIcon } from "@/assets/Icons";
import StarRating from "../menusPage/StarRating";
import ConvertToPersianNumbers from "@/utils/ConvertToPersianNumber";
import { useState } from "react";
import Gallery from "../Gallery";

const MenuModal = ({ name, images, ingredients, description, reviews, setIsOpen }) => {
    const [selectedImage, setSelectedImage] = useState(0);

    return (
        <div
            className="max-w-[700px] bg-white rounded-lg pb-4 pt-5"
        >

            <div className="relative mx-6 mb-4">
                <h4
                    className="text-[#353535] text-xl font-semibold text-center"
                >اطلاعات محصول</h4>
                <XmarkIcon
                    className="fill-[#717171] w-8 h-8 absolute left-0 top-0 cursor-pointer"
                    onClick={() => setIsOpen(false)}
                />
            </div>

            {/* Gallery */}
            <div className="h-[370px]">
                <Gallery name={name} images={images} selectedImage={selectedImage} setSelectedImage={setSelectedImage} setIsOpen={setIsOpen} />
            </div>


            {/* Item Info */}
            <div className="px-6">
                <div className="flex items-center justify-between gap-4 py-3">
                    <h3
                        className="text-[#353535] text-xl font-bold"
                    >{name}</h3>
                    <StarRating rate={reviews?.averageRating} />
                </div>
                <div className="flex items-center justify-between gap-8 flex-wrap">
                    <p className="text-[#353535] text-super-sm flex-1 text-wrap">
                        {ingredients?.map(item => `${item}، `)}
                    </p>
                    <span className="text-[#cbcbcb] text-super-sm">
                        ({ConvertToPersianNumbers(reviews?.total)} نظر)
                    </span>
                </div>
                <p className="mt-4 text-[#565656] text-sm">{description}</p>
            </div>

        </div>
    );
}

export default MenuModal;