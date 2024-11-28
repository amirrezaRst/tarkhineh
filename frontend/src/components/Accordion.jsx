import { useRef, useState } from "react";
import { ChevronIcon } from "@/assets/Icons";

const Accordion = ({ title, description, index, isOpen, setIsOpen }) => {
    const contentRef = useRef(null);
    const [height, setHeight] = useState(0);

    const handleAccordion = () => {
        if (isOpen === index) {
            setIsOpen(null);
        } else {
            setIsOpen(index);
        }
    };

    const updateHeight = () => {
        if (contentRef.current) {
            setHeight(contentRef.current.scrollHeight);
        }
    };

    return (
        <div className="py-4 px-6 text-[#353535] text-super-base">
            <div
                className="flex items-center justify-between gap-4 cursor-pointer"
                onClick={() => {
                    handleAccordion();
                    updateHeight();
                }}
            >
                <h6 className={`${isOpen === index ? "text-[#417F56]" : ""} duration-300`}>{title}</h6>
                <button>
                    <ChevronIcon
                        className={`w-[22px] h-[22px] ${isOpen === index ? "stroke-[#417F56]" : "stroke-[#353535]"} transform transition-transform duration-300 ${isOpen === index ? "rotate-180" : "rotate-0"}`}
                    />
                </button>
            </div>

            <div
                className={`transition-all duration-300 overflow-hidden`}
                style={{
                    maxHeight: isOpen === index ? `${height}px` : "0px",
                }}
            >
                <div ref={contentRef} className="text-super-sm text-[#717171] pt-3.5 pb-1">
                    {description}
                </div>
            </div>
        </div>
    );
};

export default Accordion;
