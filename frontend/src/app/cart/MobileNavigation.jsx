import { ChevronIcon, TrashIcon } from "@/assets/Icons";

const MobileNavigation = ({ step }) => {
    return (
        <div className="md:hidden flex items-center justify-between px-6 mb-8">
            <button>
                <ChevronIcon className="fill-[#353535] w-6 h-6 -rotate-90" />
            </button>

            <h1 className="text-lg text-[#353535] font-bold">
                {step == 1 ?
                    "سبد خرید" : step == 2 ?
                        "تکمیل اطلاعات" :
                        "تایید و پرداخت"
                }
            </h1>

            <button
                className={step === 1 ? "" : "invisible"}
            >
                <TrashIcon className="fill-[#353535] w-6 h-6" />
            </button>
        </div>
    );
}

export default MobileNavigation;