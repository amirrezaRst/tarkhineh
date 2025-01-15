import { ShoppingCartIcon } from "@/assets/Icons";

const CartButtonFlow = () => {
    return (
        <div className="container fixed bottom-7 translate-x-0 duration-1000">
            <button
                className="bg-white rounded-full border border-[#cbcbcb] flex items-center justify-center p-3.5 shadow-xl"
            >
                <div className="relative">
                    <ShoppingCartIcon className="fill-[#417F56] w-8 h-8" />
                    <span className="w-5 h-5 rounded-full bg-[#417F56] absolute -top-1.5 -right-1.5 text-white text-super-sm">4</span>
                </div>
            </button>
        </div>
    );
}

export default CartButtonFlow;