import { PersonalWalletIcon, ShoppingCartIcon, SquareCheckmarkIcon } from "@/assets/Icons";

const PurchaseSteps = ({ step, setStep }) => {
    return (
        <section
            className="px-20"
        >
            <div className="container flex items-center justify-between gap-4">


                <div className="flex items-center gap-1.5">
                    <ShoppingCartIcon className={`${step >= 1 ? "fill-[rgb(65,127,86)]" : "fill-[#CBCBCB]"} w-7 h-7`} />
                    <p className={`text-super-base ${step >= 1 ? "font-medium text-[#417F56]" : "text-[#CBCBCB]"} `}>
                        سبد خرید
                    </p>
                </div>
                <div className={`flex-1 border border-dashed ${step >= 2 ? "border-[#417F56]" : "border-[#CBCBCB]/80"}`} />

                <div className="flex items-center gap-1.5">
                    <SquareCheckmarkIcon className={`${step >= 2 ? "fill-[#417F56]" : "fill-[#CBCBCB]"} w-7 h-7`} />
                    <p className={`text-super-base ${step >= 2 ? "font-medium text-[#417F56]" : "text-[#CBCBCB]"} `}>
                        تکمیل اطلاعات
                    </p>
                </div>
                <div className={`flex-1 border border-dashed ${step === 3 ? "border-[#417F56]" : "border-[#CBCBCB]/80"}`} />

                <div className="flex items-center gap-1.5">
                    <PersonalWalletIcon className={`${step === 3 ? "fill-[#417F56]" : "fill-[#CBCBCB]"} w-7 h-7`} />
                    <p className={`text-super-base ${step === 3 ? "font-medium text-[#417F56]" : "text-[#CBCBCB]"} `}>
                        پرداخت
                    </p>
                </div>


            </div>
        </section>
    );
}

export default PurchaseSteps;