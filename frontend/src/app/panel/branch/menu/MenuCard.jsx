const MenuCard = () => {
    return (
        <>
            <div
                className="bg-white 3xl:h-[230px] xl:h-[210px] md:h-[250px] h-[200px] flex 2xl:gap-2 border border-border rounded-lg overflow-hidden hover:shadow-lg duration-300"
            >

                <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/DoDMbP9H3.jpg`}
                    // alt={`ترخینه ${name}`}
                    alt={`ترخینه `}
                    className="h-full 3xl:w-[230px] 2xl:w-[210px] xl:w-[190px] lg:w-[170px] md:w-[240px] w-[140px] object-cover cursor-pointer"
                // onClick={() => setIsOpen(true)}
                />

                {/*//TODO Card Content */}
                <div className="w-full md:p-4 p-2.5 flex flex-col justify-between">

                    <div className="flex items-center justify-between">
                        <h3
                            className="3xl:text-2xl md:text-1.5xl text-super-base text-foreground font-semibold cursor-pointer"
                        // onClick={() => setIsOpen(true)}
                        >
                            {/* {name} */}
                        </h3>
                        {/* <MenuCardLike id={_id} user={user?._id} setRegisterModal={setRegisterModal} /> */}
                    </div>

                    <div className="flex xl:flex-row flex-col xl:items-center justify-between gap-2 md:mb-3.5 mb-1.5">
                        <p className="text-foreground 3xl:text-super-base md:text-super-sm text-super-xs leading-5 flex-1 line-clamp-2">
                            {/* {ingredients?.map(item => `${item}، `)} */}
                        </p>
                        <div className="flex xl:flex-col flex-row justify-between md:gap-4 gap-1.5">

                            {/* <MenuCardDiscount discount={discount} price={price} /> */}

                            <span className="text-foreground 3xl:text-lg md:text-super-base text-sm md:font-normal font-semibold">
                                {/* {FormatPrice(finalPrice)} تومان */}
                                0 تومان
                            </span>

                        </div>
                    </div>

                    <div className="flex xl:flex-row flex-col xl:items-center justify-between xl:gap-6 gap-3">
                        {/* <StarRating rate={reviews?.averageRating} />
                                <CartButton id={_id} handleAddToCart={handleAddToCart} handleDecrease={handleDecreaseQuantity} setLoading={setLoading} loading={loading} /> */}
                    </div>

                </div>

            </div>
            {/* 
                    <ModalContainer isOpen={isOpen} setIsOpen={setIsOpen}>
                        <MenuModal name={name} description={description} images={images} ingredients={ingredients} reviews={reviews} setIsOpen={setIsOpen} />
                    </ModalContainer>

                    <ModalContainer isOpen={registerModal} setIsOpen={setRegisterModal}>
                        <RegisterModal setIsOpen={setRegisterModal} />
                    </ModalContainer> */}

        </>
    );
}

export default MenuCard;