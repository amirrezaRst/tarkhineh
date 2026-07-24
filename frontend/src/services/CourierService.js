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

// Courier picks the order up from the branch: preparing -> on_the_way.
export const markPickedUp = async (orderId, onSuccess) => {
    try {
        await api.patch(`/courier/deliveries/${orderId}/pickup`);
        onSuccess?.();
        toast.success("سفارش تحویل گرفته شد؛ در مسیر هستید.");
        return true;
    } catch (err) {
        toast.error(err.status === 400 ? err.message : "خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید.");
        return false;
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
