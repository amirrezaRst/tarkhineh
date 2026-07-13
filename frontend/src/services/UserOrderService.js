import { toast } from "react-toastify";
import { api } from "@/utils/apiClient";

export const handleCancelOrder = async (orderId, setIsOpenPopup, onStatusUpdate) => {
    try {
        await api.patch(`/order/${orderId}/status`, { status: "cancelled" });
        setIsOpenPopup(false);
        onStatusUpdate();   //! fetch updated orders
        toast.success("سفارش شما با موفقیت لغو شد.");
    } catch (err) {
        if (err.status === 400) return toast.error(err.message);
        toast.error("خطای سرور رخ داده است. لطفا دوباره تلاش کنید.");
    }
};

export const handleReorder = async (orderItems, user, branch, setIsOpenPopup, fetchCart) => {
    const items = orderItems.map(item => ({
        menuItem: item.menuItem._id,
        quantity: item.quantity,
    }));

    try {
        await api.post("/cart/repeat", { user: user._id, branch, items });
        toast.success("سفارش شما با موفقیت به سبد خرید اضافه شد.");
        setIsOpenPopup(false);
        fetchCart();    //! fetch updated cart
    } catch (err) {
        if (err.status === 400) return toast.error("خطا در ثبت سفارش مجدد.");
        toast.error("خطای سرور رخ داده است. لطفا دوباره تلاش کنید.");
    }
};
