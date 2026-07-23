"use client";

import { useEffect, useMemo, useState } from "react";
import useUserStore from "@/stores/useUserStore";
import { api } from "@/utils/apiClient";
import { toast } from "react-toastify";
import { branchNamesDic } from "@/constant/branchDictionary";
import PersianNumber from "@/utils/ConvertToPersianNumber";
import PanelPageHeader from "@/components/panel/PanelPageHeader";
import MiniStat from "@/components/panel/MiniStat";
import { Skeleton } from "@/components/panel/Skeleton";

const initials = (name, phone) => {
    if (name) {
        const p = name.trim().split(/\s+/);
        return (p[0]?.[0] || "") + (p[1]?.[0] || "");
    }
    return phone ? phone.slice(-2) : "؟";
};

const CourierCard = ({ courier }) => {
    const delivering = courier.activeOrders > 0;
    return (
        <div className="bg-surface rounded-2xl shadow-soft p-5 transition-all duration-200 hover:shadow-soft-lg">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tl from-feature-from to-feature-mid text-white grid place-items-center font-extrabold shrink-0">
                    {initials(courier.fullName, courier.phoneNumber)}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="font-extrabold text-super-sm truncate">{courier.fullName || "بدون نام"}</p>
                    <p className="text-super-xs text-muted-fg tabular-nums">{courier.phoneNumber}</p>
                </div>
                <span className={`shrink-0 inline-flex items-center gap-1.5 text-super-xs font-bold rounded-full px-2.5 py-1 ${delivering ? "bg-status-preparing-subtle text-status-preparing" : "bg-surface-sunken text-muted-fg"}`}>
                    {delivering && (
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-preparing opacity-60" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-status-preparing" />
                        </span>
                    )}
                    {delivering ? "در حال تحویل" : "آزاد"}
                </span>
            </div>

            <div className="flex gap-2.5">
                <div className="flex-1 bg-surface-sunken rounded-xl p-3 text-center">
                    <div className="text-lg font-extrabold tabular-nums">{PersianNumber(courier.activeOrders)}</div>
                    <div className="text-super-xs text-muted-fg mt-0.5">سفارش فعال</div>
                </div>
                <div className="flex-1 bg-surface-sunken rounded-xl p-3 text-center">
                    <div className="text-lg font-extrabold tabular-nums">{PersianNumber(courier.deliveredToday ?? 0)}</div>
                    <div className="text-super-xs text-muted-fg mt-0.5">تحویل امروز</div>
                </div>
            </div>
        </div>
    );
};

const BranchPanelCouriers = () => {
    const branch = useUserStore((state) => state.user?.branch);
    const branchName = branch ? branchNamesDic[branch] : "";
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

    const stats = useMemo(() => ({
        total: couriers.length,
        delivering: couriers.filter((c) => c.activeOrders > 0).length,
        free: couriers.filter((c) => c.activeOrders === 0).length,
        deliveredToday: couriers.reduce((sum, c) => sum + (c.deliveredToday || 0), 0),
    }), [couriers]);

    return (
        <div className="max-w-[1240px]">
            <PanelPageHeader title="پیک‌های شعبه" subtitle={`وضعیت و عملکرد پیک‌های شعبه ${branchName}`} />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-5">
                <MiniStat tone="green" value={PersianNumber(stats.total)} label="کل پیک‌ها" />
                <MiniStat tone="blue" value={PersianNumber(stats.delivering)} label="در حال تحویل" />
                <MiniStat tone="plain" value={PersianNumber(stats.free)} label="آزاد" />
                <MiniStat tone="amber" value={PersianNumber(stats.deliveredToday)} label="تحویل امروز" />
            </div>

            {loading ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                    {[0, 1, 2].map((i) => <Skeleton key={i} className="h-[148px] rounded-2xl" />)}
                </div>
            ) : couriers.length === 0 ? (
                <div className="bg-surface rounded-2xl shadow-soft p-10 text-center text-muted-fg text-super-sm">
                    پیکی برای این شعبه ثبت نشده است.
                </div>
            ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                    {couriers.map((c) => <CourierCard key={c._id} courier={c} />)}
                </div>
            )}
        </div>
    );
};

export default BranchPanelCouriers;
