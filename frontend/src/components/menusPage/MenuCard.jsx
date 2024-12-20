"use client";

import StarRating from "./StarRating";
import MenuCardDiscount from "./MenuCardDiscount";
import MenuCardLike from "./MenuCardLike";
import FormatPrice from "@/utils/FormatPrice";
import DialogModal from "../modal/ModalContainer";
import { useState } from "react";

const MenuCard = ({ _id, name, price, images, discount, reviews, ingredients, available }) => {

    const [isOpen, setIsOpen] = useState(false);

    const finalPrice = discount
        ? discount.discountType === "percentage"
            ? price - (price * (discount.discountValue / 100))
            : price - discount.discountValue
        : price;


    return (
        <>
            <div
                className="bg-white 3xl:h-[230px] xl:h-[210px] md:h-[250px] h-[160px] flex 2xl:gap-2 border border-[#CBCBCB] rounded-lg overflow-hidden hover:shadow-lg duration-300"
            >

                <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${images[0]}`}
                    alt={`ترخینه ${name}`}
                    className="h-full 3xl:w-[230px] 2xl:w-[210px] xl:w-[190px] lg:w-[170px] md:w-[240px] w-[140px] object-cover"
                />

                {/*//TODO Card Content */}
                <div className="w-full p-4 flex flex-col justify-between">

                    <div className="flex items-center justify-between">
                        <h3
                            className="3xl:text-2xl text-1.5xl text-[#353535] font-semibold cursor-pointer"
                            onClick={() => setIsOpen(true)}
                        >
                            {name}
                        </h3>
                        <MenuCardLike />
                    </div>

                    <div className="flex xl:flex-row flex-col xl:items-center justify-between gap-2 mb-3.5">
                        <p className="text-[#353535] 3xl:text-super-base text-super-sm flex-1 line-clamp-2">
                            {ingredients?.map(item => `${item}، `)}
                        </p>
                        <div className="flex xl:flex-col flex-row justify-between gap-4">

                            <MenuCardDiscount discount={discount} price={price} />

                            <span className="text-[#353535] 3xl:text-lg text-super-base">
                                {FormatPrice(finalPrice)} تومان
                            </span>

                        </div>
                    </div>

                    <div className="flex xl:flex-row flex-col xl:items-center justify-between xl:gap-6 gap-3">
                        <StarRating rate={reviews?.averageRating} />
                        <button
                            className="bg-[#417F56] w-full rounded-md 3xl:leading-10 leading-9 text-super-sm px-4 text-white"
                        >
                            افزودن به سبد خرید
                        </button>
                    </div>

                </div>

            </div>

            <DialogModal isOpen={isOpen} setIsOpen={setIsOpen}>

            </DialogModal>

        </>
    );
}

export default MenuCard;




