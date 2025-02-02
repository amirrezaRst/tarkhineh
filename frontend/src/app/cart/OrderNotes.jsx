import { DocumentIcon } from "@/assets/Icons";

const OrderNotes = ({ setNotes }) => {
    return (
        <div
            className="h-52 border border-[#CBCBCB] rounded-lg px-9 py-8"
        >

            <div className="h-full relative">
                <div className="bg-[#FAFAFA] absolute top-2 right-2 flex items-center gap-1">

                    <DocumentIcon />
                    <p className="text-[#717171]">
                        توضیحات سفارش <span className="text-sm">(اختیاری)</span>
                    </p>

                </div>

                <textarea name="" id=""
                    className="w-full h-full rounded-md bg-[#FAFAFA] text-[#646464] focus:outline-none px-4 py-10"
                    onChange={({ target }) => setNotes(target.value)}
                />
            </div>

        </div>

    );
}

export default OrderNotes;