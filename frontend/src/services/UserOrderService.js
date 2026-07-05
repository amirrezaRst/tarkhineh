import { toast } from "react-toastify";

export const handleCancelOrder = async (orderId, setIsOpenPopup, onStatusUpdate) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/${orderId}/status`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({ status: "cancelled" }),
    }).then(res => res.json());
    const { status, message } = response;

    if (status >= 500) toast.error("خطای سرور رخ داده است. لطفا دوباره تلاش کنید.");

    if (status === 400) toast.error(message);


    setIsOpenPopup(false);
    onStatusUpdate();   //! fetch updated orders

    toast.success("سفارش شما با موفقیت لغو شد.");
};



export const handleReorder = async (orderItems, user, branch, setIsOpenPopup, fetchCart) => {
    const items = orderItems.map(item => ({
        menuItem: item.menuItem._id,
        quantity: item.quantity,
    }));

    const data = {
        user: user._id,
        branch,
        items,
    };


    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/repeat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify(data),
        }).then(res => res.json());

        const { status, message } = response;

        if (status >= 500) {
            toast.error("خطای سرور رخ داده است. لطفا دوباره تلاش کنید.");
        };

        if (status === 400) {
            toast.error("خطا در ثبت سفارش مجدد.");
        };

        if (status === 200 || status === 201) {
            toast.success("سفارش شما با موفقیت به سبد خرید اضافه شد.");
            setIsOpenPopup(false);
            fetchCart();    //! fetch updated cart
        }
    } catch (err) {
        console.error("Error reordering:", err);
        toast.error("خطا در ارتباط با سرور.");
    }
};