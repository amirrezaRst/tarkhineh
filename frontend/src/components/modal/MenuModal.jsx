import { XmarkIcon } from "@/assets/Icons";
import StarRating from "../menusPage/StarRating";
import ConvertToPersianNumbers from "@/utils/ConvertToPersianNumber";
import { useState } from "react";
import Gallery from "../Gallery";

const MenuModal = ({ name, images, ingredients, description, reviews, setIsOpen }) => {
    const [selectedImage, setSelectedImage] = useState(0);

    return (
        <div
            className="md:max-w-[700px] max-w-[90%] mx-auto bg-white rounded-lg pb-4 md:pt-5 pt-3"
        >

            <div className="relative md:mx-6 mx-3 md:mb-4 mb-3">
                <h4
                    className="text-foreground md:text-xl text-super-base font-semibold text-center"
                >اطلاعات محصول</h4>
                <XmarkIcon
                    className="fill-muted-fg md:w-8 md:h-8 w-6 h-6 absolute left-0 top-0 cursor-pointer"
                    onClick={() => setIsOpen(false)}
                />
            </div>

            {/* Gallery */}
            <div className="md:h-[370px] h-[255px]">
                <Gallery name={name} images={images} selectedImage={selectedImage} setSelectedImage={setSelectedImage} setIsOpen={setIsOpen} />
            </div>


            {/* Item Info */}
            <div className="md:px-6 px-3">
                <div className="flex items-center justify-between gap-4 py-3">
                    <h3
                        className="text-foreground md:text-xl text-super-base font-bold"
                    >{name}</h3>
                    <StarRating rate={reviews?.averageRating} />
                </div>
                <div className="flex items-start justify-between gap-8 flex-wrap">
                    <p className="text-foreground md:text-super-sm text-super-xs flex-1 text-wrap leading-5">
                        {ingredients?.map(item => `${item}، `)}
                    </p>
                    <span className="text-border md:text-super-sm text-super-xs">
                        ({ConvertToPersianNumbers(reviews?.total)} نظر)
                    </span>
                </div>
                <p className="mt-4 text-muted-fg md:text-sm text-xs">{description}</p>
            </div>

        </div>
    );
}

export default MenuModal;