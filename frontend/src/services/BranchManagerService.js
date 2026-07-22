import { toast } from "react-toastify";
import { api } from "@/utils/apiClient";

export const toggleMenuAvailability = async (branchId, menuId, available, onSuccess) => {
    try {
        await api.patch(`/branch-manager/menus/${branchId}/${menuId}`, { available });
        onSuccess();
        toast.success(available ? "آیتم به منوی شعبه اضافه شد." : "آیتم از منوی شعبه حذف شد.");
    } catch (err) {
        toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");
    }
};

export const assignCourier = async (orderId, courierId, onSuccess) => {
    try {
        await api.patch(`/order/${orderId}/assign-courier`, { courierId });
        onSuccess();
        toast.success("پیک با موفقیت به سفارش اختصاص یافت.");
    } catch (err) {
        if (err.status === 400) toast.error(err.message);
        else toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");
    }
};

export const updateOrderStatus = async (orderId, status, onSuccess) => {
    try {
        await api.patch(`/order/${orderId}/status`, { status });
        onSuccess();
        toast.success("وضعیت سفارش با موفقیت بروزرسانی شد.");
    } catch (err) {
        if (err.status === 400) toast.error(err.message);
        else toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");
    }
};

export const approveOrder = async (orderId, estimatedDeliveryTime, onSuccess) => {
    try {
        await api.patch(`/order/${orderId}/approved`, { estimatedDeliveryTime });
        onSuccess();
        toast.success("سفارش تایید شد.");
    } catch (err) {
        if (err.status === 400) toast.error(err.message);
        else toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");
    }
};
