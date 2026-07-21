const EmptyAddressesList = ({ cartPage }) => {
    return (
        <div className={`relative w-full ${cartPage ? "min-h-56" : "min-h-96"} h-full overflow-hidden flex flex-col items-center justify-center`}>


            <img
                src="/images/spider-background.png"
                alt=""
                className={`${cartPage && "scale-[60%]"} absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] opacity-35`}
            />

            <div className="flex flex-col items-center gap-7 z-10">
                <p className={`${cartPage ? "text-lg" : "text-1.5xl"}  text-muted-fg`}>
                    شما در حال حاظر هیچ آدرسی ثبت نکرده اید!
                </p>

                {!cartPage &&
                    <button
                        className="border border-primary rounded-md text-primary text-lg px-12 py-2"
                    >
                        افزودن آدرس
                    </button>
                }
            </div>

        </div>
    );
}

export default EmptyAddressesList;