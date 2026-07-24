import { toast } from "react-toastify";
import { api } from "@/utils/apiClient";

export const setAvailability = async (status, onSuccess) => {
    try {
        const res = await api.patch("/courier/availability", { status });
        onSuccess?.(res.data.courierStatus);
        toast.success(status === "available" ? "آنلاین شدید — آمادهٔ دریافت سفارش." : "آفلاین شدید.");
    } catch {
        toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");
    }
};

export const completeDelivery = async (orderId, code, onSuccess) => {
    try {
        await api.patch(`/courier/deliveries/${orderId}/complete`, { code });
        onSuccess?.();
        return true;
    } catch (err) {
        toast.error(err.status === 400 ? err.message : "خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");
        return false;
    }
};
