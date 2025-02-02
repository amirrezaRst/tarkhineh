import { PersonalWalletIcon, ShoppingCartIcon, SquareCheckmarkIcon } from "@/assets/Icons";

const PurchaseSteps = ({ step, setStep }) => {
    return (
        <section
            className="lg:px-20 md:px-6 px-4"
        >
            <div className="container flex items-center justify-between md:gap-4 gap-2">


                <div
                    className={`flex items-center gap-1.5 ${step > 1 && "cursor-pointer"}`}
                    onClick={step > 1 ? () => setStep(1) : undefined}
                >
                    <ShoppingCartIcon
                        className={`${step >= 1 ? "fill-[rgb(65,127,86)]" : "fill-[#CBCBCB]"} md:w-7 md:h-7 w-6 h-6`}
                    />
                    <p
                        className={`lg:text-super-base md:block hidden ${step >= 1 ? "font-medium text-[#417F56]" : "text-[#CBCBCB]"} `}
                    >
                        سبد خرید
                    </p>
                </div>
                <div className={`flex-1 border border-dashed ${step >= 2 ? "border-[#417F56]" : "border-[#CBCBCB]/80"}`} />

                <div
                    className={`flex items-center gap-1.5 ${step > 1 && "cursor-pointer"}`}
                    onClick={step > 2 ? () => setStep(2) : undefined}
                >
                    <SquareCheckmarkIcon
                        className={`${step >= 2 ? "fill-[#417F56]" : "fill-[#CBCBCB]"} md:w-7 md:h-7 w-6 h-6`}
                    />
                    <p
                        className={`lg:text-super-base md:block hidden ${step >= 2 ? "font-medium text-[#417F56]" : "text-[#CBCBCB]"} `}
                    >
                        تکمیل اطلاعات
                    </p>
                </div>
                <div className={`flex-1 border border-dashed ${step === 3 ? "border-[#417F56]" : "border-[#CBCBCB]/80"}`} />

                <div
                    className="flex items-center gap-1.5"
                >
                    <PersonalWalletIcon
                        className={`${step === 3 ? "fill-[#417F56]" : "fill-[#CBCBCB]"} md:w-7 md:h-7 w-6 h-6`}
                    />
                    <p
                        className={`lg:text-super-base md:block hidden ${step === 3 ? "font-medium text-[#417F56]" : "text-[#CBCBCB]"} `}
                    >
                        پرداخت
                    </p>
                </div>


            </div>
        </section>
    );
}

export default PurchaseSteps;