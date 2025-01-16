const EmptyAddressesList = () => {
    return (
        <div className="relative w-full min-h-96 h-full overflow-hidden flex flex-col items-center justify-center">


            <img src="/images/spider-background.png" alt="" className="absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] opacity-35" />

            <div className="flex flex-col items-center gap-7 z-10">
                <p className="text-1.5xl text-[#757575]">
                    شما در حال حاظر هیچ آدرسی ثبت نکرده اید!
                </p>

                <button
                    className="border border-[#417F56] rounded-md text-[#417F56] text-lg px-12 py-2"
                >
                    افزودن آدرس
                </button>
            </div>

        </div>
    );
}

export default EmptyAddressesList;