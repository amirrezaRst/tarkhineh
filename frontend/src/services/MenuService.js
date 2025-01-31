import { toast } from "react-toastify";

export const fetchMenuPageItems = async (branchId, category, foodType, isPersian, setItems) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branch/get-branch-items/${branchId}?sortBy=asc&category=${category}&foodType=${foodType || ""}&isPersian=${isPersian || ""}`);
    const data = await res.json();

    setItems(data?.branch?.menus);
}

export const fetchBranchPageItems = async (branchId, category, ratingSort, setItems) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/branch/get-branch-items/${branchId}?limit=10&category=${category}&sortBy=${ratingSort && 'rating'}`);
    const data = await res.json();

    setItems(data?.branch?.menus);
}

export const addItemToCart = async (user, menuItemId, branch, setRegisterModal, setLoading, setCart) => {
    if (!user) return setRegisterModal(true);
    setLoading(true);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user: user._id,
            menuItem: menuItemId,
            branch
        }),
        credentials: "include"
    }).then(res => res.json());

    const { status, message, cart } = response;
    if (status == 400) return toast.error("شعبه آیتم انتخابی با شعبه آیتم‌های موجود در سبد خرید مطابقت ندارد. لطفاً از همان شعبه انتخاب کنید.")

    if (status == 500) return toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.")

    setCart(cart.items);

    if (status == 201) {
        toast.success("آیتم با موفقیت به سبد خرید اضافه شد.");
    }
};

export const increaseItemQuantity = async (user, menuItemId, branch, setCart) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/add`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user: user._id,
            menuItem: menuItemId,
            branch
        }),
        credentials: "include"
    }).then(res => res.json());

    const { status, cart } = response;
    if (status == 400) return toast.error("شعبه آیتم انتخابی با شعبه آیتم‌های موجود در سبد خرید مطابقت ندارد. لطفاً از همان شعبه انتخاب کنید.")

    if (status == 500) return toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.")

    setCart(cart.items);
};

export const decreaseItemQuantity = async (user, menuItemId, setCart) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/decrease/${user?._id}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            menuItemId,
        }),
        credentials: "include"
    }).then(res => res.json());

    const { status, cart } = response;

    if (status == 400) return toast.error("این آیتم در سبد خرید شما وجود ندارد.");

    if (status == 500) return toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");

    if (status == 200) toast.success("آیتم با موفقیت از سبد خرید حذف شد.");
    setCart(cart.items);
};