import { ChevronIcon, TrashIcon } from "@/assets/Icons";

const MobileNavigation = () => {
    return (
        <div className="md:hidden flex items-center justify-between px-6 mb-12">
            <button>
                <ChevronIcon className="fill-[#353535] w-6 h-6 -rotate-90" />
            </button>

            <h1 className="text-lg text-[#353535] font-bold">سبد خرید</h1>

            <button>
                <TrashIcon className="fill-[#353535] w-6 h-6" />
            </button>
        </div>
    );
}

export default MobileNavigation;