import { DocumentIcon } from "@/assets/Icons";
import useCartStore from "@/stores/useCartStore";

const OrderNotes = () => {
    const { setNotes } = useCartStore();

    return (
        <div
            className="h-52 border border-[#CBCBCB] rounded-lg xl:px-9 lg:px-4 xl:py-10 lg:py-8"
        >
            <div className="h-full relative">
                <div className="bg-[#FAFAFA] absolute lg:top-2 lg:right-2 right-4 top-6 flex items-center gap-1">

                    <DocumentIcon className="lg:w-6 lg:h-6 w-5 h-5" />
                    <p className="lg:text-base text-super-sm text-[#717171]">
                        توضیحات سفارش <span className="text-sm">(اختیاری)</span>
                    </p>

                </div>

                <textarea name="" id=""
                    className="w-full h-full rounded-md bg-[#FAFAFA] text-[#646464] focus:outline-none px-4 lg:py-10 py-16"
                    onChange={({ target }) => setNotes(target.value)}
                />
            </div>

        </div>

    );
}

export default OrderNotes;