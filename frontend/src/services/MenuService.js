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

// The branch page needs every item once and groups them by category on the
// client (counts for the tabs, the grid, and the top-rated rail all come from
// this one payload) instead of firing a request per section.
export const fetchAllBranchItems = async (branchId, setItems, signal) => {
    try {
        const data = await api.get(`/branch/get-branch-items/${branchId}`, { signal });
        setItems(data?.branch?.menus || []);
    } catch (err) {
        if (err.name !== "AbortError") { setItems([]); toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید."); }
    }
}

export const fetchSearchItems = async (branchId, search, setItems, signal) => {
    try {
        const data = await api.get(
            `/branch/get-branch-items/${branchId}?sortBy=asc&search=${encodeURIComponent(search)}`,
            { signal }
        );
        setItems(data?.branch?.menus);
    } catch (err) {
        if (err.name !== "AbortError") toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");
    }
}

// Paginated reviews for one menu item (the modal's «نظرات» tab). Returns the
// page so the caller can append it and know whether more pages remain.
export const fetchMenuReviews = async (menuItemId, page = 1, limit = 5, signal) => {
    try {
        const data = await api.get(`/review/allReviews/${menuItemId}?page=${page}&limit=${limit}`, { signal });
        return {
            reviews: data?.reviews || [],
            total: data?.total || 0,
            pages: data?.pages || 1,
            page: data?.page || page,
            distribution: data?.distribution || [0, 0, 0, 0, 0],
        };
    } catch (err) {
        if (err.name !== "AbortError") toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");
        return null;
    }
}

export const fetchBranchReviews = async (branchId, setReviews, signal) => {
    try {
        const data = await api.get(`/branch/${branchId}/reviews?limit=6`, { signal });
        setReviews(data?.reviews || []);
    } catch (err) {
        if (err.name !== "AbortError") setReviews([]);
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
        if (err.status === 409) toast.error("این آیتم در حال حاضر ناموجود است.");
        else if (err.status === 400) toast.error("شعبه آیتم انتخابی با شعبه آیتم‌های موجود در سبد خرید مطابقت ندارد. لطفاً از همان شعبه انتخاب کنید.");
        else toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");
        setLoading(false);
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
