import { ShoppingCartIcon } from "@/assets/Icons";
import PreserveQueryLink from "@/hooks/PreserveQueryLink";

const CartButtonFlow = ({ cart }) => {
    return (
        <div className={`container fixed bottom-7 right-4 ${cart && cart?.length > 0 ? "translate-x-0" : "translate-x-full"} duration-1000`}>
            <button className="bg-white rounded-full border border-[#cbcbcb] shadow-xl hover:scale-110 duration-200">
                <PreserveQueryLink
                    className=" flex items-center justify-center p-3.5"
                    href="/cart"
                >
                    <div className="relative">
                        <ShoppingCartIcon className="fill-[#417F56] w-8 h-8" />
                        <span className="w-5 h-5 rounded-full bg-[#417F56] absolute -top-1.5 -right-1.5 text-white text-sm">{cart?.length}</span>
                    </div>
                </PreserveQueryLink>
            </button>
        </div>
    );
}

export default CartButtonFlow;