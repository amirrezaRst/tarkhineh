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
        <div className="py-4 px-6 text-foreground lg:text-super-base md:text-base text-super-sm md:font-normal font-medium">
            <div
                className="flex items-center justify-between md:gap-4 gap-2 cursor-pointer"
                onClick={() => {
                    handleAccordion();
                    updateHeight();
                }}
            >
                <h6 className={`${isOpen === index ? "text-primary" : ""} duration-300`}>{title}</h6>
                <button>
                    <ChevronIcon
                        className={`md:w-[22px] md:h-[22px] w-[18px] h-[18px] ${isOpen === index ? "fill-primary" : "fill-foreground"} transform transition-transform duration-300 ${isOpen === index ? "rotate-180" : "rotate-0"}`}
                    />
                </button>
            </div>

            <div
                className={`transition-all duration-300 overflow-hidden`}
                style={{
                    maxHeight: isOpen === index ? `${height}px` : "0px",
                }}
            >
                <div ref={contentRef} className="md:text-super-sm text-sm text-muted-fg pt-3.5 pb-1">
                    {description}
                </div>
            </div>
        </div>
    );
};

export default Accordion;
