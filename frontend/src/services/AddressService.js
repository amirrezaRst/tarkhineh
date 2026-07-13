import { toast } from "react-toastify";
import { api } from "@/utils/apiClient";

export const handleDeleteAddress = async (userId, index, setIsOpen, setUser) => {
    try {
        const { user } = await api.delete(`/user/deleteAddress/${userId}/${index}`);
        setUser(user);
        toast.success("آدرس با موفقیت حذف شد.");
        setIsOpen(false);
    } catch {
        toast.error("خطایی رخ داده است. لطفا دوباره تلاش کنید.");
    }
};

export const handleEditAddress = async (userId, index, body, setIsOpen, setUser) => {
    try {
        const { user } = await api.put(`/user/editAddress/${userId}/${index}`, body);
        setUser(user);
        toast.success("آدرس با موفقیت به روزرسانی شد.");
        setIsOpen(false);
    } catch (err) {
        if (err.status === 404) return toast.error("کاربر مورد نظر یافت نشد.");
        if (err.status === 400) return toast.error("آدرس مورد نظر یافت نشد.");
        toast.error("خطایی رخ داده است. لطفا دوباره تلاش کنید.");
    }
};

export const handleNewAddress = async (userId, body, setIsOpen, setUser) => {
    try {
        const { user } = await api.post(`/user/newAddress/${userId}`, body);
        setUser(user);
        toast.success("آدرس جدید با موفقیت اضافه شد.");
        setIsOpen(false);
    } catch (err) {
        if (err.status === 404) return toast.error("کاربر مورد نظر یافت نشد.");
        toast.error("خطایی رخ داده است. لطفا دوباره تلاش کنید.");
    }
};
