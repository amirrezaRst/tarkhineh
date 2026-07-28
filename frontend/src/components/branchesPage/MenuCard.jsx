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
import CartButton from "../menusPage/CartButton";
import { addItemToCart } from "@/services/MenuService";
import useCartStore from "@/stores/useCartStore";

const MenuCard = ({ _id, name, price, images, discount, reviews, description, ingredients, available, branch }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [registerModal, setRegisterModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const user = useUserStore(state => state.user);
    const setCart = useCartStore(state => state.setCart);


    const finalPrice = discount
        ? discount.discountType === "percentage"
            ? price - (price * (discount.discountValue / 100))
            : price - discount.discountValue
        : price;

    const handleAddToCart = async () => {
        addItemToCart(user, _id, branch, setRegisterModal, setLoading, setCart);
    };


    return (
        <div
            className="w-[250px] bg-white flex-shrink-0 border border-border rounded-lg overflow-hidden"
        >

            <div className="relative">
                <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${images[0]}`}
                    alt={`ترخینه ${name}`}
                    className="w-full h-[220px] object-center object-cover cursor-pointer"
                    onClick={() => setIsOpen(true)}
                />
                {available === false &&
                    <span className="absolute top-2 left-2 bg-destructive text-white text-super-xs font-bold px-2 py-0.5 rounded-full">ناموجود</span>
                }
            </div>

            {/*//TODO Card Content */}
            <div className="pt-2 pb-3.5 px-3">
                <h3
                    className="text-foreground text-lg text-center font-semibold mb-2.5 cursor-pointer"
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
                    <p className="text-foreground ">{FormatPrice(finalPrice)} تومان</p>

                </div>

                <CartButton id={_id} handleAddToCart={handleAddToCart} setLoading={setLoading} loading={loading} disabled={available === false} />
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