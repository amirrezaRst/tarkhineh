import { toast } from "react-toastify";
import { api } from "@/utils/apiClient";

export const fetchMenuPageItems = async (branchId, category, foodType, isPersian, setItems, signal) => {
    try {
        const data = await api.get(
            `/branch/get-branch-items/${branchId}?sortBy=asc&category=${category}&foodType=${foodType || ""}&isPersian=${isPersian || ""}`,
            { signal }
        );
        setItems(data?.branch?.menus);
    } catch (err) {
        if (err.name !== "AbortError") toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");
    }
}

export const fetchBranchPageItems = async (branchId, category, ratingSort, setItems, signal) => {
    try {
        const data = await api.get(
            `/branch/get-branch-items/${branchId}?limit=10&category=${category}&sortBy=${ratingSort && 'rating'}`,
            { signal }
        );
        setItems(data?.branch?.menus);
    } catch (err) {
        if (err.name !== "AbortError") toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");
    }
}

export const addItemToCart = async (user, menuItemId, branch, setRegisterModal, setLoading, setCart) => {
    if (!user) return setRegisterModal(true);
    setLoading(true);

    try {
        const { cart } = await api.post("/cart/add", { menuItem: menuItemId, branch });
        setCart(cart.items);
        toast.success("آیتم با موفقیت به سبد خرید اضافه شد.");
    } catch (err) {
        if (err.status === 400) toast.error("شعبه آیتم انتخابی با شعبه آیتم‌های موجود در سبد خرید مطابقت ندارد. لطفاً از همان شعبه انتخاب کنید.");
        else toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");
    }
};

export const deleteCart = async (userId, clearCart) => {
    try {
        await api.delete(`/cart/clear/${userId}`);
        clearCart();
        toast.success("سبد خرید با موفقیت خالی شد.");
    } catch (err) {
        if (err.status === 404) toast.error("سبد خریدی پیدا نشد. لطفا دوباره تلاش کنید.");
        else toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");
    }
}

export const removeItemFromCart = async (userId, menuItemId, setIsOpen, setCart) => {
    setIsOpen(false);
    try {
        const { cart } = await api.delete(`/cart/remove/${userId}`, { body: { menuItemId } });
        setCart(cart.items);
        toast.success("آیتم با موفقیت از سبد خرید حذف شد.");
    } catch (err) {
        if (err.status === 404) toast.error("آیتم مورد نظر یافت نشد.");
        else toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");
    }
}

export const increaseItemQuantity = async (user, menuItemId, branch, setCart) => {
    try {
        const { cart } = await api.post("/cart/add", { menuItem: menuItemId, branch });
        setCart(cart.items);
    } catch (err) {
        if (err.status === 400) toast.error("شعبه آیتم انتخابی با شعبه آیتم‌های موجود در سبد خرید مطابقت ندارد. لطفاً از همان شعبه انتخاب کنید.");
        else toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");
    }
};

export const decreaseItemQuantity = async (user, menuItemId, setCart) => {
    try {
        const { cart } = await api.patch(`/cart/decrease/${user?._id}`, { menuItemId });
        toast.success("آیتم با موفقیت از سبد خرید حذف شد.");
        setCart(cart.items);
    } catch (err) {
        if (err.status === 400) toast.error("این آیتم در سبد خرید شما وجود ندارد.");
        else toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");
    }
};
