import CartItem from "./CartItem";
import CartLayout from "./CartLayout";
import EmptyCart from "./EmptyCart";
import CartItemSkeleton from "./CartItemSkeleton";


const ShoppingCart = ({ cart, branchId }) => {
    // const { cart, branchId } = useCart();

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
        <CartLayout cart={cart || []} >
            <div className="border border-[#CBCBCB] rounded-lg px-6 py-7 space-y-6">
                {cart.map(({ menuItem, quantity, _id: id }, index) => (
                    <CartItem key={index} id={id} menuItem={menuItem} quantity={quantity} branch={branchId} />
                ))}
            </div>
        </CartLayout>
    ) : (
        <EmptyCart />
    );
};

export default ShoppingCart;
