import { toast } from "react-toastify";
import { api } from "@/utils/apiClient";

export const handleRegister = async (data, setPage, setPhoneNumber, setLoading, setError) => {
    setLoading(true);
    setPhoneNumber(data['phone-number']);

    try {
        await api.post("/user/register", { phoneNumber: data['phone-number'] });
        setPage(1);
        toast.success("کد تایید به شماره موبایل شما ارسال شد.");
    } catch (err) {
        if (err.status === 409) {
            setError('phone-number', { type: 'manual', message: "کاربری با این شماره تلفن قبلا ثبت نام شده." });
        }
    }

    setLoading(false);
}

export const handleSendOtp = async (otp, setOtp, phoneNumber, setLoading, setError, setPage, setIsOpen, fetchUser, fetchCart) => {
    setLoading(true);

    if (!otp) {
        return setError({ message: "کد تایید را وارد کنید." });
    }
    if (otp.toString().length != 5) {
        return setError({ message: "کد تایید باید 5 رقم باشد." });
    }
    if (typeof parseInt(otp, 10) == 'string') {
        return setError({ message: "کد تایید باید عدد باشد." });
    }
    if (isNaN(otp)) {
        return setError({ message: "کد تایید باید عدد باشد." });
    }
    setError({});

    try {
        await api.post("/user/verifyOtp", { phoneNumber, otpCode: otp.toString() });
        fetchUser();
        fetchCart();
        setIsOpen(false);
        setOtp();
        setPage(0);
        toast.success("شما با موفقیت وارد شدید.");
    } catch (err) {
        if (err.status === 403) {
            setError({ message: "کد تایید نامعتبر یا منقضی شده است." });
        } else if (err.status === 404) {
            setError({ message: "کاربری با این شماره تلفن یافت نشد." });
        } else {
            toast.error("خطایی رخ داده است. لطفا دوباره تلاش کنید.");
        }
    }

    setLoading(false);
};

export const handleEditUser = async (body, user, setUser, setLoading) => {
    setLoading(true);

    try {
        const { user: userData } = await api.patch(`/user/editUser/${user._id}`, body);
        const newUser = { ...user, ...userData };
        toast.success("اطلاعات با موفقیت ویرایش شد.");
        setUser(newUser);
    } catch (err) {
        if (err.status === 404) toast.error("کاربری با این شماره تلفن یافت نشد.");
        else toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");
    }

    setLoading(false);
};

export const handleLogout = async (clearUser, clearCart, setIsOpenPopup, router) => {
    try {
        await api.delete("/user/logout");
    } catch {
        toast.error("خطای سرور رخ داده است. لطفا دوباره تلاش کنید.");
    }

    setIsOpenPopup(false);
    router.replace("/");
    clearUser();
    clearCart();

    toast.success("با موفقیت از حساب کاربری خود خارج شدید.");
}
