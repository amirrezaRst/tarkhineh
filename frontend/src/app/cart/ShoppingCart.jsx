import CartItem from "../../components/cart/shopping/CartItem";
import CartLayout from "./CartLayout";
import EmptyCart from "../../components/cart/shopping/EmptyCart";
import CartItemSkeleton from "../../components/cart/shopping/CartItemSkeleton";
import useCartStore from "@/stores/useCartStore";
import CartLayoutSkeleton from "./CartLayoutSkeleton";


const ShoppingCart = ({ step, setStep }) => {
    const cart = useCartStore((state) => state.cart);
    const { cartBranch } = useCartStore();

    if (cart === null) {
        return (
            <CartLayoutSkeleton>
                {[...Array(3)].map((_, index) => (
                    <CartItemSkeleton key={index} />
                ))}
            </CartLayoutSkeleton>
        );
    }

    return cart.length > 0 ? (
        <CartLayout cart={cart || []} step={step} setStep={setStep}>
            <div className="border border-[#CBCBCB] rounded-lg px-6 py-7 space-y-6">
                {cart.map(({ menuItem, quantity, _id: id }, index) => (
                    <CartItem key={index} id={id} menuItem={menuItem} quantity={quantity} branch={cartBranch} />
                ))}
            </div>
        </CartLayout>
    ) : (
        <EmptyCart />
    );
};

export default ShoppingCart;
