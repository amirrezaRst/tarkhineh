"use client";

import Image from "next/image";
import FormatPrice from "@/utils/FormatPrice";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import MenuCardDiscount from "./MenuCardDiscount";
import MenuCardLike from "../menusPage/MenuCardLike";
import { useState } from "react";
import ModalContainer from "../modal/ModalContainer";
import MenuModal from "../modal/MenuModal";
import useUserStore from "@/stores/useUserStore";
import RegisterModal from "../register/RegisterModal";
import CartButton from "../menusPage/CartButton";
import { addItemToCart, decreaseItemQuantity } from "@/services/MenuService";
import useCartStore from "@/stores/useCartStore";
import { StarIcon } from "@/assets/Icons";

// One card shape for both the branch menu grid and the top-rated rail. `rank`
// turns it into a ranked card (oversized numeral on the image) for the rail.
const MenuCard = ({ _id, name, price, images, discount, reviews, description, ingredients, available, branch, rank, category, foodType, isPersian }) => {
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

    const rate = reviews?.averageRating;

    return (
        <>
            <article className="group h-full flex flex-col bg-surface border border-border rounded-2xl overflow-hidden shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg hover:border-accent">

                <div className="relative h-[160px]">
                    <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${images?.[0]}`}
                        alt={`ترخینه ${name}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 300px"
                        className="object-center object-cover cursor-pointer"
                        onClick={() => setIsOpen(true)}
                    />

                    <div className="absolute top-2.5 left-2.5">
                        <MenuCardLike id={_id} user={user?._id} setRegisterModal={setRegisterModal} floating />
                    </div>

                    {available === false &&
                        <span className="absolute top-2.5 right-2.5 bg-destructive text-destructive-fg text-super-xs font-bold px-2 py-0.5 rounded-full">
                            ناموجود
                        </span>
                    }

                    {rank &&
                        <span className="absolute -bottom-4 right-3 text-white/95 text-6xl font-extrabold leading-none tabular-nums pointer-events-none drop-shadow-[0_3px_14px_rgba(0,0,0,0.65)]">
                            {PersianNumber(rank)}
                        </span>
                    }
                </div>

                <div className="flex flex-col flex-1 px-4 pt-3.5 pb-4">
                    <h3
                        className="text-foreground text-super-base font-semibold cursor-pointer line-clamp-1"
                        onClick={() => setIsOpen(true)}
                    >
                        {name}
                    </h3>

                    {ingredients?.length > 0 &&
                        <p className="text-muted-fg text-super-xs mt-1 line-clamp-1">
                            {ingredients.join("، ")}
                        </p>
                    }

                    <div className="flex items-center justify-between gap-2 mt-3">
                        <span className="inline-flex items-center gap-1 text-super-sm font-bold text-warning-fg">
                            <StarIcon className="w-4 h-4" />
                            {rate ? PersianNumber(rate) : "—"}
                        </span>
                        <div className="flex items-center gap-2">
                            <MenuCardDiscount discount={discount} price={price} />
                            <span className="text-foreground text-super-sm font-extrabold tabular-nums whitespace-nowrap">
                                {FormatPrice(finalPrice)}
                                <span className="text-super-xs font-normal text-muted-fg mr-1">تومان</span>
                            </span>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <CartButton
                            id={_id}
                            handleAddToCart={handleAddToCart}
                            handleDecrease={handleDecreaseQuantity}
                            setLoading={setLoading}
                            loading={loading}
                            disabled={available === false}
                        />
                    </div>
                </div>

            </article>

            {/*//! Menu Item Details Menu */}
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
