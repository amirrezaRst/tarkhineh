import Popup from "@/components/Popup";

const CartPopup = ({ isOpen, setIsOpen, title, text, handler, isItem }) => {
    return (
        <Popup isOpen={isOpen} setIsOpen={setIsOpen} title={title}>

            {/*//! Content */}
            <div className="min-h-36 flex flex-col justify-center gap-6 px-6">
                <p className="text-super-base text-[#353535] text-center">
                    {text}
                </p>

                <div className="flex gap-3">
                    <button
                        className="rounded-md border border-[#417F56] text-[#417F56] text-super-sm leading-6 font-medium py-1.5 w-full flex-1 block"
                        onClick={() => setIsOpen(false)}
                    >
                        انصراف
                    </button>
                    <button
                        className="bg-[#FFF2F2] rounded-md border border-transparent text-[#C30000] text-super-sm leading-6 font-medium py-1.5 w-full flex-1 block"
                        onClick={handler}
                    >
                        حذف
                    </button>
                </div>
            </div>
        </Popup>
    );
}

export default CartPopup;