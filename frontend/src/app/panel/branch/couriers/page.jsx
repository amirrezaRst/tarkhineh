"use client";

import { useEffect, useState } from "react";
import useUserStore from "@/stores/useUserStore";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import { DeliveryIcon } from "@/assets/Icons";

const BranchPanelCouriers = () => {
    const branch = useUserStore((state) => state.user?.branch);
    const [couriers, setCouriers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!branch) return;
        const controller = new AbortController();

        api.get(`/branch-manager/couriers/${branch}`, { signal: controller.signal })
            .then((res) => setCouriers(res.data.couriers))
            .catch((err) => { if (err.name !== "AbortError") toast.error("خطایی از سمت سرور پیش آمده، لطفا بعدا دوباره امتحان کنید."); })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [branch]);

    return (
        <>
            <h6 className="text-xl font-semibold">پیک‌های شعبه</h6>

            {!loading && couriers.length === 0 && (
                <p className="text-muted-fg text-super-sm mt-6">پیکی برای این شعبه ثبت نشده است.</p>
            )}

            <div className="grid md:grid-cols-2 gap-4 mt-6">
                {couriers.map((courier) => (
                    <div
                        key={courier._id}
                        className="bg-surface border border-border rounded-lg p-4 flex items-center gap-4"
                    >
                        <div className="w-12 h-12 rounded-full bg-role-courier-subtle text-role-courier flex items-center justify-center shrink-0">
                            <DeliveryIcon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <p className="text-foreground font-medium">{courier.fullName || "بدون نام"}</p>
                            <p className="text-muted-fg text-super-sm mt-0.5">{courier.phoneNumber}</p>
                        </div>
                        <div className="text-left">
                            <p className="text-foreground font-semibold">{PersianNumber(courier.activeOrders)}</p>
                            <p className="text-muted-fg text-super-xs">سفارش فعال</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default BranchPanelCouriers;
