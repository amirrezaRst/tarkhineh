"use client";

import FormatPrice from "@/utils/FormatPrice";
import MenuCardDiscount from "./MenuCardDiscount";
import MenuCardLike from "./MenuCardLike";
import MenuCardRate from "./MenuCardRate";
import { useState } from "react";
import ModalContainer from "../modal/ModalContainer";
import MenuModal from "../modal/MenuModal";
import useUserStore from "@/stores/useUserStore";
import RegisterModal from "../register/RegisterModal";

const MenuCard = ({ _id, name, price, images, discount, reviews, description, ingredients, available }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [registerModal, setRegisterModal] = useState(false);

    const user = useUserStore(state => state.user)


    const finalPrice = discount
        ? discount.discountType === "percentage"
            ? price - (price * (discount.discountValue / 100))
            : price - discount.discountValue
        : price;

    const handleAddToCart = () => {
        if (!user) return setRegisterModal(true);
        alert("menu item has been added to cart");
    };



    return (
        <div
            className="w-[250px] bg-white flex-shrink-0 border border-[#cbcbcb] rounded-lg overflow-hidden"
        >

            <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${images[0]}`}
                alt={`ترخینه ${name}`}
                className="w-full h-[220px] object-center object-cover cursor-pointer"
                onClick={() => setIsOpen(true)}
            />

            {/*//TODO Card Content */}
            <div className="pt-2 pb-3.5 px-3">
                <h3
                    className="text-[#353535] text-lg text-center font-semibold mb-2.5 cursor-pointer"
                    onClick={() => setIsOpen(true)}
                >
                    {name}
                </h3>

                <div className="flex items-center justify-between gap-2">

                    <MenuCardLike id={_id} user={user?._id} setRegisterModal={setRegisterModal} />
                    <MenuCardDiscount discount={discount} price={price} />

                </div>

                <div className="flex items-center justify-between gap-2 mt-2">

                    <MenuCardRate reviews={reviews} />
                    <p className="text-[#353535] ">{FormatPrice(finalPrice)} تومان</p>

                </div>

                <button
                    className="w-full bg-[#417F56] text-white rounded-md py-1.5 text-super-sm leading-6 mt-4"
                    onClick={handleAddToCart}
                >
                    افزودن به سبد خرید
                </button>
            </div>

            {/*//! Menu Item Details Menu */}
            <ModalContainer isOpen={isOpen} setIsOpen={setIsOpen}>
                <MenuModal name={name} description={description} images={images} ingredients={ingredients} reviews={reviews} setIsOpen={setIsOpen} />
            </ModalContainer>

            <ModalContainer isOpen={registerModal} setIsOpen={setRegisterModal}>
                <RegisterModal setIsOpen={setRegisterModal} />
            </ModalContainer>

        </div>
    );
}

export default MenuCard;