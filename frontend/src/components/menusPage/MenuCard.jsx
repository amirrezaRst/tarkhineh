"use client";

import StarRating from "./StarRating";
import MenuCardDiscount from "./MenuCardDiscount";
import MenuCardLike from "./MenuCardLike";
import FormatPrice from "@/utils/FormatPrice";
import ModalContainer from "../modal/ModalContainer";
import { useState } from "react";
import MenuModal from "../modal/MenuModal";
import RegisterModal from "../register/RegisterModal";
import useUserStore from "@/stores/useUserStore";
import CartButton from "./CartButton";
import { addItemToCart, decreaseItemQuantity } from "@/services/MenuService";
import useCartStore from "@/stores/useCartStore";


const MenuCard = ({ _id, name, price, images, discount, reviews, description, ingredients, available, branch, category, foodType, isPersian }) => {
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

    const handleDecreaseQuantity = async () => {
        decreaseItemQuantity(user, _id, setCart);
    };


    return (
        <>
            <div
                className="bg-white 3xl:h-[230px] xl:h-[210px] md:h-[250px] h-[200px] flex 2xl:gap-2 border border-border rounded-lg overflow-hidden hover:shadow-lg duration-300"
            >

                <div className="relative h-full 3xl:w-[230px] 2xl:w-[210px] xl:w-[190px] lg:w-[170px] md:w-[240px] w-[140px] shrink-0">
                    <img
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${images?.[0]}`}
                        alt={`ترخینه ${name}`}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setIsOpen(true)}
                    />
                    {available === false &&
                        <span className="absolute top-2 left-2 bg-destructive text-white text-super-xs font-bold px-2 py-0.5 rounded-full">ناموجود</span>
                    }
                </div>

                {/*//TODO Card Content */}
                <div className="w-full md:p-4 p-2.5 flex flex-col justify-between">

                    <div className="flex items-center justify-between">
                        <h3
                            className="3xl:text-2xl md:text-1.5xl text-super-base text-foreground font-semibold cursor-pointer"
                            onClick={() => setIsOpen(true)}
                        >
                            {name}
                        </h3>
                        <MenuCardLike id={_id} user={user?._id} setRegisterModal={setRegisterModal} />
                    </div>

                    <div className="flex xl:flex-row flex-col xl:items-center justify-between gap-2 md:mb-3.5 mb-1.5">
                        <p className="text-foreground 3xl:text-super-base md:text-super-sm text-super-xs leading-5 flex-1 line-clamp-2">
                            {ingredients?.map(item => `${item}، `)}
                        </p>
                        <div className="flex xl:flex-col flex-row justify-between md:gap-4 gap-1.5">

                            <MenuCardDiscount discount={discount} price={price} />

                            <span className="text-foreground 3xl:text-lg md:text-super-base text-sm md:font-normal font-semibold">
                                {FormatPrice(finalPrice)} تومان
                            </span>

                        </div>
                    </div>

                    <div className="flex xl:flex-row flex-col xl:items-center justify-between xl:gap-6 gap-3">
                        <StarRating rate={reviews?.averageRating} />
                        <CartButton id={_id} handleAddToCart={handleAddToCart} handleDecrease={handleDecreaseQuantity} setLoading={setLoading} loading={loading} disabled={available === false} />
                    </div>

                </div>

            </div>

            <ModalContainer isOpen={isOpen} setIsOpen={setIsOpen}>
                <MenuModal
                    _id={_id} name={name} description={description} images={images}
                    ingredients={ingredients} reviews={reviews} available={available}
                    price={price} discount={discount} finalPrice={finalPrice}
                    category={category} foodType={foodType} isPersian={isPersian}
                    handleAddToCart={handleAddToCart} handleDecrease={handleDecreaseQuantity}
                    loading={loading} setLoading={setLoading} setIsOpen={setIsOpen}
                />
            </ModalContainer>

            <ModalContainer isOpen={registerModal} setIsOpen={setRegisterModal}>
                <RegisterModal setIsOpen={setRegisterModal} />
            </ModalContainer>

        </>
    );
}

export default MenuCard;




