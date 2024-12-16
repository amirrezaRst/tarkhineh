import { ChevronIcon } from "@/assets/Icons";

const MostSearchedList = () => {
    const items = ["پاستا سبزیجات", "پیتزا سیر و استیک", "سالاد سزار"];

    return (
        <div className="flex items-center flex-nowrap gap-3 flex-1 overflow-hidden">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="bg-[#EDEDED] flex items-center flex-none gap-1.5 py-1 md:px-4 px-2.5 md:leading-7 leading-6 text-[#353535] md:text-base text-sm cursor-pointer rounded-full"
                >
                    <span>{item}</span>
                    <ChevronIcon className="fill-[#717171] inline rotate-90" />
                </div>
            ))}
        </div>
    );
}

export default MostSearchedList;